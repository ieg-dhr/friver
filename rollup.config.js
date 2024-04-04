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

const tpl = fs.readFileSync('./src/index.ejs', {encoding: 'utf8'})
const html = ejs.render(tpl, process.env)
fs.writeFileSync('./public/index.html', html)

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
