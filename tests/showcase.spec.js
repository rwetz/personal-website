// ╔══════════════════════════════════════╗
// ║  Ryan Wetzstein                      ║
// ║  Personal Website                    ║
// ║  2026                                ║
// ╚══════════════════════════════════════╝
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { emblems, outline } from '../src/brand/emblems.js'
const ids = ['nexis', 'ateru', 'biblelm', 'halcyra', 'logscope']

for (const [width, height] of [[360, 640], [768, 1024], [1440, 900], [2048, 1152], [844, 390]]) {
  test(`all stages fit ${width}×${height}`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width, height })
    for (const id of ['', ...ids]) {
      await page.goto(`/#/${id}`)
      // Hash navigation can resolve while React still shows the previous stage.
      await expect(page.locator('.showcase-shell')).toHaveAttribute('data-project', id || 'home')
      await expect(page.locator('h1')).toBeVisible()
      if (['ateru', 'halcyra'].includes(id)) await expect(page.locator('.capture-scene')).toBeVisible()
      if (id && !['ateru', 'halcyra'].includes(id)) await expect(page.locator('video')).toHaveAttribute('preload', 'none')
      const clipped = await page.evaluate(() => {
        const main = document.querySelector('main').getBoundingClientRect()
        const elements = [...document.querySelectorAll('main h1, .project-tagline, .project-tags, .project-links, .project-media, .capture-controls, .constellation-object, .intro-enter')]
        return elements.filter(element => {
          if (!element.getClientRects().length) return false
          const r = element.getBoundingClientRect()
          const scrollable = document.querySelector('main').scrollHeight > document.querySelector('main').clientHeight + 1
          return r.left < -1 || r.right > innerWidth + 1 || (!scrollable && (r.top < main.top - 1 || r.bottom > main.bottom + 1))
        }).map(element => element.className)
      })
      expect(clipped, id || 'home').toEqual([])
      if (id) expect(await page.locator('.project-media').evaluate(figure => {
        const outer = figure.getBoundingClientRect()
        const media = figure.querySelector('.capture-image, video, :scope > img')?.getBoundingClientRect()
        return !media || (media.top >= outer.top - 1 && media.bottom <= outer.bottom + 1)
      }), `${id} media must fit inside its figure`).toBeTruthy()
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
  await expect(page.locator('h1')).toHaveText('Ateru')
  await page.keyboard.press('2')
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await page.goBack()
  await expect(page.locator('h1')).toHaveText('Ateru')
  await page.goForward()
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/#\/$/)
  await page.goto('/#/missing')
  await expect(page).toHaveURL(/#\/$/)
})

test('rail roves focus and selects its labelled panel', async ({ page }) => {
  await page.goto('/#/nexis')
  await page.getByRole('tab', { name: '00 Nexis', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: '01 Ateru', exact: true })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('01 Ateru')
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: '04 Logscope', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('#rail-home')).toBeFocused()
})

test('app identities replace the generic gradient and keep home in Geist Sans', async ({ page }) => {
  await page.goto('/#/')
  expect(await page.locator('footer').evaluate(element => getComputedStyle(element).fontFamily)).toContain('Geist Variable')
  expect(await page.locator('.showcase-intro').evaluate(element => getComputedStyle(element).backgroundImage)).toBe('none')
  await page.keyboard.press('1')
  await expect(page.locator('h1')).toHaveText('Ateru')
  await expect(page.locator('.capture-scene')).toBeVisible()
  expect(await page.locator('header').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  expect(await page.locator('h1').evaluate(element => getComputedStyle(element).fontFamily)).toContain('Nunito Variable')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('850 48px "Nunito Variable"'))).toBeTruthy()
  await page.keyboard.press('2')
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await expect(page.locator('video')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('48px "UnifrakturMaguntia"'))).toBeTruthy()
  expect(await page.locator('.project-backdrop').evaluate(element => getComputedStyle(element).backgroundImage)).toBe('none')
  await expect.poll(() => page.locator('.mark-biblelm mask rect:last-child').first().evaluate(element => getComputedStyle(element).opacity)).toBe('0')
})

