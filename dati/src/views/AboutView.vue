<template>
  <div> <br><br>
    <center>
      <h1>TEMPERATURE</h1>
    </center>
    <div class="container">
      <div class="button-container">
        <button class="temperature-button" @click="addNewYearColumn()">Aggiungi nuovo dato</button>
      </div>
      <table v-if="jsonData.length">
        <thead>
          <tr>
            <th v-for="(value, key) in jsonData[0]" :key="key"
              :class="{ 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni' }">{{ key }}</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in jsonData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key"
              :class="[
                { 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni', 'comune-name': key === 'Comuni' },
                isEditing(rowIndex, key) ? 'editing' : ''
              ]" @click="editCell(rowIndex, key)">
              <span v-if="!isEditing(rowIndex, key)">{{ value }}</span>
              <input v-else v-model="jsonData[rowIndex][key]" class="editable-cell">
            </td>
            <td>
              <button class="save-button" @click="saveRow(rowIndex)">Salva</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import * as XLSX from 'xlsx';

export default {
  name: 'HomeView',
  data() {
    return {
      jsonData: [],
      originalData: [],
      editedCells: [],
      localStorageKey: 'temperature_data'
    };
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
        this.originalData = JSON.parse(JSON.stringify(json));
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    },
    addNewYearColumn() {
      this.jsonData.forEach((item, index) => {
        if (index === 0) {
          item.push(item[item.length - 1] + 1);
        } else {
          item.push(0);
        }
      });
      this.saveLocalData();
      this.updateExcelFile();
    },
    isEditing(rowIndex, key) {
      return this.editedCells.some(cell => cell.rowIndex === rowIndex && cell.key === key);
    },
    editCell(rowIndex, key) {
      if (!this.isEditing(rowIndex, key)) {
        this.editedCells.push({ rowIndex, key });
      }
    },
    saveRow(rowIndex) {
      this.editedCells = this.editedCells.filter(cell => cell.rowIndex !== rowIndex);
      this.saveLocalData();
      this.updateExcelFile();
    },
    saveLocalData() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.jsonData));
    },
    loadLocalData() {
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        this.jsonData = JSON.parse(localData);
      }
    },
    async updateExcelFile() {
      try {
        const worksheet = XLSX.utils.json_to_sheet(this.jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        await fetch('/api/update-excel', {
          method: 'POST',
          body: excelData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del file Excel:', error);
      }
    }
  }
};
</script>


<style scoped>
.container {
  margin: 0 5%;
}

.button-container {
  text-align: center;
  margin-bottom: 20px;
}

.temperature-button {
  background-color: #ff7f50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}

.temperature-button:hover {
  background-color: #ff4500;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.editing {
  background-color: red;
}

.comune-name {
  color: gray;
}

.save-button {
  background-color: yellow;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #ffea00;
}

.editable-cell {
  width: 100%;
  max-width: 100px; /* Imposta una larghezza massima */
  overflow-x: auto; /* Aggiungi una scrollbar orizzontale */
  white-space: nowrap; /* Evita che il testo vada a capo */
}
</style>
