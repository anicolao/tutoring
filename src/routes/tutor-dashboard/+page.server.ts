import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { analyzeTutorSession } from '$lib/server/tutor-dashboard';

import type { Actions } from './$types';

const DEFAULT_PROMPT =
	'Identify the student’s knowledge gaps from this session and propose one interactive follow-up problem that targets those gaps.';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const image = formData.get('sessionImage');
		const transcript = formData.get('transcript');
		const prompt = formData.get('prompt');

		if (!(image instanceof File) || image.size === 0) {
			return fail(400, {
				error: 'Please upload a session image before generating an analysis.',
				transcript: typeof transcript === 'string' ? transcript : '',
				prompt: typeof prompt === 'string' ? prompt : DEFAULT_PROMPT
			});
		}

		if (typeof transcript !== 'string' || !transcript.trim()) {
			return fail(400, {
				error: 'Please paste the tutoring transcript before generating an analysis.',
				prompt: typeof prompt === 'string' ? prompt : DEFAULT_PROMPT
			});
		}

		const normalizedPrompt = typeof prompt === 'string' && prompt.trim() ? prompt : DEFAULT_PROMPT;
		const buffer = Buffer.from(await image.arrayBuffer());

		try {
			const analysis = await analyzeTutorSession(
				{
					imageBase64: buffer.toString('base64'),
					imageMimeType: image.type || 'image/png',
					transcript: transcript.trim(),
					prompt: normalizedPrompt
				},
				env.GEMINI_API_KEY || env.GOOGLE_API_KEY
			);

			return {
				error: null,
				transcript: transcript.trim(),
				prompt: normalizedPrompt,
				imageName: image.name,
				analysis
			};
		} catch (error) {
			return fail(500, {
				error:
					error instanceof Error
						? error.message
						: 'The tutor dashboard could not complete the analysis.',
				transcript: transcript.trim(),
				prompt: normalizedPrompt
			});
		}
	}
} satisfies Actions;

export const load = () => ({
	defaultPrompt: DEFAULT_PROMPT
});
