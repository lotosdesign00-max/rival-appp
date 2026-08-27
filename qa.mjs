// Rival Space QA — tabs Главная/Академия/[+]/Галерея/Профиль
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.QA_BASE || 'http://localhost:5199'
const OUT = 'qa-shots'
mkdirSync(OUT, { recursive: true })

const errors = []

async function newPage(browser, { width = 390, height = 844, fresh = true } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  if (fresh) await ctx.addInitScript(() => localStorage.clear())
  const page = await ctx.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))
  return { ctx, page }
}

const browser = await chromium.launch()

// ── Pass 1: main flow ──
{
  const { ctx, page } = await newPage(browser)
  await page.goto(BASE)
  await page.waitForTimeout(2600)
  await page.screenshot({ path: `${OUT}/t01-home.png` })

  // center plus → order create → close
  await page.getByRole('button', { name: 'Создать заказ' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/t02-order-step0.png` })
  await page.getByRole('button', { name: 'Закрыть' }).click()
  await page.waitForTimeout(400)

  // services strip → order with preselect
  await page.locator('button', { hasText: 'Аватар' }).first().click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'Далее' }).click()
  await page.waitForTimeout(400)
  await page.getByLabel('Описание задачи').fill('Аватар для канала про астрономию. Спокойный космос, без клише.')
  await page.screenshot({ path: `${OUT}/t03-brief.png` })

  // AI detour: overlay on top of order-create
  await page.getByRole('button', { name: 'Сформулировать с Rival AI' }).click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/t04-ai-overlay.png` })
  await page.getByRole('button', { name: 'Вернуться к оформлению заказа' }).click()
  await page.waitForTimeout(500)
  const briefVal = await page.getByLabel('Описание задачи').inputValue()
  if (!briefVal.includes('астрономию')) errors.push('[draft] brief lost after AI detour')

  await page.getByRole('button', { name: 'Далее' }).click()
  await page.waitForTimeout(400)
  await page.locator('.fixed.inset-0.z-30').getByRole('button', { name: 'До 3 000 ₽', exact: true }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/t05a-step2-slider.png` })
  await page.locator('.fixed.inset-0.z-30').getByRole('button', { name: '1 день', exact: true }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: 'Космос', exact: true }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/t05b-step2-estimate.png` })
  await page.getByRole('button', { name: 'Отправить заказ' }).click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/t05-order-new.png` })
  await page.getByRole('button', { name: 'Оплатить' }).click()
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/t06-order-paid.png` })
  await page.getByRole('button', { name: 'Отлично' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/t06b-paid-detail.png` })
  await page.getByRole('button', { name: 'Назад' }).click()
  await page.waitForTimeout(400)

  // Курсы: course → lesson video → done → next
  await page.getByRole('button', { name: 'Курсы', exact: true }).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/t07-courses.png` })
  await page.locator('button', { hasText: 'Бриф, который работает' }).first().click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/t08-course.png` })
  await page.getByRole('button', { name: /1\. Задача вместо пожеланий/ }).click()
  await page.waitForTimeout(1200)
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('video')
    return v ? { hasVideo: true, src: !!v.querySelector('source')?.src } : { hasVideo: false }
  })
  if (!videoState.hasVideo) errors.push('[courses] video element missing on lesson')
  await page.screenshot({ path: `${OUT}/t09-lesson.png` })
  await page.getByRole('button', { name: 'Отметить пройденным' }).click()
  await page.waitForTimeout(400)
  // next lesson replaces overlay
  await page.getByRole('button', { name: 'Следующий урок' }).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/t09b-lesson2.png` })
  await page.getByRole('button', { name: 'Назад' }).click()
  await page.waitForTimeout(400)
  // AI from course screen? go back to course list, open AI via order flow later
  await page.getByRole('button', { name: 'Назад' }).click()
  await page.waitForTimeout(400)

  // Gallery: Кейсы (big) → категория (works grid → лайтбокс)
  await page.getByRole('button', { name: 'Галерея', exact: true }).click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/t10-gallery.png` })
  // большой кейс открывается
  await page.locator('button', { hasText: 'Nebula Coffee' }).first().click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Назад' }).click()
  await page.waitForTimeout(400)
  // работы: фильтр Айдентика → сетка → лайтбокс
  await page.getByRole('button', { name: 'Айдентика', exact: true }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/t10b-works.png` })
  await page.locator('.px-5.grid button').first().click()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/t10c-lightbox.png` })
  await page.getByRole('button', { name: 'Хочу так' }).click()
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Закрыть' }).click()
  await page.waitForTimeout(400)

  // Profile: orders + topup
  await page.getByRole('button', { name: 'Профиль', exact: true }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/t12-profile.png` })
  await page.getByRole('button', { name: 'Пополнить' }).first().click()
  await page.waitForTimeout(500)
  await page.getByLabel('Сумма пополнения').fill('3000')
  await page.locator('[role=dialog]').getByRole('button', { name: 'Пополнить' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/t13-after-topup.png` })
  await ctx.close()
}

// ── Pass 2: widths + overflow ──
for (const w of [360, 414]) {
  const { ctx, page } = await newPage(browser, { width: w, height: 800 })
  await page.goto(BASE)
  await page.waitForTimeout(2600)
  await page.screenshot({ path: `${OUT}/${w}-home.png` })
  for (const tabName of ['Главная', 'Курсы', 'Галерея', 'Профиль']) {
    await page.getByRole('button', { name: tabName, exact: true }).click()
    await page.waitForTimeout(450)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    if (overflow > 1) errors.push(`[overflow] ${w}px ${tabName}: +${overflow}px`)
  }
  await page.screenshot({ path: `${OUT}/${w}-checked.png` })
  await ctx.close()
}

await browser.close()

if (errors.length) {
  console.log('ISSUES:\n' + errors.join('\n'))
} else {
  console.log('QA CLEAN — no console/page errors, no overflow')
}
