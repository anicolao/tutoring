import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('Homepage renders correctly', async ({ page }, testInfo) => {
	const tester = new TestStepHelper(page, testInfo);
	tester.setMetadata(
		'Initial Homepage Load',
		'Validates that the AI Tutoring Companion homepage loads correctly.'
	);

	await page.goto('/');

	await tester.step('initial-load', {
		description: 'Homepage view',
		verifications: [
			{
				spec: 'Title is visible',
				check: async () => await expect(page.locator('h1')).toHaveText('AI Tutoring Companion')
			},
			{
				spec: 'Tutor Dashboard button is visible',
				check: async () =>
					await expect(page.locator('button', { hasText: 'Tutor Dashboard' })).toBeVisible()
			},
			{
				spec: 'Student Workspace button is visible',
				check: async () =>
					await expect(page.locator('button', { hasText: 'Student Workspace' })).toBeVisible()
			}
		]
	});

	tester.generateDocs();
});
