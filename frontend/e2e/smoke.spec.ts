import { test, expect } from '@playwright/test';

test.describe('public pages', () => {
  test('home page renders the marketing hero', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /Master Web3 at Your Own Pace/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse Courses/i })).toBeVisible();
  });

  test('courses page renders', async ({ page }) => {
    await page.goto('/courses');

    await expect(
      page.getByRole('heading', { name: /Browse All Courses/i }),
    ).toBeVisible();
  });
});
