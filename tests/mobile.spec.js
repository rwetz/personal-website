// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
// Phones: every necessary flow works by touch at portrait, small and landscape sizes.
import { test, expect } from '@playwright/test'
test.use({ hasTouch: true, isMobile: true })
for (const [w, h] of [[390, 844], [360, 640], [844, 390]]) {
  test(`touch flows work at ${w}x${h}`, async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.setViewportSize({ width: w, height: h })
    await page.goto('/#/')
    await expect(page.getByRole('link', { name: /Resume/ })).toBeVisible()
    const header = await page.locator('.showcase-header').evaluate(e => [...e.querySelectorAll('a, button')].every(c => c.getBoundingClientRect().right <= innerWidth))
    expect(header).toBeTruthy()
    for (const name of ['Ateru', 'BibleLM', 'Halcyra', 'Logscope', 'Nexis']) {
      await page.getByRole('tab', { name: new RegExp(name) }).tap()
      await expect(page.locator('h1')).toHaveText(name)
    }
    await page.getByRole('tab', { name: /Ateru/ }).tap()
    const studio = page.getByRole('button', { name: 'Studio', exact: true })
    await studio.scrollIntoViewIfNeeded()
    await studio.tap()
    await expect(studio).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Immerse' }).tap()
    await expect(page.locator('.showcase-shell')).toHaveAttribute('data-immersed', '')
    await page.getByRole('button', { name: 'Leave immersive view' }).tap()
    await expect(page.locator('.showcase-shell')).not.toHaveAttribute('data-immersed', '')
    await page.getByRole('tab', { name: /Nexis/ }).tap()
    const play = page.getByRole('button', { name: /Play Nexis demo/ })
    await play.scrollIntoViewIfNeeded()
    await play.tap()
    await expect(page.getByRole('button', { name: /Pause Nexis demo/ })).toBeVisible()
    await page.getByRole('button', { name: 'About & contact' }).tap()
    await expect(page.locator('h1')).toHaveText(/Hi, I.m Ryan/)
    for (const name of ['Email', 'GitHub', 'LinkedIn']) {
      const link = page.locator('.about-socials').getByRole('link', { name: new RegExp(name) })
      await link.scrollIntoViewIfNeeded()
      await expect(link).toBeInViewport()
    }
    await page.goto('/404.html?seed=7')
    await page.getByRole('button', { name: 'Play: find your way home' }).tap()
    await expect(page.locator('.lost')).toHaveAttribute('data-state', 'playing')
    await page.waitForFunction(() => window.lostGame?.state === 'playing')
    // Tap the screen when the preview lands in a ring, the way a player would.
    for (let i = 0; i < 4; i++) {
      await page.waitForFunction(() => window.lostGame.snapshot().aim?.hit === 'star' || window.lostGame.state !== 'playing', null, { timeout: 15000 })
      await page.touchscreen.tap(w / 2, h / 2)
      await page.waitForFunction(() => window.lostGame.snapshot().mode === 'orbit' || window.lostGame.state !== 'playing')
    }
    expect(await page.evaluate(() => window.lostGame.score)).toBeGreaterThan(0)
    await expect(page.getByRole('link', { name: 'Back to work' }).first()).toBeInViewport()
    await expect(page.getByRole('button', { name: 'Pause' })).toBeInViewport()
    expect(errors).toEqual([])
  })
}
