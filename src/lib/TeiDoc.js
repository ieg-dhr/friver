import {default as QteiTeiDoc} from '@ieg/qtei/src/lib/TeiDoc.js'
import entities from '../entities.js'
import {default as config} from '../../.env.js'

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

  github() {
    return `https://github.com/ieg-dhr/friver-plus/blob/main/Transcriptions/${this.id()}.xml`
  }

  url() {
    return `${config['FV_STATIC_URL']}/data/${this.id()}.xml`
  }
}