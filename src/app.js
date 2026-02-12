import {riot} from './lib/riot'
import {default as config} from '../.env.js'

import {Url, i18n} from '@wendig/lib'
import '@wendig/lib/src/enhance/Array'

import ActiveFacets from './components/ActiveFacets.riot'
import App from './components/App.riot'
import ContentLoader from './components/ContentLoader.riot'
import Facet from './components/Facet.riot'
import FacetFilter from './components/FacetFilter.riot'
import Favorites from './components/Favorites.riot'
import FilterList from './components/FilterList.riot'
import Footer from './components/Footer.riot'
import FullscreenImages from './components/FullscreenImages.riot'
import Header from './components/Header.riot'
import Icon from './components/Icon.riot'
import ImageCarousel from './components/ImageCarousel.riot'
import Navigation from './components/Navigation.riot'
import Offcanvas from './components/Offcanvas.riot'
import Pagination from './components/Pagination.riot'
import RangeControl from './components/RangeControl.riot'
import Raw from './components/Raw.riot'
import SecondaryContent from './components/SecondaryContent.riot'
import StyleIcons from './components/StyleIcons.riot'
import WatchlistToggle from './components/WatchlistToggle.riot'
import ZoomableImage from './components/ZoomableImage.riot'

riot.register('active-facets', ActiveFacets)
riot.register('app', App)
riot.register('content-loader', ContentLoader)
riot.register('facet', Facet)
riot.register('facet-filter', FacetFilter)
riot.register('favorites', Favorites)
riot.register('filter-list', FilterList)
riot.register('footer', Footer)
riot.register('fullscreen-images', FullscreenImages)
riot.register('header', Header)
riot.register('icon', Icon)
riot.register('image-carousel', ImageCarousel)
riot.register('navigation', Navigation)
riot.register('offcanvas', Offcanvas)
riot.register('pagination', Pagination)
riot.register('range-control', RangeControl)
riot.register('raw', Raw)
riot.register('secondary-content', SecondaryContent)
riot.register('style-icons', StyleIcons)
riot.register('watchlist-toggle', WatchlistToggle)
riot.register('zoomable-image', ZoomableImage)


Url.setForceFragment(false)

i18n.fetch(`${config.FV_STATIC_URL}/translations.json`).then(data => {
  i18n.setLocale(navigator.language.split('-')[0])
  riot.mount('[is]')

  console.log('app mounted')
})
