import {default as config} from '../../.env.js'
import {bus, Url} from '@wendig/lib'

// const isFriverPlus = (url) => {
//   const abs = toAbsoluteUrl(url)
//   if (abs === config['FV_STATIC_URL']) return true

//   const staticUrl = config['FV_STATIC_URL'] + '/friverplus'
//   return staticUrl === abs.substring(0, staticUrl.length)
// }

const toAbsoluteUrl = (pathOrUrl) => {
  return (new URL(pathOrUrl, document.location)).href
}

// const navigateTo = (pathOrUrl, params = {}) => {
//   const abs = toAbsoluteUrl(pathOrUrl)
//   let url = Url.parse(abs)
//   url.updateParams(params)

//   // ensure the same history isn't pushed more than once
//   const current = Url.current()
//   if (url.url() !== current.url()) {
//     window.history.pushState(null, null, url.resource())
//     bus.emit('url-changed')
//   }
// }

export {
  // isFriverPlus,
  // navigateTo,
  toAbsoluteUrl
}