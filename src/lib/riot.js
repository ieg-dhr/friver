import * as riot from 'riot'

import {RiotPlugins, BusRiotPlugin, i18n} from '@wendig/lib'

RiotPlugins.setup(riot)
riot.install(RiotPlugins.i18n)
riot.install(RiotPlugins.parent)
riot.install(RiotPlugins.setTitle)
riot.install(BusRiotPlugin)

riot.install(cmp => {
  const {onBeforeMount, onBeforeUnmount} = cmp

  cmp.onBeforeMount = (props, state) => {
    onBeforeMount.apply(cmp, [props, state])

    cmp.bus.on('update-all', event => cmp.update())
  }
})


export {
    riot
}