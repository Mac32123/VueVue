import 'vuetify/styles'; // Importowanie stylów Vuetify
import { createVuetify } from 'vuetify'; // Importowanie Vuetify
import { VTextField, VBtn, VCheckbox, VDataTable } from 'vuetify/components'; // Importowanie komponentów, których będziesz używać

export default createVuetify({
  components: {
    VTextField, // Komponent dla pola tekstowego
    VBtn, // Komponent przycisku
    VCheckbox, // Komponent checkboxa
    VDataTable, // Komponent tabeli danych
  },
});
