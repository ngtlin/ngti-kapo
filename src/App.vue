<template>
  <div id="app">
    <GmapMap
      :center="center"
      :zoom="zoomLevel"
      map-type-id="terrain"
      :style="mapStyle"
    >
      <!--GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      /-->
      <GmapKlmlayer :url="klmSrcUrl" />
    </GmapMap>
  </div>
</template>

<script>
import GmapKlmlayer from './components/KmlLayer.js'

export default {
  name: 'app',
  components: {
    GmapKlmlayer,
  },
  data() {
    return {
      center: {lng:7.44744, lat:46.94809},
      zoomLevel: 12,
      markers: [
        {
          position: {lng:7.44744, lat:46.94809}
        }
      ],
      klmSrcUrl: "https://res.cloudinary.com/ngti/raw/upload/v1543844660/klmdata/placemark.kml"
    }
  },
  computed: {
    mapStyle() {
      return {
        width: '600px',
        height: '450px'
      }
    }
  }
}
</script>

<style>

</style>
