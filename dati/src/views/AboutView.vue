<template>
  <div>
    <br><br>
    <center>
      <h1>TEMPERATURE ANNUALI</h1>
    </center>
    <div class="container">
      <input type="text" v-model="searchQuery" placeholder="Cerca comune" class="search-input">
      <table v-if="filteredData.length">
        <thead>
          <tr>
            <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in filteredData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nessun comune trovato.</p>
    </div>
  </div>
  <br>
  <br>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'HomeView',
  data() {
    return {
      jsonData: [],
      searchQuery: '',
      tableHeaders: [],
      localStorageKey: 'temperature_data'
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) {
        return this.jsonData.slice(1); // Exclude header row
      }
      return this.jsonData.slice(1).filter(row => {
        return row[0].toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  mounted() {
    this.loadLocalData();
    if (!this.jsonData.length) {
      this.loadExcelFile();
    }
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.jsonData = json;
        this.setTableHeaders();
        this.saveLocalData();
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    },
    setTableHeaders() {
      this.tableHeaders = ['Comuni', ...Array.from({ length: 16 }, (_, i) => 2006 + i)];
    },
    saveLocalData() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.jsonData));
    },
    loadLocalData() {
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        this.jsonData = JSON.parse(localData);
        this.setTableHeaders();
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 5%;
}

.search-input {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid;
  padding: 8px;
  text-align: center; /* Allinea il testo al centro */
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
