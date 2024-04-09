import {default as config} from '../../.env.js'
import {bus, Url} from '@wendig/lib'

const navigateTo = (url) => {
  window.history.pushState(null, '', url)
  bus.emit('url-changed')
}

const toAbsoluteUrl = (pathOrUrl) => {
  return (new URL(pathOrUrl, document.location)).href
}

export {
  navigateTo,
  toAbsoluteUrl
}