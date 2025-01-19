<template>
  <p>Przystanki</p>
  <div>
    <div v-for="stop in stops">
      {{stop.name}}
      {{stop.id}}
    </div>
  </div>
</template>

<script>
  import przystankiService from '@/services/Przystanki.js'

  export default
  {
    name: "PrzystankiPrzystanki",
    data()
    {
      return {
        isLoading: true,
        stops: [],
      }
    },
    async mounted() {

      await this.fetchBusStop();
    },
    methods: {
      async fetchBusStop(){
        const data = await przystankiService.getPrzystaneki();

        this.stops = data.stops.map(s => ({
          id: s.stopId,
          zone: s.zoneName,
          name: s.stopName,
          desc: s.stopDesc,
          code: s.stopCode
        }));
      },

    }

  }
</script>
