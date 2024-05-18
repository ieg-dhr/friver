import * as riot from 'riot'
import {default as config} from '../.env.js'

import {RiotPlugins, BusRiotPlugin, Url, i18n} from '@wendig/lib'
import '@wendig/lib/src/enhance/Array'

RiotPlugins.setup(riot)
riot.install(RiotPlugins.i18n)
riot.install(RiotPlugins.parent)
riot.install(RiotPlugins.setTitle)
riot.install(BusRiotPlugin)

import App from './components/App.riot'

Url.setForceFragment(false)
riot.register('app', App)

i18n.fetch(`${config.FV_STATIC_URL}/translations.json`).then(data => {
  i18n.setLocale('de')
  riot.mount('[is]')

  console.log('app mounted')
})
