<template>
  <input type="text" placeholder="Origin" ref="origin" />
</template>

<script>
import google from 'googleapis';
export default {
  mounted () {
    console.log(google.getSupportedAPIs());
    // const autocomplete = new google.maps.places.Autocomplete(
    //   this.$refs.origin,
    //   {
    //     bounds: new google.maps.LatLngBounds(
    //       new google.maps.LatLng(45.4215296, -75.6971931)
    //     )
    //   }
    // );
    // autocomplete.addListener('place_changed', () => {
    //   console.log(autocomplete.getPlace());
    // });
  }
};
</script>
