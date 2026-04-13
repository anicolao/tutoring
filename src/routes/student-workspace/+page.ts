export const load = ({ url }) => ({
	problem: url.searchParams.get('problem') ?? ''
});
