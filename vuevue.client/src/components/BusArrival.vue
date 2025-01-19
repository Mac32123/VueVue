<template>
  <div v-if="arrivals.length">
    <h3>Najbliższe przyjazdy dla przystanku {{ stopId }}:</h3>
    <ul>
      <li v-for="arrival in arrivals" :key="arrival.id">
        {{ arrival.estimatedTime }} - {{ arrival.headsign }}
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Brak informacji o przyjazdach dla tego przystanku.</p>
  </div>
</template>

<script>
  import  przystankiService  from '../services/Przystanki.js';

  export default {
    props: ['stopId'],
    data() {
      return {
        arrivals: [],
      };
    },
    watch: {
      stopId: {
        async handler(newStopId) {
          await this.fetchArrivals(newStopId);
        },
        immediate: true, // Jeśli chcesz, żeby fetchArrivals był wywoływany natychmiast, gdy komponent jest tworzony
      },
    },
    methods: {
      async fetchArrivals(stopId) {
        if (stopId) {
          this.arrivals = [];
          this.arrivals = await przystankiService.getEstimatedDepartures(stopId);
        }
      },
    },
  };
</script>

<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    padding: 8px;
    background-color: #f9f9f9;
    margin: 4px 0;
    border-radius: 4px;
  }
</style>
