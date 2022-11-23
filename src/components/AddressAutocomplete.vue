<template>
  <input type="text" placeholder="Origin" ref="origin" />
  <GMapAutocomplete
       placeholder="This is a placeholder"
       @place_changed="setPlace"
    >
  </GMapAutocomplete>
</template>

<script>
export default {
  mounted () {
    // const autocomplete = new google.maps.places.Autocomplete(
    //   this.$refs.origin,
    //   {types: ['geocode']},
    //   {
    //     bounds: new google.maps.LatLngBounds(
    //       new google.maps.LatLng(45.4215296, -75.6971931)
    //     )
    //   }
    // );
    // autocomplete.addListener('place_changed', () => {
    //   console.log(autocomplete.getPlace());
    // });
  },
  methods: {
    setPlace(place) {
      console.log(place);
    },
  }
};
</script>
