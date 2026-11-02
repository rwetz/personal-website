// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const ids = ['nexis', 'ferrite', 'biblelm', 'nexis-design', 'logscope']

for (const [width, height] of [[360, 640], [768, 1024], [1440, 900], [844, 390]]) {
  test(`all stages fit ${width}×${height}`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height })
    for (const id of ['', ...ids]) {
      await page.goto(`/#/${id}`)
      await expect(page.locator('h1')).toBeVisible()
      if (['ferrite', 'nexis-design'].includes(id)) await expect(page.locator('.specimen')).toBeVisible()
      if (id && !['ferrite', 'nexis-design'].includes(id)) await expect(page.locator('video')).toHaveAttribute('preload', 'none')
      const clipped = await page.evaluate(() => {
        const main = document.querySelector('main').getBoundingClientRect()
        const elements = [...document.querySelectorAll('main h1, .project-tagline, .project-tags, .project-links, .project-media, .specimen-note, .constellation-object, .intro-enter')]
        return elements.filter(element => {
          if (!element.getClientRects().length) return false
          const r = element.getBoundingClientRect()
          return r.left < -1 || r.right > innerWidth + 1 || r.top < main.top - 1 || r.bottom > main.bottom + 1
        }).map(element => element.className)
      })
      expect(clipped, id || 'home').toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBeTruthy()
    }
    expect(errors).toEqual([])
  })
}

test('deep links, legacy Nexis, invalid hashes, keyboard and history', async ({ page }) => {
  await page.goto('/#nexis')
  await expect(page).toHaveURL(/#\/nexis$/)
  await expect(page.locator('h1')).toHaveText('Nexis')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('h1')).toHaveText('Ferrite')
  await page.keyboard.press('3')
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await page.goBack()
  await expect(page.locator('h1')).toHaveText('Ferrite')
  await page.goForward()
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/#\/$/)
  await page.goto('/#/missing')
  await expect(page).toHaveURL(/#\/$/)
})

test('rail roves focus and selects its labelled panel', async ({ page }) => {
  await page.goto('/#/nexis')
  await page.getByRole('tab', { name: '01 Nexis', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: '02 Ferrite', exact: true })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('02 Ferrite')
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: '05 Logscope', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('#rail-home')).toBeFocused()
})

test('swatches change stage accent while chrome stays Titanium', async ({ page }) => {
  await page.goto('/#/ferrite')
  const chrome = await page.locator('header').evaluate(element => getComputedStyle(element).backgroundColor)
  await page.getByRole('button', { name: 'Use Copper accent' }).click()
  await expect(page.getByRole('button', { name: 'Use Copper accent' })).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--stage-accent').trim())).toBe('#a96b38')
  expect(await page.locator('header').evaluate(element => getComputedStyle(element).backgroundColor)).toBe(chrome)
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--stage-accent').trim())).toBe('#d9603f')
})

test('modal traps focus, protects typing, validates contact and restores focus', async ({ page }) => {
  await page.goto('/#/nexis')
  await page.getByRole('button', { name: 'About & contact' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('North Dakota State University', { exact: true })).toBeVisible()
  await dialog.locator('#contact-name').fill('12345')
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#\/nexis$/)
  await dialog.getByRole('button', { name: 'Send via email' }).click()
  await expect(dialog.locator('#contact-email')).toHaveAttribute('aria-invalid', 'true')
  await expect(dialog.locator('#contact-message')).toHaveAttribute('aria-invalid', 'true')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'About & contact' })).toBeFocused()
})

test('command palette navigates projects and opens About', async ({ page }) => {
  await page.goto('/#/')
  await page.keyboard.press('Control+k')
  await page.getByPlaceholder('Type a command or search…').fill('Logscope')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#\/logscope$/)
  await page.keyboard.press('Control+k')
  await page.getByPlaceholder('Type a command or search…').fill('About')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: 'About Ryan' })).toBeVisible()
})

test('swipe and wheel move once per gesture', async ({ page }) => {
  await page.goto('/#/nexis')
  await expect(page.locator('h1')).toHaveText('Nexis')
  await page.mouse.move(500, 300)
  await page.mouse.down()
  await page.mouse.move(350, 300)
  await page.mouse.up()
  await expect(page).toHaveURL(/#\/ferrite$/)
  await page.locator('main').dispatchEvent('wheel', { deltaY: 100 })
  await expect(page).toHaveURL(/#\/biblelm$/)
  await page.locator('main').dispatchEvent('wheel', { deltaY: 100 })
  await expect(page).toHaveURL(/#\/biblelm$/)
})

test('reduced motion keeps videos paused until explicitly played', async ({ page }) => {
  await page.goto('/#/logscope')
  const video = page.locator('video')
  await expect(video).toBeVisible()
  expect(await video.evaluate(element => element.paused)).toBeTruthy()
  await page.getByRole('button', { name: 'Play Logscope demo' }).click()
  await expect.poll(() => video.evaluate(element => !element.paused)).toBeTruthy()
  await page.getByRole('button', { name: 'Pause Logscope demo' }).click()
  expect(await video.evaluate(element => element.paused)).toBeTruthy()
})

test('every real demo decodes, advances, pauses when hidden and preserves manual pause', async ({ page }) => {
  for (const id of ['nexis', 'biblelm', 'logscope']) {
    await page.goto(`/#/${id}`)
    const video = page.locator('video')
    await expect(video).toBeVisible()
    await page.locator('.media-toggle').click()
    await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(.2)
    expect(await video.evaluate(element => element.error?.message ?? null), id).toBeNull()
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')) })
    await expect.poll(() => video.evaluate(element => element.paused)).toBeTruthy()
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')) })
    await expect.poll(() => video.evaluate(element => element.paused)).toBeFalsy()
    await page.locator('.media-toggle').click()
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(await video.evaluate(element => element.paused)).toBeTruthy()
  }
})

test('desktop hover previews and logo morph work with motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#/')
  const object = page.locator('.object-0')
  await object.hover()
  await expect(page.locator('.constellation-preview')).toBeVisible()
  await object.click()
  await expect(page.locator('h1')).toHaveText('Nexis')
  await expect.poll(() => page.locator('.showcase-wordmark svg path:last-child').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  const emblem = await page.locator('.showcase-wordmark svg path:last-child').getAttribute('d')
  await page.keyboard.press('2')
  await expect(page.locator('h1')).toHaveText('Ferrite')
  await expect.poll(() => page.locator('.showcase-wordmark svg path:last-child').getAttribute('d')).not.toBe(emblem)
  await page.keyboard.press('Escape')
  await expect.poll(() => page.locator('.showcase-wordmark svg path:first-child').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
})

test('WCAG AA scans on every stage, modal and command palette', async ({ page }) => {
  for (const id of ['', ...ids]) {
    await page.goto(`/#/${id}`)
    if (['ferrite', 'nexis-design'].includes(id)) await expect(page.locator('.specimen-note')).toBeVisible()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), id || 'home').toEqual([])
    if (['ferrite', 'nexis-design'].includes(id)) {
      for (const button of await page.locator('.specimen-controls button').all()) {
        await button.click()
        const swatch = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        expect(swatch.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
      }
    }
  }
  await page.getByRole('button', { name: 'About & contact' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const about = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(about.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
  await page.keyboard.press('Escape')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('dialog')).toBeVisible()
  const palette = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(palette.violations.map(v => v.id)).toEqual([])
})
