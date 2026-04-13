<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const analysis = form?.analysis ?? null;
	const error = form?.error ?? null;
	const transcriptValue = form?.transcript ?? '';
	const promptValue = form?.prompt ?? data.defaultPrompt;
	const imageName = form?.imageName ?? '';
	let isSubmitting = $state(false);
</script>

<div class="min-h-screen bg-slate-950 px-4 py-10 text-white">
	<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
		<section class="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
			<div class="mb-8 flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
						Tutor dashboard
					</p>
					<h1 class="mt-2 text-4xl font-bold tracking-tight">Analyze a completed tutoring session</h1>
				</div>
				<a
					class="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
					href="/"
				>
					Back home
				</a>
			</div>

			<p class="max-w-2xl text-base leading-7 text-slate-300">
				Upload the final whiteboard image, paste the transcript, and send both to Gemini Pro
				Preview v3.0 with a tutor-authored prompt.
			</p>

			<form
				class="mt-8 space-y-6"
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					isSubmitting = true;

					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="rounded-2xl border border-dashed border-white/15 bg-slate-950/70 p-6">
					<label class="block text-sm font-semibold text-slate-100" for="sessionImage">
						Session image
					</label>
					<p class="mt-2 text-sm text-slate-400">
						Upload a whiteboard snapshot, shared screen capture, or handwritten work sample.
					</p>
					<input
						class="mt-4 block w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
						id="sessionImage"
						name="sessionImage"
						type="file"
						accept="image/*"
						required
					/>
					{#if imageName}
						<p class="mt-3 text-sm text-cyan-300">Last analyzed image: {imageName}</p>
					{/if}
				</div>

				<div>
					<label class="block text-sm font-semibold text-slate-100" for="transcript">Transcript</label>
					<textarea
						class="mt-3 min-h-48 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-cyan-300"
						id="transcript"
						name="transcript"
						placeholder="Paste the tutoring conversation here..."
						required
					>{transcriptValue}</textarea>
				</div>

				<div>
					<label class="block text-sm font-semibold text-slate-100" for="prompt">Tutor prompt</label>
					<textarea
						class="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition focus:border-cyan-300"
						id="prompt"
						name="prompt"
						required
					>{promptValue}</textarea>
				</div>

				{#if error}
					<p class="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
						{error}
					</p>
				{/if}

				<button
					class="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-500"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Generating analysis…' : 'Generate Gemini analysis'}
				</button>
			</form>
		</section>

		<section class="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
						Analysis output
					</p>
					<h2 class="mt-2 text-3xl font-bold tracking-tight">Session diagnosis</h2>
				</div>
				{#if analysis}
					<span
						class="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] {analysis.provider === 'gemini'
							? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
							: 'border-amber-400/30 bg-amber-400/10 text-amber-200'}"
					>
						{analysis.provider === 'gemini' ? 'Gemini live' : 'Demo fallback'}
					</span>
				{/if}
			</div>

			{#if analysis}
				<div class="mt-8 space-y-6">
					<div class="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
						<p class="text-sm font-semibold text-slate-300">Model</p>
						<p class="mt-2 text-base text-white">{analysis.model}</p>
					</div>

					<div class="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
						<p class="text-sm font-semibold text-slate-300">Knowledge gaps</p>
						<ul class="mt-3 space-y-3">
							{#each analysis.knowledgeGaps as gap}
								<li class="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-100">
									{gap}
								</li>
							{/each}
						</ul>
					</div>

					<div class="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
						<p class="text-sm font-semibold text-slate-300">Proposed interactive problem</p>
						<p class="mt-3 text-sm leading-7 text-slate-100">{analysis.proposedProblem}</p>
					</div>

					<div class="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
						<p class="text-sm font-semibold text-slate-300">Why this assignment fits</p>
						<p class="mt-3 text-sm leading-7 text-slate-100">{analysis.summary}</p>
					</div>

					<a
						class="inline-flex items-center rounded-full border border-cyan-300/40 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-400/10"
						href={`/student-workspace?problem=${encodeURIComponent(analysis.proposedProblem)}`}
					>
						Open student workspace
					</a>
				</div>
			{:else}
				<div class="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-sm leading-7 text-slate-400">
					Your Gemini analysis will appear here after you submit the form.
				</div>
			{/if}
		</section>
	</div>
</div>
