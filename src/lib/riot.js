import * as riot from 'riot'

import {RiotPlugins, BusRiotPlugin, i18n} from '@wendig/lib'

RiotPlugins.setup(riot)
riot.install(RiotPlugins.i18n)
riot.install(RiotPlugins.parent)
riot.install(RiotPlugins.setTitle)
riot.install(BusRiotPlugin)

export {
    riot
}