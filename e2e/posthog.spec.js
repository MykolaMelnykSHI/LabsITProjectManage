import { test, expect } from '@playwright/test';

test('trigger posthog events', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => console.log('PAGE ERROR:', exception));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('https://labs-it-project-manage.vercel.app/');
  
  // Wait a bit for PostHog to init
  await page.waitForTimeout(3000);
  
  // Type task
  await page.fill('#task-input', 'My AI test task');
  await page.click('#add-task-btn'); // Triggers task_created
  
  await page.waitForTimeout(2000);
  
  // Delete task
  await page.click('#task-list button'); // Triggers task_deleted
  
  await page.waitForTimeout(3000);
});
