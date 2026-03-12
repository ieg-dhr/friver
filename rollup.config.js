import fs from 'fs'
import 'dotenv/config'
import ejs from 'ejs'

import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import riot from 'rollup-plugin-riot'
import terser from '@rollup/plugin-terser'

import fonts from './src/fonts.js'
// import {pick} from './src/lib/util.js'

const pick = (obj, keys) => {
  const a = keys.
    filter(key => key in obj).
    map(key => [key, obj[key]])
  
  return Object.fromEntries(a)
}

const NODE_ENV = process.env['NODE_ENV'] || 'development'
const env = Object.assign({NODE_ENV}, process.env)
const senv = pick(env, [
  'NODE_ENV',
  'FV_STATIC_URL',
  'FV_STATIC_PREFIX',
  'FV_STATIC_ROOT',
  'FV_LEGACY_URL',
  'FV_USE_LOCAL_IMAGES'
])

fs.writeFileSync('./.env.js', 'export default ' + JSON.stringify(senv))

const optimize = (NODE_ENV == 'production')
const tpl1 = fs.readFileSync('./src/index.ejs', {encoding: 'utf8'})
const html1 = ejs.render(tpl1, {fonts})
fs.writeFileSync('./public/index.html', html1)

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
