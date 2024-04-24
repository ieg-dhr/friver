import {util} from '@wendig/lib'
import {Database} from '@wendig/lib'
import config from '../.env.js'
import TeiDoc from './lib/TeiDoc'


// init

let storage = {}
let database = new Database()
onmessage = database.handler

fetch(config['FV_STATIC_URL'] + '/data.json').then(r => r.json()).then(data => {
  storage = data

  database.loaded()
})

// actions

database.action('treaties', data => {
  const criteria = sanitizeCriteria(data.criteria)
  const sort = criteria['sort'] || 'date'

  let buckets = {
    location: [],
    signatory: [],
    language: [],
    year: []
  }

  let records = Object.values(storage).filter(record => {
    const year = parseInt(record['date'].split('-')[0])

    if (!matchesTerms(record, criteria['terms'])) return false
    if (!matchesIds(record, criteria['ids'])) return false
    if (!matchesLanguage(record, criteria['language'])) return false
    if (!matchesSignatory(record, criteria['signatory'])) return false
    if (!matchesLocation(record, criteria['location'])) return false

    aggregate(buckets, 'year', year)

    if (!matchesDateRange(record, criteria['from'], criteria['to'])) return false

    aggregate(buckets, 'language', record['language'])
    aggregate(buckets, 'signatory', record['signatories'].map(e => e['name']))
    aggregate(buckets, 'location', record['places'].map(e => e['name']))

    return true
  })

  // sort results

  records = records.sort((a, b) => {
    if (a[sort] < b[sort]) return -1
    if (a[sort] > b[sort]) return 1

    return 0
  })

  // sort buckets
  for (const k of Object.keys(buckets)) {
    const docs = Object.entries(buckets[k]).map(e => {
      return {
        value: e[0] == 'null' ? null : e[0],
        count: e[1]
      }
    })

    buckets[k] = docs
  }

  buckets['language'] = util.sortBy(buckets['language'], d => d.count).reverse()
  buckets['signatory'] = util.sortBy(buckets['signatory'], d => d.count).reverse()
  buckets['location'] = util.sortBy(buckets['location'], d => d.count).reverse()
  buckets['year'] = util.sortBy(buckets['year'], d => d.value)

  // re-bin years
  let tmp = []
  const binSize = 3
  for (let i = 0; i < buckets['year'].length; i += binSize) {
    const b = buckets['year'][i]

    for (let j = 0; j < binSize; j += 1) {
      const other = buckets['year'][i + j]
      if (!other) continue
      
      b['count'] += other['count']
    }

    tmp.push(b)
  }
  buckets['year'] = tmp

  const response = paginate(records, criteria, {buckets})

  return response
})

database.action('treaty', data => {
  const criteria = sanitizeCriteria(data.criteria)
  const id = criteria['id']

  const url = `${config['FV_STATIC_URL']}/data/${id}.xml`
  const promise = new Promise((resolve, reject) => {
    fetch(url).then(r => r.text()).then(xml => {
      resolve({meta: storage[id], xml})
    })
  })

  return promise
})

// helpers

const aggregate = (buckets, name, value) => {
  let values = value || 'null'
  values = (Array.isArray(values) ? values : [values])
  values = (values.length == 0 ? ['null'] : values)

  values = values.filter(e => e != null && e != 'null')

  for (const value of values) {
    buckets[name] = buckets[name] || {}
    buckets[name][value] = buckets[name][value] || 0
    buckets[name][value] += 1
  }
}

const matchesTerms = (record, terms) => {
  if (!terms) return true
  if (!record['title']) return false

  const regex = new RegExp(terms, 'i')

  return !!record['title'].match(regex)
}

const matchesIds = (record, ids) => {
  if (!ids) return true

  return ids.includes(record['id'])
}

const matchesDateRange = (record, from, to) => {
  const year = parseInt(record['date'].split('-')[0])

  if (from && year < from) return false
  if (to && year > to) return false

  return true
}

const matchesLanguage = (record, language) => {
  if (!language) return true

  return record['language'] === language
}

const matchesSignatory = (record, signatory) => {
  if (!signatory) return true

  const signatories = record['signatories'].map(e => e['name'])

  const values = signatory.split('|')
  for (const v of values) {
    if (signatories.indexOf(v) != -1) return true
  }

  return false
}

const matchesLocation = (record, location) => {
  if (!location) return true

  const locations = record['places'].map(e => e['name'])

  const values = location.split('|')
  for (const v of values) {
    if (locations.indexOf(v) != -1) return true
  }

  return false
}

const paginate = (records, criteria, other = {}) => {
  let {page, perPage} = criteria
  const total = records.length
  if (perPage === 'max') {
    page = 1
    perPage = total
  }
  const start = (page - 1) * perPage
  const sliced = records.slice(start, start + perPage)

  return {
    page,
    perPage,
    total,
    records: sliced,
    ...other
  }
}

const sanitizeCriteria = (input) => {
  let criteria = input || {}
  criteria['page'] = criteria['page'] || 1
  criteria['perPage'] = criteria['perPage'] || 24
  criteria['locale'] = criteria['locale'] || 'en'

  return criteria
}
