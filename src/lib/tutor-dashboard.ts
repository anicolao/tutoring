interface TutorDashboardRequest {
	imageBase64: string;
	imageMimeType: string;
	transcript: string;
	prompt: string;
}

export interface TutorDashboardAnalysis {
	provider: 'gemini' | 'fallback';
	model: string;
	knowledgeGaps: string[];
	proposedProblem: string;
	summary: string;
}

export const DEFAULT_PROMPT =
	'Identify the student’s knowledge gaps from this session and propose one interactive follow-up problem that targets those gaps.';

const GEMINI_MODEL = 'gemini-3.1-pro-preview';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildAnalysisPrompt({
	transcript,
	prompt
}: Pick<TutorDashboardRequest, 'transcript' | 'prompt'>) {
	return [
		'You are an expert tutoring diagnostician.',
		'Analyze the uploaded tutoring-session whiteboard image together with the transcript and tutor prompt.',
		'Return strict JSON with keys knowledgeGaps, proposedProblem, and summary.',
		'knowledgeGaps must be an array of concise strings.',
		'proposedProblem must be a single targeted follow-up problem.',
		'summary must explain why the proposed problem addresses the knowledge gaps.',
		'Never wrap the JSON in markdown.',
		'Use LaTeX for all mathematical expressions (e.g., "$x^2$" or "$\\frac{1}{2}$").',
		'',
		`Tutor prompt:\n${prompt}`,
		'',
		`Transcript:\n${transcript}`
	].join('\n');
}

function fallbackAnalysis({
	transcript,
	prompt
}: Pick<TutorDashboardRequest, 'transcript' | 'prompt'>): TutorDashboardAnalysis {
	const normalizedTranscript = transcript.toLowerCase();
	const gapCandidates = [
		normalizedTranscript.includes('negative')
			? 'The student may be missing how negative signs distribute across parentheses, e.g., $-1(x + 1) = -x - 1$.'
			: null,
		normalizedTranscript.includes('fraction')
			? 'The student needs more support simplifying fractions like $\\frac{4}{8}$ before moving to the next step.'
			: null,
		normalizedTranscript.includes('slope')
			? 'The student appears uncertain about how to compute slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$ from two points.'
			: null
	].filter((value): value is string => Boolean(value));

	return {
		provider: 'fallback',
		model: GEMINI_MODEL,
		knowledgeGaps: gapCandidates.length
			? gapCandidates
			: [
					'The student needs a clearer strategy for checking each algebra step, such as $x^2 + 2x + 1 = (x+1)^2$, against the original problem.',
					'The student benefits from one targeted practice problem that reinforces the verbal coaching from the session.'
				],
		proposedProblem: `Solve for $x$ in the equation: $2x^2 - 4x + 2 = 0$.`,
		summary:
			`Fallback analysis for: "${prompt}". ` +
			'Fallback analysis is being shown because no Gemini API key was provided. Add a Gemini API key in the dashboard to enable live analysis in the preview. Note: Math expressions like $x^2$ are now rendered using KaTeX.'
	};
}

function extractText(response: Record<string, unknown>) {
	const candidates = response.candidates;
	if (!Array.isArray(candidates)) {
		throw new Error('Gemini response did not include candidates.');
	}

	const firstCandidate = candidates[0];
	if (!firstCandidate || typeof firstCandidate !== 'object') {
		throw new Error('Gemini response did not include a usable candidate.');
	}

	const content = (firstCandidate as { content?: { parts?: Array<{ text?: string }> } }).content;
	if (!content?.parts?.length) {
		throw new Error('Gemini response did not include content parts.');
	}

	return content.parts
		.map((part) => part.text)
		.filter((part): part is string => typeof part === 'string')
		.join('\n')
		.trim();
}

function parseAnalysis(text: string): Omit<TutorDashboardAnalysis, 'provider' | 'model'> {
	const normalized = text.replace(/^```json\s*|\s*```$/g, '').trim();
	const parsed = JSON.parse(normalized) as Partial<TutorDashboardAnalysis>;

	if (
		!Array.isArray(parsed.knowledgeGaps) ||
		!parsed.knowledgeGaps.every((gap) => typeof gap === 'string') ||
		typeof parsed.proposedProblem !== 'string' ||
		typeof parsed.summary !== 'string'
	) {
		throw new Error('Gemini response JSON did not match the expected tutor dashboard format.');
	}

	return {
		knowledgeGaps: parsed.knowledgeGaps,
		proposedProblem: parsed.proposedProblem,
		summary: parsed.summary
	};
}

export async function analyzeTutorSession(
	request: TutorDashboardRequest,
	apiKey: string | undefined
): Promise<TutorDashboardAnalysis> {
	if (!apiKey) {
		return fallbackAnalysis(request);
	}

	const response = await fetch(GEMINI_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-goog-api-key': apiKey
		},
		body: JSON.stringify({
			generationConfig: {
				responseMimeType: 'application/json'
			},
			contents: [
				{
					role: 'user',
					parts: [
						{ text: buildAnalysisPrompt(request) },
						{
							inlineData: {
								mimeType: request.imageMimeType,
								data: request.imageBase64
							}
						}
					]
				}
			]
		})
	});

	if (!response.ok) {
		throw new Error(`Gemini request failed with status ${response.status}.`);
	}

	const data = (await response.json()) as Record<string, unknown>;
	const text = extractText(data);
	const analysis = parseAnalysis(text);

	return {
		provider: 'gemini',
		model: GEMINI_MODEL,
		...analysis
	};
}
