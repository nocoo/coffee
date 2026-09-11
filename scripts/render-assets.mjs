import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Render the approved, archived masters locally. No network or generation calls.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '.work/browsers';
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  const png = async (file) =>
    `data:image/png;base64,${(await readFile(new URL(file, import.meta.url))).toString('base64')}`;
  const foreground = await png('../logo.png');
  const presentation = await png('../assets/brand/icon.png');
  const rounded = await png('../assets/brand/icon-rounded.png');
  const background = await png('../assets/brand/background.png');
  for (const [file, size, image] of [
    ['favicon-16.png', 16, foreground],
    ['favicon.png', 32, foreground],
    ['logo-80.png', 80, foreground],
    ['icon-192.png', 192, presentation],
    ['icon-512.png', 512, presentation],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>body{margin:0}img{width:100vw;height:100vh;display:block}</style><img src="${image}" alt="">`,
    );
    await page.evaluate(() => document.images[0].decode());
    await page.screenshot({ path: `public/${file}`, omitBackground: true });
  }
  // A 94% whole-foreground placement fits the PWA's central 40%-radius safe circle.
  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(
    `<style>body{margin:0}img{position:absolute;width:512px;height:512px}.mark{inset:3%;width:94%;height:94%;filter:drop-shadow(1px 3px 4px #825b5024)}</style><img src="${background}" alt=""><img class="mark" src="${foreground}" alt="">`,
  );
  await page.evaluate(() => Promise.all([...document.images].map((image) => image.decode())));
  await page.screenshot({ path: 'public/icon-maskable-512.png' });
  const font = async (file) =>
    (await readFile(new URL(`../public/fonts/${file}.woff2`, import.meta.url))).toString('base64');
  const serif = await font('instrument-serif-latin');
  const italic = await font('instrument-serif-italic-latin');
  const sans = await font('dm-sans-latin');
  const colors = [
    '#eda9b4',
    '#c3b1dc',
    '#eed17d',
    '#c4a382',
    '#d99b73',
    '#b5a8a6',
    '#b4c98e',
    '#acb5ab',
  ];
  const point = (radius, angle) => `${Math.cos(angle) * radius},${Math.sin(angle) * radius}`;
  const arc = (inner, outer, start, end) =>
    `M${point(inner, start)}L${point(outer, start)}A${outer},${outer} 0 0 1 ${point(outer, end)}L${point(inner, end)}A${inner},${inner} 0 0 0 ${point(inner, start)}Z`;
  const wedges = colors
    .map((color, i) => {
      const start = (i * Math.PI) / 4;
      let paths = `<path d="${arc(137, 201, start + 0.025, start + Math.PI / 4 - 0.025)}"/>`;
      for (let j = 0; j < 3; j++) {
        const angle = start + (j * Math.PI) / 12;
        paths += `<path d="${arc(211, 263, angle + 0.02, angle + Math.PI / 12 - 0.02)}"/>`;
        for (let k = 0; k < 4; k++) {
          const a = angle + (k * Math.PI) / 48;
          paths += `<path d="${arc(275, 310, a + 0.01, a + Math.PI / 48 - 0.01)}"/>`;
        }
      }
      return `<g fill="${color}" stroke="${color}" stroke-width="4" stroke-linejoin="round">${paths}</g>`;
    })
    .join('');
  await page.setViewportSize({ width: 1536, height: 1024 });
  await page.setContent(`<!doctype html><html lang="en"><head><style>
    @font-face{font-family:Serif;src:url(data:font/woff2;base64,${serif})}
    @font-face{font-family:Serif;src:url(data:font/woff2;base64,${italic});font-style:italic}
    @font-face{font-family:Sans;src:url(data:font/woff2;base64,${sans})}
    *{box-sizing:border-box}body{margin:0;background:#f8f6f0;color:#36352f;font-family:Sans,sans-serif}
    main{position:relative;width:1536px;height:1024px;padding:72px 90px;overflow:hidden}
    header{display:flex;align-items:center;justify-content:space-between;padding-bottom:32px;border-bottom:1px solid #dcd9d0}
    .logo{display:flex;align-items:center;font-family:Serif;font-size:62px;gap:14px}.logo img{width:76px;height:76px}
    .micro{font-size:15px;letter-spacing:2.3px}section{position:absolute;top:287px;width:685px;z-index:1}
    h1{font-family:Serif;font-weight:400;font-size:113px;line-height:.98;letter-spacing:-3px;margin:28px 0 30px}
    h1 em{display:block;color:#728a63}p{font-size:22px;line-height:1.8;color:#6c6b61;max-width:545px}
    .wheel{position:absolute;left:840px;top:232px;width:635px;height:635px;transform:rotate(-14deg)}
    footer{position:absolute;bottom:65px;left:90px;right:90px;display:flex;justify-content:space-between;border-top:1px solid #dcd9d0;padding-top:30px;font-size:16px;color:#6c6b61}
  </style></head><body><main>
    <header><div class="logo"><img src="${rounded}" alt=""><span>coffee.</span></div><span class="micro">A COFFEE FLAVOR UNIVERSE</span></header>
    <section><span class="micro">FOR THE EVER-CURIOUS PALATE</span><h1>A little curiosity.<em>A world of flavor.</em></h1><p>96 flavors. 23 origins. 10 ways to brew.<br>Follow your senses, one cup at a time.</p></section>
    <svg class="wheel" viewBox="-355 -355 710 710" aria-hidden="true"><defs>
      <radialGradient id="ceramic" cx="30%" cy="25%"><stop stop-color="#fff5e7"/><stop offset="1" stop-color="#e5bbac"/></radialGradient>
      <radialGradient id="coffee"><stop stop-color="#825746"/><stop offset="1" stop-color="#583b30"/></radialGradient>
      <filter id="soft"><feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#806a53" flood-opacity=".13"/></filter>
    </defs><circle r="346" fill="none" stroke="#ddd9ce" stroke-dasharray="2 8"/>
    <g filter="url(#soft)">${wedges}<circle r="119" fill="#eee1d5"/><path d="M87 -37C166 -61 167 64 84 49" fill="none" stroke="#e7c4b2" stroke-width="20"/><circle r="99" fill="url(#ceramic)"/><circle r="80" fill="url(#coffee)"/><circle r="77" fill="none" stroke="#c69c75" stroke-width="3"/><path d="M-48 -45Q-21 -66 16 -57" fill="none" stroke="#ead6b4" stroke-width="6" stroke-linecap="round" opacity=".45"/></g></svg>
    <footer><span>Sip slowly. Stay curious.</span><span>COFFEE.HEXLY.AI</span></footer>
  </main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((image) => image.decode())));
  await page.screenshot({ path: 'public/og.png' });
  console.log(
    'Rendered transparent marks (16², 32², 80²), platform icons (192², 512², maskable 512²) and OpenGraph image (1536×1024).',
  );
} finally {
  await browser.close();
}
