import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    //key: 'AIzaSyDQ4_1fpWUu558Qa1_EohhYLihGBEQbhtM',  //API Key Kapo project on Google Maps Platform
    key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
    libraries: 'places, visualization', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

new Vue({
  render: h => h(App),
}).$mount('#app')
