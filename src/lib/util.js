import {default as st} from 'strftime'
import {default as config} from '../../.env.js'
import {bus, Url, i18n} from '@wendig/lib'

const navigateTo = (url) => {
  window.history.pushState(null, '', url)
  bus.emit('url-changed')

  window.setTimeout(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, 200)
}

const toAbsoluteUrl = (pathOrUrl) => {
  return (new URL(pathOrUrl, document.location)).href
}

const toTreaty = (treaty) => {
  let url = Url.current()
  url.setPath(`${config['FV_STATIC_ROOT']}/treaties/${treaty.meta['id']}`)

  navigateTo(url.resource())
}

const addMultiParam = (param, value) => {
  let url = Url.current()
  let existing = url.params()[param]

  if (value === null) return

  if (existing) {
    existing = decodeURIComponent(existing)
    const values = existing.split('|')
    if (values.indexOf(value) !== -1) return

    url.updateParams({[param]: [...values, value].join('|')})
  } else {
    url.updateParams({[param]: value})
  }

  navigateTo(url.resource())
}

const removeMultiParam = (param, value) => {
  let url = Url.current()
  const existing = decodeURIComponent(url.params()[param])

  if (!existing) return

  let values = existing.split('|')
  const index = values.indexOf(value)
  if (index === -1) return

  values.splice(index, 1)
  url.updateParams({
    [param]: values.length > 0 ? encodeURIComponent(values.join('|')) : null
  })
  navigateTo(url.resource())
}

const strftime = (datetime, format = '%Y-%m-%d %H:%M:%S') => {
  if (!datetime || !format) return null
  
  let value = datetime
  if (!(value instanceof Date)) value = new Date(value)

  const id = {en: 'en_US', de: 'de_DE', fr: 'fr_FR', it: 'it_IT'}[i18n.locale]
  const localizer = st.localizeByIdentifier(id)

  return localizer(format, value)
}

const imageUrlToRelative = (url) => {
  if (config['FV_USE_LOCAL_IMAGES'] !== 'true') return url

  if (Array.isArray(url)) return url.map(u => imageUrlToRelative(u))

  const rel = url.replace(/^https:\/\/www\.ieg-friedensvertraege\.de/, '')
  return rel + '.jpg'
}

export {
  imageUrlToRelative,
  navigateTo,
  toAbsoluteUrl,
  toTreaty,
  addMultiParam,
  removeMultiParam,
  strftime
}