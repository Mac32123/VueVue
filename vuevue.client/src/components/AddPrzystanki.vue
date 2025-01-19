<template>
  <div>
    <h3>Wybierz przystanki do śledzenia</h3>

    <!-- Filtrowanie przystanków -->
    <input v-model="searchTerm" placeholder="Wyszukaj przystanek" />

    <ul>
      <li v-for="busStop in filteredBusStops" :key="busStop">
        <label>
          <input type="checkbox" v-model="selectedBusStops" :value="busStop" />
          {{ busStop.name }}, {{ busStop.id}}
        </label>
      </li>
    </ul>

    <button @click="saveSelectedBusStops">Zapisz wybrane przystanki</button>
  </div>
</template>

<script>
  import przystankiService from '../services/Przystanki'; // Twoja metoda do pobierania przystanków

export default {
  data() {
    return {
      allBusStops: [],
      selectedBusStops: [],
      searchTerm: '',
    };
  },
  computed: {
    filteredBusStops() {
      return this.allBusStops.filter(busStop =>
        busStop.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  async created() {
    // Pobieramy listę przystanków z API
    const data = await przystankiService.getPrzystaneki();

    this.allBusStops = data.stops.map(s => ({
      id: s.stopId,
      zone: s.zoneName,
      name: s.stopName,
      desc: s.stopDesc,
      code: s.stopCode
    }));
  },
  methods: {
    async saveSelectedBusStops() {
      if (this.selectedBusStops.length === 0) {
        alert("Proszę wybrać przynajmniej jeden przystanek.");
        return;
      }
      const token = localStorage.getItem("token");
      const busStopIds = this.selectedBusStops.map(stop => stop.id.toString());
      try {
        const buses =  `https://localhost:7286/api/Auth/busstops2`;

        const test = JSON.stringify(busStopIds);
        const response = await fetch(buses, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Zakładając, że masz token w store
          },
          body: JSON.stringify(busStopIds),
        });

        if (response.ok) {
          alert("Przystanki zostały zapisane.");
        } else {
          alert("Wystąpił błąd podczas zapisywania przystanków.");
        }
      } catch (error) {
        console.error(error);
        alert("Wystąpił błąd.");
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

  input[type="checkbox"] {
    margin-right: 10px;
  }
</style>
