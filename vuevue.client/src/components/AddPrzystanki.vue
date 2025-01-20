<template>
  <div>
    <h3>Wybierz przystanki do śledzenia</h3>

    <!-- Filtrowanie przystanków -->
    <input v-model="searchTerm" placeholder="Wyszukaj przystanek" class="mb-4 p-2 border rounded" />

    <!-- Tabela z przystankami -->
    <v-data-table :headers="columns"
                  :items="filteredBusStops"
                  item-key="id"
                  :search="searchTerm"
                  :items-per-page="5">
      <template v-slot:[`item.isSelected`]="{ item }">
        <!-- Używamy v-model do przypisania stanu do checkboxa -->
        <v-checkbox v-model="item.isSelected" />
      </template>
    </v-data-table>

    <button @click="saveSelectedBusStops" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Zapisz wybrane przystanki
    </button>
    <button @click="showToast">Pokaż Toast</button>
  </div>
</template>

<script>
  import { useAuthStore } from '@/stores/Auth.js';
  import przystankiService from '../services/Przystanki'; // Twoja metoda do pobierania przystanków
  import { useToast } from "vue-toastification";
  import 'vue-toastification/dist/index.css'; // Importowanie stylów
  import { VDataTable, VCheckbox } from 'vuetify/components';
  import { reactive } from 'vue';
  //import Vue from "vue";

  export default {
    components: {
      VDataTable, // Wykorzystanie VDataTable
      VCheckbox,  // Wykorzystanie VCheckbox
    },
    data() {
      return {
        searchTerm: '',
        columns: [
          {
            text: 'Wybierz',
            align: 'start',
            key: 'isSelected',
            sortable: false,
          },
          {
            text: 'Nazwa przystanku',
            align: 'start',
            key: 'name',
            sortable: true,
          },
          {
            text: 'Id',
            align: 'start',
            key: 'id',
            sortable: true,
          },
          {
            text: 'Strefa',
            align: 'start',
            key: 'zone',
            sortable: true,
          },
        ],
        store: useAuthStore(),
        toast: useToast(), // Inicjalizacja toasta
        allBusStops: reactive([]), // Używamy reactive, aby Vue śledziło zmiany w tabeli
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

      // Konwertujemy dane na reaktywne
      this.allBusStops = data.stops.map(s => ({
        id: s.stopId,
        zone: s.zoneName,
        name: s.stopName,
        code: s.stopCode,
        isSelected: false, // Dodajemy isSelected jako false domyślnie
      }));
    },
    methods: {
      async saveSelectedBusStops() {
        // Filtrujemy przystanki, które zostały zaznaczone
        const selected = this.filteredBusStops.filter(busStop => busStop.isSelected);

        if (selected.length === 0) {
          this.toast.error("Proszę wybrać przynajmniej jeden przystanek.");
          return;
        }

        const token = this.store.getToken;
        const busStopIds = selected.map(stop => stop.id.toString());

        try {
          const buses = 'https://localhost:7286/api/Auth/busstops2';
          const response = await fetch(buses, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(busStopIds),
          });

          if (response.ok) {
            this.toast.success("Przystanki zostały zapisane.");
          } else {
            this.toast.error("Wystąpił błąd podczas zapisywania przystanków.");
          }
        } catch (error) {
          console.error(error);
          this.toast.error("Wystąpił błąd.");
        }
      },
    },
  };
</script>

<style scoped>
  /* Dodatkowe style */
  input[type="text"] {
    border-radius: 4px;
  }

  button {
    transition: background-color 0.3s ease;
  }

    button:hover {
      background-color: #5a67d8;
    }

  .v-checkbox--checked .v-checkbox__input {
    background-color: #42b983; /* Kolor dla zaznaczonego checkboxa */
  }
</style>
