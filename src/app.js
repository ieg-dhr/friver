import {riot} from './lib/riot'
import {default as config} from '../.env.js'

import {Url, i18n} from '@wendig/lib'
import '@wendig/lib/src/enhance/Array'

import App from './components/App.riot'
import Icon from './components/Icon.riot'
import Offcanvas from './components/Offcanvas.riot'
import Raw from './components/Raw.riot'

riot.register('app', App)
riot.register('icon', Icon)
riot.register('offcanvas', Offcanvas)
riot.register('raw', Raw)


Url.setForceFragment(false)

i18n.fetch(`${config.FV_STATIC_URL}/translations.json`).then(data => {
  i18n.setLocale('de')
  riot.mount('[is]')

  console.log('app mounted')
})
