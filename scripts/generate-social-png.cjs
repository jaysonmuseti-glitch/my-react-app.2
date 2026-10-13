const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const svgPath = path.resolve(__dirname, '..', 'public', 'social-preview.svg')
const outPath = path.resolve(__dirname, '..', 'public', 'social-preview.png')

if(!fs.existsSync(svgPath)){
  console.error('SVG source not found:', svgPath)
  process.exit(1)
}

(async ()=>{
  try{
    const svg = fs.readFileSync(svgPath)
    await sharp(svg).resize(768,400).png().toFile(outPath)
    console.log('Wrote PNG to', outPath)
  }catch(err){
    console.error('Failed to generate PNG:', err)
    process.exit(2)
  }
})()
