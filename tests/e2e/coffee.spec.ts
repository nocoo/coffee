import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  // Catch real runtime and CSP errors. SwiftShader's screenshot/ReadPixels warnings are not errors.
  await page.exposeFunction('coffeeRuntimeErrors', () => errors);
});

test.afterEach(async ({ page }) => {
  if (page.isClosed() || page.url() === 'about:blank') return;
  const errors = await page.evaluate(async () => {
    const getErrors = (window as unknown as { coffeeRuntimeErrors: () => Promise<string[]> })
      .coffeeRuntimeErrors;
    return getErrors();
  });
  expect(errors, 'Browser runtime and console errors').toEqual([]);
});

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    'The page must fit the viewport',
  ).toBe(true);
}

test('real 3D selection, rotation, zoom, favorites and a keyboard-accessible 2D fallback', async ({
  page,
}) => {
  await page.goto('/?lang=en');
  const wheel = page.locator('[data-graphics]');
  await expect(wheel).toHaveAttribute('data-graphics', '3d');
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Missing 3D canvas');
  await canvas.click({ position: { x: box.width * 0.5, y: box.height * 0.28 } });
  await expect(page.locator('.selected-preview strong')).not.toHaveText('Strawberry');
  const label = page.locator('.wheel-family-label').first();
  const before = await label.getAttribute('style');
  await page.getByRole('button', { name: 'Rotate right', exact: true }).click();
  await expect(label).not.toHaveAttribute('style', before ?? '');
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reset view' })).toHaveText('110%');
  await page.getByRole('button', { name: 'Reset view' }).click();
  await page.getByRole('searchbox', { name: 'Find a flavor', exact: true }).fill('茉莉');
  await page.locator('.flavor-tile').filter({ hasText: 'Jasmine' }).click();
  await expect(
    page.getByTestId('flavor-detail').getByRole('heading', { name: 'Jasmine', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Save flavor', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Unsave flavor', exact: true })).toBeVisible();
  await page.locator('.settings-menu > summary').click();
  await page.getByRole('checkbox', { name: 'Lightweight 2D view' }).check();
  await expect(page.getByTestId('flat-wheel')).toBeVisible();
  await page.locator('.settings-menu > summary').click();
  const lemon = page.getByTestId('flat-wheel').getByRole('link', { name: 'Lemon', exact: true });
  await lemon.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.selected-preview strong')).toHaveText('Lemon');
  await noOverflow(page);
});

