#!/usr/bin/env node
// Pure Node.js — no external deps. Generates assets/icon.png (512×512) and assets/icon.ico
const { writeFileSync, mkdirSync } = require('fs')
const { deflateSync } = require('zlib')
const path = require('path')

// ── CRC32 ────────────────────────────────────────────────
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) {
    let n = (c ^ b) & 0xFF
    for (let k = 0; k < 8; k++) n = n & 1 ? 0xEDB88320 ^ (n >>> 1) : n >>> 1
    c = (c >>> 8) ^ n
  }
  return ((c ^ 0xFFFFFFFF) >>> 0)
}
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length)
  const cBuf = Buffer.alloc(4); cBuf.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([l, t, data, cBuf])
}

function renderClock(SIZE) {
  const px = new Uint8Array(SIZE * SIZE * 4)
  function sp(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return
    const i = (y * SIZE + x) * 4
    px[i] = r; px[i+1] = g; px[i+2] = b; px[i+3] = a
  }
  function fillRect(x0, y0, x1, y1, r, g, b, a = 255) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) sp(x, y, r, g, b, a)
  }
  function fillCircle(cx, cy, rad, r, g, b, a = 255) {
    const r2 = rad * rad
    for (let y = Math.max(0, cy-rad); y <= Math.min(SIZE-1, cy+rad); y++)
      for (let x = Math.max(0, cx-rad); x <= Math.min(SIZE-1, cx+rad); x++)
        if ((x-cx)**2 + (y-cy)**2 <= r2) sp(x, y, r, g, b, a)
  }
  function drawThickLine(x1, y1, x2, y2, r, g, b, w) {
    const dx = x2-x1, dy = y2-y1
    const steps = Math.ceil(Math.sqrt(dx*dx + dy*dy) * 2)
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      fillCircle(Math.round(x1+dx*t), Math.round(y1+dy*t), w, r, g, b)
    }
  }
  const s = SIZE / 512
  const CX = SIZE/2, CY = SIZE/2, R = SIZE/2 - Math.round(32*s)
  fillRect(0, 0, SIZE-1, SIZE-1, 15, 32, 39)
  fillCircle(CX, CY, R, 255, 255, 255)
  fillCircle(CX, CY, R - Math.round(26*s), 15, 32, 39)
  for (let i = 0; i < 12; i++) {
    const a = (i/12) * 2*Math.PI - Math.PI/2
    const isMajor = i % 3 === 0
    const r1 = R - Math.round((isMajor?54:44)*s), r2 = R - Math.round(8*s)
    drawThickLine(CX + r1*Math.cos(a), CY + r1*Math.sin(a), CX + r2*Math.cos(a), CY + r2*Math.sin(a),
      255, 255, 255, Math.max(1, Math.round((isMajor?7:3)*s)))
  }
  const hA = -60 * Math.PI/180
  drawThickLine(CX, CY, CX + (R*0.52)*Math.cos(hA), CY + (R*0.52)*Math.sin(hA), 255, 255, 255, Math.max(2, Math.round(13*s)))
  const mA = 60 * Math.PI/180
  drawThickLine(CX, CY, CX + (R*0.72)*Math.cos(mA), CY + (R*0.72)*Math.sin(mA), 224, 224, 224, Math.max(1, Math.round(8*s)))
  const sA = 150 * Math.PI/180
  drawThickLine(CX, CY - Math.round(40*s), CX + (R*0.82)*Math.cos(sA), CY + (R*0.82)*Math.sin(sA), 108, 92, 231, Math.max(1, Math.round(4*s)))
  fillCircle(CX, CY, Math.round(26*s), 108, 92, 231)
  fillCircle(CX, CY, Math.round(10*s), 255, 255, 255)
  return px
}

function encodePng(px, SIZE) {
  const rowBytes = 1 + SIZE * 4
  const raw = Buffer.alloc(SIZE * rowBytes)
  for (let y = 0; y < SIZE; y++) {
    raw[y * rowBytes] = 0
    for (let x = 0; x < SIZE; x++) {
      const s = (y*SIZE+x)*4, d = y*rowBytes+1+x*4
      raw[d]=px[s]; raw[d+1]=px[s+1]; raw[d+2]=px[s+2]; raw[d+3]=px[s+3]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4)
  ihdr[8]=8; ihdr[9]=6
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

function buildIco(pngSizes) {
  // ICO with embedded PNG images (Windows Vista+ format)
  const count = pngSizes.length
  const headerSize = 6 + count * 16
  const pngs = pngSizes.map(({ size, png }) => ({ size, png }))
  const offsets = []
  let offset = headerSize
  for (const { png } of pngs) {
    offsets.push(offset)
    offset += png.length
  }
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)   // reserved
  header.writeUInt16LE(1, 2)   // type: icon
  header.writeUInt16LE(count, 4)
  const dirs = pngs.map(({ size, png }, i) => {
    const d = Buffer.alloc(16)
    d[0] = size >= 256 ? 0 : size  // width (0 = 256)
    d[1] = size >= 256 ? 0 : size  // height
    d[2] = 0   // color count
    d[3] = 0   // reserved
    d.writeUInt16LE(1, 4)  // planes
    d.writeUInt16LE(32, 6) // bit count
    d.writeUInt32LE(png.length, 8)
    d.writeUInt32LE(offsets[i], 12)
    return d
  })
  return Buffer.concat([header, ...dirs, ...pngs.map(p => p.png)])
}

mkdirSync(path.join(__dirname, '../assets'), { recursive: true })

// Generate 512×512 PNG
const png512 = encodePng(renderClock(512), 512)
writeFileSync(path.join(__dirname, '../assets/icon.png'), png512)
console.log('✓ assets/icon.png (512×512)')

// Generate ICO with 256×256 and 64×64 and 32×32
const sizes = [256, 64, 32]
const icoData = buildIco(sizes.map(size => ({ size, png: encodePng(renderClock(size), size) })))
writeFileSync(path.join(__dirname, '../assets/icon.ico'), icoData)
console.log('✓ assets/icon.ico (256/64/32px)')
