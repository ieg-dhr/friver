import {i18n} from '@wendig/lib'
import {default as QteiTeiDoc} from '@ieg/qtei/src/lib/TeiDoc.js'
import entities from '../entities.js'
import {default as config} from '../../.env.js'
import {strftime} from './util'

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

  hasDate() {
    return !!this.date()
  }

  date() {
    return this.meta['date']
  }

  languageList() {
    return this.meta['languages'].join(', ')
  }

  dateLabel() {
    let date = this.date()
    if (!date) return null

    let parsed = new Date(date)
    parsed = new Date(parsed.toISOString())

    const isFull = !!date.match(/^\d{4}-\d{2}-\d{2}$/)
    if (isFull) {
      const format = (
        i18n.locale === 'de' ?
        '%-d.%-m.%Y' :
        '%-m/%-d/%Y'
      )

      return strftime(parsed, format)
    }

    const hasMonth = !!date.match(/^\d{4}-\d{2}$/)
    if (hasMonth) return strftime(parsed, '%B %Y')

    const isYear = !!date.match(/^\d{4}$/)
    if (isYear) return strftime(parsed, '%Y')
    
    return null
  }

  github() {
    return `https://github.com/ieg-dhr/friver-plus/blob/main/Transcriptions/${this.id()}.xml`
  }

  url() {
    return `${config['FV_STATIC_URL']}/data/${this.id()}.xml`
  }
}
