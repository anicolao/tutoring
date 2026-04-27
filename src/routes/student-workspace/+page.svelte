<script lang="ts">
	import { resolve } from '$app/paths';
	import MathText from '$lib/components/MathText.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-slate-950 px-4 py-10 text-white">
	<div class="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<p class="text-sm font-semibold tracking-[0.2em] text-violet-300 uppercase">
					Student workspace
				</p>
				<h1 class="mt-2 text-4xl font-bold tracking-tight">Interactive follow-up problem</h1>
			</div>
			<a
				class="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-300 hover:text-violet-200"
				href={resolve('/tutor-dashboard')}
			>
				Back to dashboard
			</a>
		</div>

		<div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<section class="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
				<p class="text-sm font-semibold text-slate-300">Assigned problem</p>
				<p class="mt-4 text-lg leading-8 text-slate-100">
					{#if data.problem}
						<MathText text={data.problem} />
					{:else}
						The tutor has not assigned a follow-up problem yet.
					{/if}
				</p>
			</section>

			<section class="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
				<p class="text-sm font-semibold text-slate-300">Next step</p>
				<p class="mt-4 text-sm leading-7 text-slate-100">
					This initial screen sets up the student workspace so the follow-up tutoring flow can pick
					up the generated problem next.
				</p>
			</section>
		</div>
	</div>
</div>