test('language, all themes and reduced-motion preferences persist on reload', async ({ page }) => {
  await page.goto('/?lang=en&flavor=jasmine');
  await page.getByRole('button', { name: '切换为中文', exact: true }).click();
  await expect(page.getByTestId('flavor-detail')).toContainText('茉莉');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.locator('.settings-menu > summary').click();
  for (const [name, value] of [
    ['Midnight espresso', 'espresso'],
    ['Natural terroir', 'terroir'],
    ['Candy daylight', 'daylight'],
  ]) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', value ?? '');
  }
  await page.getByRole('button', { name: 'Midnight espresso', exact: true }).click();
  await page.getByRole('checkbox', { name: 'High contrast', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'Reduce motion', exact: true })).toBeChecked();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'espresso');
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('global bilingual search combines four filters and opens the real origin', async ({
  page,
}) => {
  await page.goto('/?lang=en');
  await page.getByRole('button', { name: 'Search the coffee universe', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox', { name: 'All content' }).selectOption('origin');
  await dialog.getByRole('combobox', { name: 'All flavor families' }).selectOption('floral');
  await dialog.getByRole('combobox', { name: 'All regions' }).selectOption('africa');
  await dialog.getByRole('combobox', { name: 'All processes' }).selectOption('washed');
  await dialog.getByRole('searchbox', { name: 'Search', exact: true }).fill('埃塞俄比亚');
  await expect(dialog.locator('.search-result')).toHaveCount(1);
  await dialog.getByRole('link').filter({ hasText: 'Ethiopia' }).click();
  await expect(page).toHaveURL(/\/origins\?origin=ethiopia/);
  await expect(page.getByTestId('origin-detail')).toContainText('Yirgacheffe');
  await page.getByRole('button', { name: '切换为中文', exact: true }).click();
  await expect(page.getByTestId('origin-detail')).toContainText('耶加雪菲');
  await expect(page.getByTestId('origin-detail')).toContainText('水洗');
  await noOverflow(page);
});

test('calculator scales, reverses, labels espresso yield, rejects invalid input and transfers precise doses', async ({
  page,
}) => {
  await page.goto('/brew?lang=en&method=v60');
  const result = page.getByTestId('recipe-result');
  await expect(result).toContainText('240');
  await page.getByTestId('recipe-servings').fill('2');
  await expect(result).toContainText('480');
  await expect(result).toContainText('30');
  await page.getByRole('button', { name: 'From water / yield', exact: true }).click();
  await page.getByTestId('recipe-amount').fill('250');
  await expect(result).toContainText('500');
  await expect(result).toContainText('31.3');
  await page.getByRole('button', { name: 'Add to a tasting note', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Give this cup a name' })
    .fill('Precise water-based recipe');
  await expect(
    page.getByRole('spinbutton', { name: 'Ground coffee (g)', exact: true }),
  ).toHaveValue('31.25');
  await page.getByRole('button', { name: 'Save tasting note', exact: true }).click();
  await expect(page.locator('.saved-note')).toHaveCount(1);
  await page.goto('/brew?lang=en&method=espresso');
  await expect(result).toContainText('Beverage yield');
  await expect(result).toContainText('36');
  await page.getByTestId('recipe-amount').fill('0');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Add to a tasting note', exact: true }),
  ).toBeDisabled();
  await noOverflow(page);
});

test('recommendations retain process and roast through a customized recipe', async ({ page }) => {
  await page.goto('/brew?lang=en');
  const preferences = page.locator('.preference-panel');
  await preferences.getByRole('combobox', { name: 'Flavor family' }).selectOption('floral');
  await preferences.getByRole('combobox', { name: 'Process', exact: true }).selectOption('washed');
  await preferences.getByRole('combobox', { name: 'Roast', exact: true }).selectOption('light');
  await page
    .locator('.recommend-card')
    .first()
    .getByRole('button', { name: 'Try this recipe' })
    .click();
  await expect(page).toHaveURL(/process=washed/);
  await page.getByTestId('recipe-amount').fill('20');
  await page.getByRole('button', { name: 'Add to a tasting note', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Process', exact: true })).toHaveValue('washed');
  await expect(page.getByRole('combobox', { name: 'Roast', exact: true })).toHaveValue('light');
  await expect(
    page.getByRole('spinbutton', { name: 'Ground coffee (g)', exact: true }),
  ).toHaveValue('20');
});

test('journal saves, edits across routes, survives reload, copies, exports and confirms deletion', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/journal?lang=en');
  await page.getByRole('textbox', { name: 'Give this cup a name' }).fill('A jasmine morning');
  await page
    .getByRole('textbox', { name: 'What else stays with you' })
    .fill('Floral aroma; clear aftertaste.');
  await page.locator('#add-note-flavor').selectOption('jasmine');
  await page.getByRole('button', { name: 'Save tasting note', exact: true }).click();
  await expect(page.locator('.saved-note')).toHaveCount(1);
  await page.getByRole('link', { name: 'Choose from the wheel' }).click();
  await page.getByRole('searchbox', { name: 'Find a flavor' }).fill('bergamot');
  await page.locator('.flavor-tile').filter({ hasText: 'Bergamot' }).click();
  await page.getByRole('button', { name: 'Add to a tasting note', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Give this cup a name' })).toHaveValue(
    'A jasmine morning',
  );
  await page.getByRole('button', { name: 'Save tasting note', exact: true }).click();
  await expect(page.locator('.saved-note')).toHaveCount(1);
  await expect(page.locator('.saved-note')).toContainText('Bergamot');
  await page.reload();
  await page.getByRole('button', { name: 'View & edit', exact: true }).click();
  await page.getByRole('button', { name: 'Copy as text', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('A jasmine morning');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^coffee-\d{4}-\d{2}-\d{2}\.md$/);
  await page.getByRole('button', { name: 'Delete this note: A jasmine morning' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.saved-note')).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete this note: A jasmine morning' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete note', exact: true }).click();
  await expect(page.locator('.saved-note')).toHaveCount(0);
});

test('learning deep links, durable progress and a real quiz response', async ({ page }) => {
  await page.goto('/learn?lang=en&article=water');
  const reader = page.getByTestId('lesson-reader');
  await expect(reader).toContainText('alkalinity');
  await reader.getByRole('button', { name: 'Mark practice complete', exact: true }).click();
  await page.reload();
  await expect(reader.locator('.completed-badge')).toBeVisible();
  await page.goto('/learn?lang=en&topic=processes&item=washed');
  await expect(page.locator('.materials-list details[open]')).toContainText('Washed');
  await page.locator('.quiz-options button').first().click();
  await expect(page.locator('.quiz-feedback')).toBeVisible();
  for (const option of await page.locator('.quiz-options button').all()) {
    await expect(option).toBeDisabled();
  }
  await noOverflow(page);
});

test('exhibition advances without input and sound exists only after opt-in', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const NativeAudioContext = window.AudioContext;
    const contexts: AudioContext[] = [];
    Object.defineProperty(window, 'coffeeTestAudio', { value: contexts });
    window.AudioContext = class extends NativeAudioContext {
      constructor(options?: AudioContextOptions) {
        super(options);
        contexts.push(this);
      }
    };
  });
  await page.goto('/display?lang=en');
  const audioStates = () =>
    page.evaluate(() =>
      (window as unknown as { coffeeTestAudio: AudioContext[] }).coffeeTestAudio.map(
        (ctx) => ctx.state,
      ),
    );
  await expect(page.getByTestId('exhibition-title')).toHaveText('Jasmine');
  expect(await audioStates()).toEqual([]);
  await expect(page.getByTestId('exhibition-title')).toHaveText('Ethiopia', { timeout: 18000 });
  await page.getByRole('button', { name: 'Pause tour', exact: true }).click();
  await page.getByRole('button', { name: 'Next stop', exact: true }).click();
  await expect(page.getByTestId('exhibition-title')).toContainText('V60');
  await expect(page.getByRole('button', { name: 'Play tour', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Enable ambient sound', exact: true }).click();
  await expect.poll(audioStates).toEqual(['running']);
  await page.getByRole('slider', { name: 'Volume', exact: true }).fill('12');
  await page.getByRole('button', { name: 'Mute ambient sound', exact: true }).click();
  await expect.poll(audioStates).toEqual(['suspended']);
  if (testInfo.project.name === 'desktop') {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: testInfo.outputPath('exhibition-1920.png') });
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1),
    ).toBe(true);
  }
  await noOverflow(page);
  await page.reload();
  expect(await audioStates()).toEqual([]);
  await page.getByRole('button', { name: 'Exit exhibition', exact: true }).click();
  await expect(page.locator('.universe-hero')).toBeVisible();
});

for (const theme of ['daylight', 'espresso', 'terroir']) {
  test(`all pages meet core accessibility checks in ${theme}`, async ({ page }) => {
    test.setTimeout(120000);
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem(
        'coffee.preferences.v1',
        JSON.stringify({ locale: 'en', theme: selectedTheme, flat: true }),
      );
    }, theme);
    for (const path of ['/', '/origins', '/brew', '/learn', '/journal', '/display']) {
      await page.goto(`${path}?lang=en`);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      const violations = result.violations.map(({ id, nodes }) => ({
        id,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      }));
      expect(violations, `Accessibility on ${path} / ${theme}`).toEqual([]);
      await noOverflow(page);
    }
    if (theme === 'espresso') {
      await page.goto('/?lang=en');
      for (const family of await page.locator('.family-tabs > button').all()) {
        await family.click();
        const result = await new AxeBuilder({ page })
          .include('.flavor-explorer')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(
          result.violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
          })),
          'Every family color must remain readable at night',
        ).toEqual([]);
      }
    }
  });
}

test('unknown routes show a localized recoverable 404', async ({ page }) => {
  await page.goto('/a-missing-world?lang=en');
  await expect(page.locator('.not-found h1')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
  await page.getByRole('button', { name: 'Back to the universe', exact: true }).click();
  await expect(page.locator('.universe-hero')).toBeVisible();
});

test('lightweight mode avoids downloading the Three engine', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.addInitScript(() => {
    localStorage.setItem('coffee.preferences.v1', JSON.stringify({ locale: 'en', flat: true }));
  });
  await page.goto('/?lang=en', { waitUntil: 'networkidle' });
  await expect(page.getByTestId('flat-wheel')).toBeVisible();
  expect(scripts.filter((url) => /\/(three|FlavorScene)-/.test(url))).toEqual([]);
});