test('short About shows school progress and direct contact links, traps and restores focus', async ({ page }) => {
  await page.goto('/#/nexis')
  await page.getByRole('button', { name: 'About & contact' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/senior year at North Dakota State University/)).toBeVisible()
  await expect(dialog.getByText(/graduation in May 2027/)).toBeVisible()
  await expect(dialog.locator('#experience, #skills, form')).toHaveCount(0)
  await expect(dialog.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/rwetz')
  await expect(dialog.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://linkedin.com/in/ryan-wetzstein')
  await expect(dialog.getByRole('link', { name: 'Email', exact: true })).toHaveAttribute('href', 'mailto:rwetz00@gmail.com')
  await dialog.getByRole('link', { name: 'LinkedIn', exact: true }).focus()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Close about' })).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#\/nexis$/)
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
  await expect(page.locator('h1')).toHaveText('Logscope')
  await page.keyboard.press('Control+k')
  await page.getByPlaceholder('Type a command or search…').fill('About')
  await page.getByRole('option', { name: 'About & contact', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'About Ryan' })).toBeVisible()
})

test('swipe and wheel move once per gesture', async ({ page }) => {
  await page.goto('/#/nexis')
  await expect(page.locator('h1')).toHaveText('Nexis')
  await page.mouse.move(500, 300)
  await page.mouse.down()
  await page.mouse.move(350, 300)
  await page.mouse.up()
  await expect(page).toHaveURL(/#\/ateru$/)
  await expect(page.locator('h1')).toHaveText('Ateru')
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
  // Sample the transition, including its endpoint: home must never flash a solid star.
  const frames = await page.locator('.showcase-wordmark svg path:last-child').evaluate(async element => {
    const paths = []
    const end = performance.now() + 850
    while (performance.now() < end) {
      paths.push(element.getAttribute('d'))
      await new Promise(requestAnimationFrame)
    }
    return paths
  })
  expect(frames).not.toContain(outline)
  await expect(page.locator('.showcase-wordmark svg path:last-child')).toHaveAttribute('d', emblems.nexis)
  const emblem = await page.locator('.showcase-wordmark svg path:last-child').getAttribute('d')
  await page.keyboard.press('1')
  await expect(page.locator('h1')).toHaveText('Ateru')
  await expect.poll(() => page.locator('.showcase-wordmark svg path:last-child').getAttribute('d')).not.toBe(emblem)
  await expect(page.locator('.showcase-wordmark svg path:last-child')).toHaveAttribute('d', emblems.ateru)
  await page.keyboard.press('2')
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await expect.poll(() => page.locator('.mark-biblelm mask rect:last-child').first().evaluate(element => getComputedStyle(element).opacity)).toBe('0')
  await page.keyboard.press('0')
  await expect(page.locator('h1')).toHaveText('Nexis')
  await expect.poll(() => page.locator('.mark-nexis mask rect:last-child').first().evaluate(element => getComputedStyle(element).opacity)).toBe('1')
  await page.keyboard.press('Escape')
  await expect.poll(() => page.locator('.showcase-wordmark svg path:first-child').evaluate(element => getComputedStyle(element).opacity)).toBe('1')
})

test('WCAG AA scans on every stage, modal and command palette', async ({ page }) => {
  for (const id of ['', ...ids]) {
    await page.goto(`/#/${id}`)
    if (['ateru', 'halcyra'].includes(id)) await expect(page.locator('.capture-scene')).toBeVisible()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), id || 'home').toEqual([])
  }
  await page.getByRole('button', { name: 'About & contact' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  for (const section of ['about', 'contact']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded()
    const about = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(about.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), section).toEqual([])
  }
  await page.keyboard.press('Escape')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('dialog')).toBeVisible()
  const palette = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(palette.violations.map(v => v.id)).toEqual([])
})

