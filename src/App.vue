<template>
  <div id="app">
    <GmapMap
      :center="center"
      :zoom="zoomLevel"
      map-type-id="terrain"
      :style="mapStyle"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
    </GmapMap>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      center: {lat:46.94809, lng:7.44744},
      zoomLevel: 14,
      markers: [
        {
          position: {lat:46.94809, lng:7.44744}
        }
      ],
      
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
