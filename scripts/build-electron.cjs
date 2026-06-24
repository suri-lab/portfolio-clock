#!/usr/bin/env node
// esbuild buildSync 기반 — async build()는 native child process를 spawn해 Windows에서 크래시
const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const ASSETS = path.join(DIST, 'assets')

// dist 초기화 — fs.rmSync은 한글 경로에서 Node.js 24 Windows 버그로 크래시
// 대신 cmd.exe의 rmdir /s /q 사용 (cwd 기준 상대경로는 ASCII이므로 안전)
try {
  execSync('if exist dist rmdir /s /q dist', { cwd: ROOT, shell: true, stdio: 'pipe' })
} catch (_) { /* dist가 없을 경우 무시 */ }
fs.mkdirSync(ASSETS, { recursive: true })

// .env 로드 (VITE_WEATHER_API_KEY)
const envPath = path.join(ROOT, '.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim()
  })
}

// index.html 수정: 절대경로 → 상대경로, CSS/JS 주입
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
html = html.replace('href="/favicon.svg"', 'href="./favicon.svg"')
html = html.replace('</head>', '  <link rel="stylesheet" href="./assets/index.css">\n  </head>')
html = html.replace(/<script[^>]+src="[^"]*main\.jsx"[^>]*><\/script>/, '<script src="./assets/main.js"></script>')
fs.writeFileSync(path.join(DIST, 'index.html'), html)

// favicon 복사
fs.copyFileSync(path.join(ROOT, 'public', 'favicon.svg'), path.join(DIST, 'favicon.svg'))
console.log('✓ index.html & favicon ready')

// CSS 빌드 (tailwindcss CLI — 순수 JS, native binary 없음)
console.log('Building CSS...')
execSync(
  'node node_modules/tailwindcss/lib/cli.js -i src/index.css -o dist/assets/index.css --minify',
  { cwd: ROOT, stdio: 'pipe' }
)
console.log('✓ CSS built')

// JS 번들 (buildSync — in-process, child process 미사용)
console.log('Building JS...')
const weatherKey = process.env.VITE_WEATHER_API_KEY || ''
try {
  esbuild.buildSync({
    entryPoints: [path.join(ROOT, 'src/main.jsx')],
    bundle: true,
    outfile: path.join(ASSETS, 'main.js'),
    write: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome120'],
    jsx: 'automatic',          // React 17+ 자동 변환 — import React 불필요
    jsxImportSource: 'react',
    loader: {
      '.jsx': 'jsx',
      '.js': 'js',
      '.css': 'empty',
      '.png': 'dataurl',
      '.svg': 'dataurl',
    },
    define: {
      // import.meta 전체를 객체로 대체 — IIFE 포맷에서 import.meta는 undefined
      'import.meta.env': JSON.stringify({
        VITE_WEATHER_API_KEY: weatherKey,
        MODE: 'production',
        DEV: false,
        PROD: true,
        BASE_URL: './',
        SSR: false,
      }),
      'import.meta.hot': 'undefined',
      'process.env.NODE_ENV': '"production"',
    },
    minify: true,
    sourcemap: false,
  })
  const size = fs.statSync(path.join(ASSETS, 'main.js')).size
  console.log('✓ JS built, size:', (size / 1024).toFixed(1) + 'KB')
} catch (e) {
  console.error('JS build FAILED:', e.message)
  process.exit(1)
}

console.log('\n✓ dist/ 빌드 완료')