test('Ateru gallery changes real captures and its full-size dialog protects navigation', async ({ page }) => {
  await page.goto('/#/ateru')
  await page.getByRole('button', { name: 'Studio', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Studio', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.capture-image')).toHaveAttribute('alt', /studio breakdown/)
  await page.getByRole('button', { name: 'Enlarge Ateru Studio capture' }).click()
  await expect(page.getByRole('dialog', { name: 'Ateru / Studio' })).toBeVisible()
  const captureAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(captureAudit.violations.map(violation => violation.id)).toEqual([])
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#\/ateru$/)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Enlarge Ateru Studio capture' })).toBeFocused()
  await page.keyboard.press('3')
  await expect(page.locator('h1')).toHaveText('Halcyra')
  await expect(page.locator('.capture-image')).toHaveAttribute('alt', /real synthesizer/)
})


test('Halcyra keeps a stable capture frame and reveals artwork after the image decodes', async ({ page }) => {
  let releaseCapture
  const captureReady = new Promise(resolve => { releaseCapture = resolve })
  await page.route(/\/assets\/halcyra-(?!thumb-)[^/]+\.webp$/, async route => {
    await captureReady
    await route.continue()
  })
  await page.goto('/#/halcyra', { waitUntil: 'domcontentloaded' })
  const stage = page.locator('.scene-halcyra')
  await expect(stage).toHaveAttribute('data-media-ready', 'false')
  await expect(page.locator('.project-backdrop')).toHaveCSS('opacity', '0')
  const before = await page.locator('.capture-image').boundingBox()
  expect(before.width).toBeGreaterThan(100)
  expect(before.height).toBeGreaterThan(100)
  releaseCapture()
  await expect(stage).toHaveAttribute('data-media-ready', 'true')
  await expect(page.locator('.project-backdrop')).toHaveCSS('opacity', '1')
  const after = await page.locator('.capture-image').boundingBox()
  expect(after).toEqual(before)
  expect(await page.locator('.capture-image').evaluate(image => image.complete && image.naturalWidth === 1420)).toBeTruthy()
})


test('BibleLM dither respects motion preferences, hidden tabs and route cleanup', async ({ page }) => {
  await page.addInitScript(() => {
    window.ditherDraws = 0
    const draw = WebGL2RenderingContext.prototype.drawArrays
    WebGL2RenderingContext.prototype.drawArrays = function (...args) {
      if (this.canvas.classList.contains('dither-canvas')) window.ditherDraws++
      return draw.apply(this, args)
    }
  })
  await page.goto('/#/biblelm')
  await expect(page.locator('.dither-canvas')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.ditherDraws)).toBeGreaterThan(0)
  await page.waitForTimeout(150)
  const still = await page.evaluate(() => window.ditherDraws)
  await page.waitForTimeout(150)
  expect(await page.evaluate(() => window.ditherDraws)).toBe(still)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(() => page.evaluate(() => window.ditherDraws)).toBeGreaterThan(still + 4)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await page.waitForTimeout(100)
  const hidden = await page.evaluate(() => window.ditherDraws)
  await page.waitForTimeout(150)
  expect(await page.evaluate(() => window.ditherDraws)).toBe(hidden)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await expect.poll(() => page.evaluate(() => window.ditherDraws)).toBeGreaterThan(hidden + 4)
  await page.getByRole('tab', { name: '00 Nexis', exact: true }).click()
  await expect(page.locator('.dither-canvas')).toHaveCount(0)
  const departed = await page.evaluate(() => window.ditherDraws)
  await page.waitForTimeout(150)
  expect(await page.evaluate(() => window.ditherDraws)).toBe(departed)
})

