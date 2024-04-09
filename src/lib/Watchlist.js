import {bus} from '@wendig/lib'

class Watchlist {
  static VERSION = 1

  count() {
    return this.unpack().length
  }

  clear() {
    this.pack([])
    bus.emit('watchlist-changed')
  }

  has(id) {
    const tmp = this.unpack()
    const index = tmp.indexOf(id)

    return index != -1
  }

  toggle(id) {
    const tmp = this.unpack()
    const index = tmp.indexOf(id)

    if (index == -1) {
      tmp.push(id)
    } else {
      tmp.splice(index, 1)
    }

    this.pack(tmp)

    bus.emit('watchlist-changed')
  }

  unpack() {
    return JSON.parse(window.localStorage.watchlist || '[]')
  }

  pack(data) {
    window.localStorage.watchlist = JSON.stringify(data)
  }
}

export default Watchlist
