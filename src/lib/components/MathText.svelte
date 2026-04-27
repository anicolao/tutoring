<script lang="ts">
	import katex from 'katex';

	interface Props {
		text: string;
	}

	let { text = '' }: Props = $props();

	function parseText(input: string) {
		if (!input) return [];
		// Split by $$...$$ or $...$
		const parts = input.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);
		return parts.map((part) => {
			if (part.startsWith('$$') && part.endsWith('$$')) {
				return {
					type: 'block',
					content: katex.renderToString(part.slice(2, -2), {
						displayMode: true,
						throwOnError: false
					})
				};
			} else if (part.startsWith('$') && part.endsWith('$')) {
				return {
					type: 'inline',
					content: katex.renderToString(part.slice(1, -1), {
						displayMode: false,
						throwOnError: false
					})
				};
			} else {
				return { type: 'text', content: part };
			}
		});
	}

	let parsedParts = $derived(parseText(text));
</script>

{#each parsedParts as part, i (i)}
	{#if part.type === 'text'}
		{part.content}
	{:else}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html part.content}
	{/if}
{/each}
