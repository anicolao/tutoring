<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
	<div
		class="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl"
	>
		<div class="mb-6 flex justify-center">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600"
			>
				AI
			</div>
		</div>

		<h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">AI Tutoring Companion</h1>

		<p class="mb-8 text-lg leading-relaxed text-gray-600">
			Detect knowledge gaps directly from live sessions and generate interactive problem sets.
		</p>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<a
				class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
				href={resolve('/tutor-dashboard')}
			>
				Tutor Dashboard
			</a>
			<a
				class="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50"
				href={resolve('/student-workspace')}
			>
				Student Workspace
			</a>
		</div>
	</div>
</div>
