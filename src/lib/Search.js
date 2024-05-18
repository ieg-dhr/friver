import {Search as WendigSearch} from '@wendig/lib'

import config from '../../.env.js'
import TeiDoc from './TeiDoc'

export default class Search extends WendigSearch {
  constructor() {
    const url = config['FV_STATIC_URL'] + '/database.js'

    super(url)
  }

  treaties(criteria = {}) {
    return this.postMessage({action: 'treaties', criteria}).then(data => {
      data.records = data.records.map(r => new TeiDoc(null, r))
      
      return data
    })
  }

  treaty(criteria = {}) {
    return this.postMessage({action: 'treaty', criteria}).then(data => {
      return TeiDoc.parse(data.xml, data.meta)
    })
  }
}
