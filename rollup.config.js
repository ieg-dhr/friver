import fs from 'fs'
import 'dotenv/config'
import ejs from 'ejs'

import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import riot from 'rollup-plugin-riot'
import terser from '@rollup/plugin-terser'

const NODE_ENV = process.env['NODE_ENV'] || 'development'
const optimize = (NODE_ENV == 'production')

fs.writeFileSync('./.env.js', 'export default ' + JSON.stringify(process.env))

const tpl1 = fs.readFileSync('./src/index.ejs', {encoding: 'utf8'})
const fontBase = `${process.env['FV_STATIC_URL']}`
const scope = Object.assign({}, {fonts: [
  `${fontBase}/assets/fonts/Barlow/Barlow-Thin.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-ExtraLightItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-ExtraLight.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-MediumItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-Black.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-Medium.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-ThinItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-LightItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-ExtraBoldItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-Light.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-BoldItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-SemiBold.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-Regular.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-Bold.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-BlackItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-ExtraBold.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-SemiBoldItalic.ttf`,
  `${fontBase}/assets/fonts/Barlow/Barlow-RegularItalic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-Light.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-Medium.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-SemiBold.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-Bold.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-LightItalic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-Regular.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-Italic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-MediumItalic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-SemiBoldItalic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/static/Cormorant-BoldItalic.ttf`,
  `${fontBase}/assets/fonts/Cormorant/Cormorant-VariableFont_wght.ttf`,
  `${fontBase}/assets/fonts/Cormorant/Cormorant-Italic-VariableFont_wght.ttf`
]})
const html1 = ejs.render(tpl1, scope)
fs.writeFileSync('./public/index.html', html1)

if (NODE_ENV == 'production') {
  const tpl2 = fs.readFileSync('./src/htaccess.ejs', {encoding: 'utf8'})
  const html2 = ejs.render(tpl2, process.env)
  fs.writeFileSync('./public/.htaccess', html2)
}

const app = {
  input: 'src/app.js',
  output: {
    file: 'public/app.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: !optimize
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    riot(),
    ...(optimize ? [terser()] : [])
  ]
}

const database = {
  input: 'src/database.js',
  output: {
    file: 'public/database.js',
    format: optimize ? 'iife' : 'esm',
    sourcemap: !optimize
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    ...(optimize ? [terser()] : [])
  ]
}

export default [app, database]
