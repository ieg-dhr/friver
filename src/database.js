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
  const sort = criteria['sort'] || 'id'

  let buckets = {}

  let records = Object.values(storage).filter(record => {
    if (!matchesTerms(record, criteria['terms'])) return false
    if (!matchesIds(record, criteria['ids'])) return false

    aggregate(buckets, 'collection', record['collection'])

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
    buckets[k] = util.sortBy(docs, d => d.count).reverse()
  }

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

// const matches = (record, criteria, key) => {
//   if (!criteria) return true
//   if (!criteria[key]) return true

//   return record[key] == criteria[key]
// }

// const matchesTerms = (record, criteria, highlight) => {
//   const terms = criteria['terms']
//   if (!terms) return true

//   for (const t of terms.split(/\s+/)) {
//     if (t.match(/^\s*$/)) continue
//     if (t.length < 3) continue

//     const regex = new RegExp(t, 'ig')
//     const matches = [...record['article'].matchAll(regex)]

//     for (const m of matches.slice(0, 2)) {
//       const from = Math.max(0, m.index - 60)
//       const to = Math.min(record['article'].length, m.index + t.length + 60)
//       const id = record['article_id']
//       highlight[id] = highlight[id] || []
//       highlight[id].push({
//         before: record['article'].slice(from, m.index),
//         term: t,
//         after: record['article'].slice(m.index + t.length, to)
//       })
//     }

//     if (matches.length == 0) return false
//   }

//   return true
// }

// const matchesRange = (record, criteria) => {
//   let range = criteria['range']
//   if (!range) return true
//   range = range.split('-').map(e => parseInt(e))

//   for (const years of record['years']) {
//     if (range[1] >= years[0] && range[0] <= years[1]) {
//       return true
//     }
//   }

//   return false
// }

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
