<template>
  <GoogleMap
    ref="google"
    :center="center"
    :zoom="15"
    @tilesloaded="initMarkers"
    @dragend="onBoundingBoxChanged"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { GoogleMap } from 'vue3-google-map';
import { Chance } from 'chance';
import MarkerClusterer from '@googlemaps/markerclustererplus';

const chance = new Chance();

export default defineComponent({
  components: { GoogleMap },
  setup() {
    const center = { lat: 40.689247, lng: -74.044502 };
    const google = ref(null);
    const markers = ref([]);
    const markerClusterer = ref(null);
    return { center, google, markers, markerClusterer };
  },
  methods: {
    initMarkers() {
      if (this.markerClusterer === null) {
        this.markerClusterer = new MarkerClusterer(this.google.map, [], {
          gridSize: 30,
          zIndex: 10,
          zoomOnClick: false,
          styles: [
            {
              url: 'https://i.imgur.com/tq2SBRI.png',
              height: 25,
              width: 25
            }
          ]
        });
      }
    },
    clearMarkers() {
      this.markerClusterer.clearMarkers();
      console.log(`Clearing ${this.markers.length} markers`);
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
        this.markers[i].visible = false;
      }
      this.markers = [];
    },
    getMarker(title, pos) {
      return new this.google.api.Marker({
        position: pos,
        title: title,
        map: this.google.map
      });
    },
    generateRandomMarkers() {
      const newMarkers = [];
      const count = chance.integer({ min: 50, max: 150 });
      const [sw, ne] = this.getBoundingBox();
      let nlat, nlng;
      for (var i = 0; i <= count; i++) {
        nlat = chance.floating({ min: sw.lat, max: ne.lat, fixed: 7 });
        nlng = chance.floating({ min: sw.lng, max: ne.lng, fixed: 7 });
        newMarkers.push(
          this.getMarker(`Marker #${i}`, { lat: nlat, lng: nlng })
        );
      }
      this.markers = newMarkers;
      this.markerClusterer.addMarkers(newMarkers);
    },
    getBoundingBox() {
      const bounds = this.google.map.getBounds();
      const swb = bounds.getSouthWest();
      const neb = bounds.getNorthEast();
      const sw = { lat: swb.lat(), lng: swb.lng() };
      const ne = { lat: neb.lat(), lng: neb.lng() };
      return [sw, ne];
    },
    onBoundingBoxChanged() {
      this.clearMarkers();
      this.generateRandomMarkers();
    }
  },
});
</script>
