<template>
  <div>
    <h2>Wybierz przystanek:</h2>
    <ul>
      <li v-for="stop in busStops" :key="stop.stopId" @click="selectBusStop(stop.stopId)">
        {{ stop.stopName }} {{ stop.stopId }}
        <button @click.stop="removeBusStop(stop.stopId)" class="remove-btn">🗑️</button>
      </li>
    </ul>
    <bus-arrival v-if="selectedStopId" :stopId="selectedStopId" />
  </div>
</template>

<script>
  import userService from '../services/User.js';
  import BusArrival from './BusArrival.vue';

  export default {
    components: {
      BusArrival,
    },
    data() {
      return {
        busStops: [],
        selectedStopId: null,
      };
    },
    async created() {
      // Pobieranie przystanków (np. z bazy danych dla danego użytkownika)
      this.busStops = await userService.getBusStops();
    },
    methods: {
      selectBusStop(stopId) {
        this.selectedStopId = stopId;
      },
      removeBusStop(stopId) {
        // Usuwanie przystanku z listy
        userService.deleteBusStop(stopId);
        this.busStops = this.busStops.filter(stop => stop.stopId !== stopId);
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
    cursor: pointer;
    padding: 8px;
    background-color: #f0f0f0;
    margin: 4px 0;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

    li:hover {
      background-color: #e0e0e0;
    }

  .remove-btn {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
  }
</style>
