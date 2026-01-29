import {default as QteiTeiDoc} from '@ieg/qtei/src/lib/TeiDoc.js'
import entities from '../entities.js'
import {default as config} from '../../.env.js'
import {strftime} from './util'
import * as linkify from 'linkifyjs'
import linkifyHtml from 'linkify-html'

const preprocess = (xml) => {
  let result = xml

  for (const [e, data] of Object.entries(entities)) {
    result = result.replaceAll(new RegExp(/&[a-zA-Z0-9]+;/, 'g'), x => {
      const char = entities[x]

      return char ? char['characters'] : x
    })
  }

  return result
}

const clean = (text) => {
  return text.
    replaceAll(/ +/g, ' ').
    replaceAll(/\n/g, '')
}

export default class TeiDoc extends QteiTeiDoc {
  static parse(xml, meta) {
    xml = preprocess(xml)

    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'application/xml')
    
    return new TeiDoc(doc, meta)
  }

  constructor(doc, meta) {
    super(doc)
    
    this.meta = meta
  }

  id() {
    return this.meta['id']
  }

  collection() {
    return this.meta['collection']
  }

  title() {
    return this.meta['title']
  }

  date() {
    return this.meta['date']
  }

  dateLabel() {
    let date = this.date()
    if (!date) return null

    let parsed = new Date(date)
    parsed = new Date(parsed.toISOString())

    const isFull = !!date.match(/^\d{4}-\d{2}-\d{2}$/)
    if (isFull) return strftime(parsed, '%D')

    const hasMonth = !!date.match(/^\d{4}-\d{2}$/)
    if (hasMonth) return strftime(parsed, '%B %Y')

    const isYear = !!date.match(/^\d{4}$/)
    if (isYear) return strftime(parsed, '%Y')
    
    return null
  }

  hasArchive() {
    return !!this.meta['archive']
  }

  archive(format = 'short') {
    const record = this.meta['archive']
    if (!record) return null

    let result = record[format]
    if (format === 'label') result = linkifyHtml(result)

    return result
  }

  github() {
    return `https://github.com/ieg-dhr/friver-plus/blob/main/Transcriptions/${this.id()}.xml`
  }

  url() {
    return `${config['FV_STATIC_URL']}/data/${this.id()}.xml`
  }

  hasDate() {
    return !!this.date()
  }
}
