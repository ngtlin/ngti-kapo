import { MapElementFactory } from 'vue2-google-maps'

const props = {
  url: {
    type: String,
    required: true,
    twoWay: true,
  },
  screenOverlays: {
    type: Boolean,
    default: true,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
  options: {
    type: Object
  }
}

const events = [
  'click'
]

export default MapElementFactory({
  name: 'kmlLayer',
  ctr: () => window.google.maps.KmlLayer,
  ctrArgs: (options) => [options],
  events,
  mappedProps: props,
  // beforeCreate (options) {
  //   console.log('-XXX->kmlLayer::beforeCreate, opts=', options)
  // },
  // // Actions to perform after creating the object instance.
  // afterCreate (directionsRendererInstance) {
  //   console.log('-XXX->kmlLayer::afterCreate, directionsRendererInstance=', directionsRendererInstance)
  // },
})