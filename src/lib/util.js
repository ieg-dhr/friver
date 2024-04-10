import {default as config} from '../../.env.js'
import {bus, Url} from '@wendig/lib'

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

export {
  navigateTo,
  toAbsoluteUrl,
  toTreaty
}