test('BibleLM remains usable without WebGL', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === 'webgl2' ? null : getContext.call(this, type, ...args)
    }
  })
  await page.goto('/#/biblelm')
  await expect(page.locator('h1')).toHaveText('BibleLM')
  await expect(page.locator('video')).toBeVisible()
  await expect(page.locator('.scriptorium-cross')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play BibleLM demo' })).toBeVisible()
  expect(errors).toEqual([])
})


test('first-visit warmup stays nonblocking and remembers successful preparation', async ({ page }) => {
  let release
  const blocked = new Promise(resolve => { release = resolve })
  const videos = []
  page.on('request', request => { if (/\.(mp4|webm)(\?|$)/.test(request.url())) videos.push(request.url()) })
  await page.route(/\/assets\/halcyra-(?!thumb-)[^/]+\.webp$/, async route => {
    await blocked
    await route.continue()
  })
  await page.goto('/#/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('[data-warmup=running]')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(videos).toEqual([])
  await page.getByRole('tab', { name: '00 Nexis', exact: true }).click()
  await expect(page.locator('h1')).toHaveText('Nexis')
  release()
  await expect(page.locator('[data-warmup=done]')).toBeVisible()
  await expect(page.locator('.asset-warmup')).toHaveCount(0)
  await page.reload()
  await expect(page.locator('h1')).toHaveText('Nexis')
  await expect(page.locator('.asset-warmup')).toHaveCount(0)
})

test('each page renders only its assigned effect and stops it under reduced motion', async ({ page }) => {
  await page.addInitScript(() => {
    window.effectDraws = {}
    const draw = WebGL2RenderingContext.prototype.drawArrays
    WebGL2RenderingContext.prototype.drawArrays = function (...args) {
      const name = this.canvas.className
      window.effectDraws[name] = (window.effectDraws[name] || 0) + 1
      return draw.apply(this, args)
    }
  })
  const effects = { home: 'letter-glitch', nexis: 'grainient', ateru: 'threads', biblelm: 'dither', halcyra: 'ghost-fibers', logscope: 'faulty-terminal' }
  await page.goto('/#/')
  for (const [id, effect] of Object.entries(effects)) {
    await page.evaluate(id => { location.hash = id === 'home' ? '#/' : `#/${id}` }, id)
    const canvas = page.locator('.stage-effect canvas')
    await expect(canvas).toHaveCount(1)
    await expect(canvas).toHaveClass(`${effect}-canvas`)
    await expect.poll(() => page.evaluate(name => window.effectDraws[`${name}-canvas`] || 0, effect)).toBeGreaterThan(0)
    // Font/resize redraws can finish later on software-rendered CI browsers.
    // Require a quiet interval instead of assuming initialization takes 200ms.
    await expect.poll(async () => {
      const before = await page.evaluate(name => window.effectDraws[`${name}-canvas`], effect)
      await page.waitForTimeout(400)
      return await page.evaluate(name => window.effectDraws[`${name}-canvas`], effect) === before
    }, { message: `${id} stops drawing under reduced motion`, timeout: 10000 }).toBe(true)
    const still = await page.evaluate(name => window.effectDraws[`${name}-canvas`], effect)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect.poll(() => page.evaluate(name => window.effectDraws[`${name}-canvas`], effect)).toBeGreaterThan(still + 4)
    await page.emulateMedia({ reducedMotion: 'reduce' })
  }
})

test('rubber dock animates the thumb while preserving keyboard and assistive selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#/nexis')
  const thumb = page.locator('.rubber-segment__thumb')
  const start = await thumb.evaluate(element => getComputedStyle(element).clipPath)
  await page.getByRole('tab', { name: '04 Logscope', exact: true }).click()
  await expect(page.getByRole('tab', { name: '04 Logscope', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect.poll(() => thumb.evaluate(element => getComputedStyle(element).clipPath)).not.toBe(start)
  await page.keyboard.press('0')
  await expect(page.getByRole('tab', { name: '00 Nexis', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeFocused()
  await expect(page.locator('.rubber-segment')).toHaveAttribute('data-empty', '')
})
