import * as riot from 'riot'
import {Url, bus} from '@wendig/lib'

import {toAbsoluteUrl, navigateTo} from '../lib/util'

export default class Router {
  constructor(opts = {}) {
    this.opts = {
      prefix: '',
      target: null,
      origin: Url.current().origin(),
      404: null,
      routes: []
    }

    this.params = {}

    this.configure(opts)

    // this.onLinkClicked = this.onLinkClicked.bind(this)

    window.addEventListener('popstate', event => this.route())
    bus.on('url-changed', event => this.route())
  }

  configure(opts = {}) {
    Object.assign(this.opts, opts)

    // if (opts['root']) {
    //   this.opts['root'].addEventListener('click', this.onLinkClicked)
    // }
  }

  route() {
    const url = Url.current()
    const path = url.path().
      replace(new RegExp(`^${this.opts.prefix}`), '').
      replace(/\/$/, '')

    for (const route of this.opts.routes) {
      const m = path.match(route['pattern'])
      // console.log(path, route['pattern'], m)

      if (m) {
        const props = Object.assign(
          {},
          m.groups,
          url.params(),
          {component: route['component']}
        )

        this.params = props
        this.mount(route['component'], props)
        return
      }
    }

    if (this.opts[404]) {
      this.params['component'] = this.opts[404]
      this.mount(this.opts[404])
    }
  }

  canRoute(url) {
    const abs = toAbsoluteUrl(url)
    const parsed = Url.parse(abs)
    if (parsed.origin() !== this.opts.origin) return false

    const path = this.pathFor(parsed)
    for (const route of this.opts.routes) {
      const m = path.match(route['pattern'])
      // console.log(path, route['pattern'], m)

      if (m) return true
    }

    return false
  }

  // onLinkClicked(event) {
  //   // event.preventDefault()

  //   let link = event.target
  //   while (link) {
  //     const href = link.getAttribute('href')

  //     if (href) {
  //       if (this.canRoute(href)) {
  //         event.preventDefault()

  //         this.navigateTo(href)
  //       }
  //     }

  //     link = link.parentElement
  //   }
  // }

  pathFor(url) {
    return url.path().
      replace(new RegExp(`^${this.opts.prefix}`), '').
      replace(/\/$/, '')
  }

  // navigateTo(pathOrUrl, params = {}) {
  //   const abs = toAbsoluteUrl(pathOrUrl)
  //   let parsed = Url.parse(abs)
  //   parsed.updateParams(params)

  //   // ensure the same history isn't pushed more than once
  //   const current = Url.current()
  //   if (parsed.path() !== current.path()) {
  //     navigateTo(parsed.path())
  //   }
  // }

  unmount() {
    if (this.component) {
      this.component.unmount(true)
      this.component = null
    }
  }

  mount(component, props = {}) {
    if (this.component && this.component.name === component.name) {
      if (this.component.reload) {
        this.component.reload(props)
      } else {
        this.component.update(props)
      }
    } else {
      this.unmount()

      const element = this.opts.target
      element.removeAttribute('class')
      const mounter = riot.component(component)
      this.component = mounter(element, props)
      
      bus.emit('route:mounted')
    }
  }
}