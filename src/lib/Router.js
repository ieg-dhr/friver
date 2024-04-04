import * as riot from 'riot'
import {Url, bus} from '@wendig/lib'

import {toAbsoluteUrl} from '../lib/util'

export default class Router {
  constructor(opts = {}) {
    this.opts = {
      target: null,
      origin: Url.current().origin(),
      404: null,
      routes: []
    }

    this.configure(opts)

    window.addEventListener('popstate', event => this.route())
    bus.on('url-changed', event => router.route())
  }

  configure(opts = {}) {
    Object.assign(this.opts, opts)

    if (opts['root']) {
      this.opts['root'].addEventListener('click', event => this.onLinkClicked(event))
    }
  }

  route() {
    this.unmount()

    const url = Url.current()

    for (const route of this.opts.routes) {
      const m = url.resource().match(route['pattern'])

      if (m) {
        const props = Object.assign({}, m.groups, url.params())

        this.mount(route['component'], props)
        return
      }
    }

    if (this.opts[404]) {
      this.mount(this.opts[404])
    }
  }

  canRoute(url) {
    const abs = toAbsoluteUrl(url)
    const parsed = Url.parse(abs)
    if (parsed.origin() !== this.opts.origin) return false

    for (const route of this.opts.routes) {
      const m = url.match(route['pattern'])
      if (m) return true
    }

    return false
  }

  onLinkClicked(event) {
    let link = event.target
    while (link) {
      const href = link.getAttribute('href')

      if (href) {
        if (this.canRoute(href)) {
          console.log(href)
          event.preventDefault()

          this.navigateTo(href)
        }
      }

      link = link.parentElement
    }
  }

  navigateTo(pathOrUrl, params = {}) {
    const abs = toAbsoluteUrl(pathOrUrl)
    let parsed = Url.parse(abs)
    parsed.updateParams(params)

    // ensure the same history isn't pushed more than once
    const current = Url.current()
    if (parsed.url() !== current.url()) {
      window.history.pushState(null, null, parsed.resource())
      bus.emit('url-changed')
    }
  }

  unmount() {
    if (this.component) {
      this.component.unmount()
      this.component = null
    }
  }

  mount(component, props = {}) {
    const element = this.opts.target
    const mounter = riot.component(component)
    this.component = mounter(element, props)
  }
}