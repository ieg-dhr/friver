import {Search as WendigSearch} from '@wendig/lib'

import config from '../../.env.js'
import TeiDoc from './TeiDoc'

export default class Search extends WendigSearch {
  constructor() {
    const url = config['FV_STATIC_URL'] + '/database.js'

    super(url)
  }

  contracts(criteria = {}) {
    return this.postMessage({action: 'contracts', criteria}).then(data => {
      data.records = data.records.map(r => new TeiDoc(null, r))
      
      return data
    })
  }

  contract(criteria = {}) {
    return this.postMessage({action: 'contract', criteria}).then(data => {
      return TeiDoc.parse(data.xml, data.meta)
    })
  }
}
