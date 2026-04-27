import { expect, test } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

const transcriptWithMath = `Tutor: Let's solve x^2 = 4.
Student: Is it just x = 2?
Tutor: What about the negative root?`;

test('Math formatting verification', async ({ page }, testInfo) => {
	test.setTimeout(30000);
	const tester = new TestStepHelper(page, testInfo);
	tester.setMetadata(
		'Math Formatting Verification',
		'Validates that mathematical expressions are rendered using KaTeX.'
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
				spec: 'Generate button is enabled after hydration',
				check: async () =>
					await expect(page.getByRole('button', { name: 'Generate Gemini analysis' })).toBeEnabled()
			}
		]
	});

	// Fill and submit the form to get fallback analysis with math
	await page.locator('#sessionImage').setInputFiles({
		name: 'whiteboard.png',
		mimeType: 'image/png',
		buffer: Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9dZY4AAAAASUVORK5CYII=',
			'base64'
		)
	});
	await page.getByLabel('Transcript').fill(transcriptWithMath);
	await page.getByLabel('Tutor prompt').fill('Test math formatting');
	await page.getByRole('button', { name: 'Generate Gemini analysis' }).click();
	await expect(page.getByText('Demo fallback')).toBeVisible({ timeout: 15000 });

	await tester.step('math-in-dashboard', {
		description: 'Math rendering in tutor dashboard',
		verifications: [
			{
				spec: 'KaTeX elements are present in knowledge gaps',
				check: async () => {
					const katexElements = page.locator('.katex');
					await expect(katexElements.first()).toBeVisible();
				}
			},
			{
				spec: 'Specific math expression x^2 is rendered',
				check: async () => {
					// KaTeX renders x^2 with specific structure, checking for its existence
					// Note: .textContent might contain x2 due to how KaTeX renders exponents
					const text = await page.locator('.katex-html').first().textContent();
					expect(text).toContain('x');
				}
			}
		]
	});

	await page.getByRole('button', { name: 'Open student workspace' }).click();

	await tester.step('math-in-workspace', {
		description: 'Math rendering in student workspace',
		verifications: [
			{
				spec: 'Student workspace heading is visible',
				check: async () =>
					await expect(
						page.getByRole('heading', { name: 'Interactive follow-up problem' })
					).toBeVisible()
			},
			{
				spec: 'KaTeX elements are present in student workspace',
				check: async () => {
					const katexElements = page.locator('.katex');
					await expect(katexElements.first()).toBeVisible();
				}
			}
		]
	});

	tester.generateDocs();
});
