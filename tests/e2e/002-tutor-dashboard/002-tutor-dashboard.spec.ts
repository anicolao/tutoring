import { expect, test } from '@playwright/test';

import { TestStepHelper } from '../helpers/test-step-helper';

const transcript = `Tutor: Let's solve -2(x - 3).
Student: I think it becomes -2x minus 3.
Tutor: What happens to the negative sign when it distributes?
Student: I keep forgetting whether it changes both terms.`;

test('Tutor dashboard analysis flow', async ({ page }, testInfo) => {
	const tester = new TestStepHelper(page, testInfo);
	tester.setMetadata(
		'Tutor Dashboard Analysis Flow',
		'Validates the tutor dashboard submission flow and the student workspace handoff.'
	);

	await page.goto('/tutor-dashboard');

	await tester.step('dashboard-form', {
		description: 'Tutor dashboard form',
		verifications: [
			{
				spec: 'Tutor dashboard heading is visible',
				check: async () =>
					await expect(
						page.getByRole('heading', { name: 'Analyze a completed tutoring session' })
					).toBeVisible()
			},
			{
				spec: 'Generate button is visible',
				check: async () =>
					await expect(page.getByRole('button', { name: 'Generate Gemini analysis' })).toBeVisible()
			}
		]
	});

	await page.getByLabel('Session image').setInputFiles({
		name: 'whiteboard.png',
		mimeType: 'image/png',
		buffer: Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9dZY4AAAAASUVORK5CYII=',
			'base64'
		)
	});
	await page.getByLabel('Transcript').fill(transcript);
	await page
		.getByLabel('Tutor prompt')
		.fill('Identify the algebra misconception and propose one short follow-up practice problem.');
	await page.getByRole('button', { name: 'Generate Gemini analysis' }).click();

	await tester.step('analysis-results', {
		description: 'Generated analysis results',
		verifications: [
			{
				spec: 'Knowledge gaps section is visible',
				check: async () => await expect(page.getByText('Knowledge gaps')).toBeVisible()
			},
			{
				spec: 'Fallback badge is visible for test mode',
				check: async () => await expect(page.getByText('Demo fallback')).toBeVisible()
			},
			{
				spec: 'Analysis contains the negative sign insight',
				check: async () =>
					await expect(page.getByText('negative signs distribute across parentheses')).toBeVisible()
			},
			{
				spec: 'Student workspace button is available',
				check: async () =>
					await expect(page.getByRole('button', { name: 'Open student workspace' })).toBeVisible()
			}
		]
	});

	await page.getByRole('button', { name: 'Open student workspace' }).click();

	await tester.step('student-workspace', {
		description: 'Student workspace handoff',
		verifications: [
			{
				spec: 'Student workspace heading is visible',
				check: async () =>
					await expect(
						page.getByRole('heading', { name: 'Interactive follow-up problem' })
					).toBeVisible()
			},
			{
				spec: 'Assigned problem card is populated',
				check: async () =>
					await expect(page.getByText('Identify the algebra misconception')).toBeVisible()
			}
		]
	});

	tester.generateDocs();
});
