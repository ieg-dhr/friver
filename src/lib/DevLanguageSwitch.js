import {i18n} from '@wendig/lib'

let instance = null

export default class DevLanguageSwitch {
  static setup(app) {
    instance ||= new DevLanguageSwitch(app)

    return instance
  }

  constructor(app) {
    this.app = app

    const body = document.querySelector('body')
    body.addEventListener('keydown', event => this.handle(event))
  }

  handle(event) {
    if (event.altKey && event.ctrlKey) {
      const other = {'de': 'en', 'en': 'de'}[i18n.locale]
      console.log(other)

      i18n.setLocale(other)
      // console.log(this.app.update())
      this.app.bus.emit('update-all')
    }
  }
}
