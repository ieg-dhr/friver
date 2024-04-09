import Watchlist from './Watchlist'

const watchlist = new Watchlist()

// to empty the watchlist when the data structure has changed, change the
// version, see above
if (window.localStorage.watchlistVersion != Watchlist.VERSION) {
  watchlist.clear()
  window.localStorage.watchlistVersion = Watchlist.VERSION
}

export default watchlist
