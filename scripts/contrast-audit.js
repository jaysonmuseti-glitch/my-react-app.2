import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

function readFile(rel) {
  const p = path.resolve(scriptDir, '..', rel)
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''
}

function parseVars(css) {
  const vars = {}
  const re = /--([\w-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(css))) vars[m[1]] = m[2].trim()
  return vars
}

function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const r = parseInt(hex.slice(0,2),16)
  const g = parseInt(hex.slice(2,4),16)
  const b = parseInt(hex.slice(4,6),16)
  return [r,g,b]
}

function rgbaToRgb(rgba, bg=[7,18,26]){
  // rgba(r,g,b,a) over bg
  const nums = rgba.match(/rgba?\(([^)]+)\)/i)[1].split(',').map(s=>s.trim())
  let [r,g,b] = nums
  const a = nums[3]===undefined?1:Number(nums[3])
  r = Number(r); g = Number(g); b = Number(b)
  const out = [
    Math.round(r*a + bg[0]*(1-a)),
    Math.round(g*a + bg[1]*(1-a)),
    Math.round(b*a + bg[2]*(1-a))
  ]
  return out
}

function srgb2lin(c){
  c = c/255
  return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4)
}

function luminance(rgb){
  return 0.2126*srgb2lin(rgb[0]) + 0.7152*srgb2lin(rgb[1]) + 0.0722*srgb2lin(rgb[2])
}

function contrast(a,b){
  const L1 = luminance(a)
  const L2 = luminance(b)
  const big = Math.max(L1,L2)
  const small = Math.min(L1,L2)
  return (big+0.05)/(small+0.05)
}

function parseColor(val, vars){
  if(!val) return null
  val = val.trim()
  if(val.startsWith('var(')){
    const key = val.replace(/var\(--/,'').replace(/\)/,'')
    return parseColor(vars[key], vars)
  }
  if(val.startsWith('#')) return hexToRgb(val)
  if(val.startsWith('rgb')) return rgbaToRgb(val)
  // fallback: try hex inside
  const hex = val.match(/#([0-9a-fA-F]{3,6})/)
  if(hex) return hexToRgb(hex[0])
  return null
}

const css1 = readFile('src/App.css')
const css2 = readFile('src/index.css')
const vars = Object.assign({}, parseVars(css2), parseVars(css1))

const getVar = (keys) => {
  for (const key of keys) if (vars[key]) return vars[key]
  return undefined
}

const checks = [
  {name:'Main text vs background', fg: getVar(['text-primary','text']), bg: getVar(['bg-primary','bg'])},
  {name:'Muted text vs background', fg: getVar(['text-secondary','muted']), bg: getVar(['bg-primary','bg'])},
  {name:'Panel text vs panel', fg: getVar(['text-primary','text']), bg: getVar(['bg-surface','panel','bg'])},
  {name:'Accent foreground vs accent', fg: getVar(['bg-primary','accent-foreground']), bg: getVar(['accent-cyan','accent'])},
]

console.log('Contrast audit report')
console.log('---------------------')
checks.forEach(c => {
  const fg = parseColor(c.fg, vars)
  const bg = parseColor(c.bg, vars)
  if(!fg || !bg){
    console.log(`- ${c.name}: MISSING color (fg:${c.fg}, bg:${c.bg})`)
    return
  }
  const cr = contrast(fg,bg)
  const passAA = cr >= 4.5
  const passLarge = cr >= 3.0
  console.log(`- ${c.name}: contrast=${cr.toFixed(2)} — ${passAA? 'PASS AA':'FAIL AA'} (large: ${passLarge? 'PASS':'FAIL'})`)
})
// Detailed variable report
console.log('\nVariables found:')
Object.keys(vars).forEach(k=>{
  console.log(`--${k}: ${vars[k]}`)
})

// Suggest fixes for failures
console.log('\nSuggestions:')
checks.forEach(c=>{
  const fg = parseColor(c.fg, vars)
  const bg = parseColor(c.bg, vars)
  if(fg && bg){
    const cr = contrast(fg,bg)
    if(cr < 4.5){
      console.log(`- ${c.name}: consider increasing contrast. Try using darker ${c.fg} or lighter ${c.bg}.`) }
  }
})

process.exit(0)
