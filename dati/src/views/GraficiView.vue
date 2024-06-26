<template>
  <div>
    <br><br>
    <!-- Grafico a colonne delle precipitazioni -->
    <div v-if="precipitazioni.length">
      <apexchart type="bar" :options="precipitazioniChartOptions" :series="precipitazioniChartData"></apexchart>
    </div>

    <!-- Grafico a linee della temperatura -->
    <div v-if="temperature.length">
      <apexchart type="line" :options="temperatureChartOptions" :series="temperatureChartData"></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import * as XLSX from 'xlsx';

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      precipitazioni: [],
      temperature: [],
      precipitazioniChartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#1E90FF'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Millimetri (mm)'
          },
          tickAmount: 4 // Impostiamo il numero di tick a 4 per una scala minore
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " mm";
            }
          }
        },
        title: {
          text: 'Precipitazioni annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      precipitazioniChartData: [{
        name: 'Precipitazioni',
        data: []
      }],
      temperatureChartOptions: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#53ea7d'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2,
          colors: ['#53ea7d']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Gradi Celsius (°C)'
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " °C";
            }
          }
        },
        title: {
          text: 'Temperature annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      temperatureChartData: [{
        name: 'Temperatura',
        data: []
      }]
    };
  },
  mounted() {
    this.loadLocalData();
    if (!this.precipitazioni.length || !this.temperature.length) {
      this.loadExcelFiles();
    }
  },
  methods: {
    async loadExcelFiles() {
      try {
        // Carica i dati delle precipitazioni
        const precipitazioniResponse = await fetch(new URL('@/assets/precipitazioni.xlsx', import.meta.url));
        const precipitazioniArrayBuffer = await precipitazioniResponse.arrayBuffer();
        const precipitazioniData = new Uint8Array(precipitazioniArrayBuffer);
        const precipitazioniWorkbook = XLSX.read(precipitazioniData, { type: 'array' });
        const precipitazioniFirstSheetName = precipitazioniWorkbook.SheetNames[0];
        const precipitazioniWorksheet = precipitazioniWorkbook.Sheets[precipitazioniFirstSheetName];
        const precipitazioniJsonData = XLSX.utils.sheet_to_json(precipitazioniWorksheet, { header: 1 });
        this.precipitazioni = precipitazioniJsonData;
        this.updateChartData(this.precipitazioni, this.precipitazioniChartData, this.precipitazioniChartOptions);

        // Carica i dati della temperatura
        const temperatureResponse = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const temperatureArrayBuffer = await temperatureResponse.arrayBuffer();
        const temperatureData = new Uint8Array(temperatureArrayBuffer);
        const temperatureWorkbook = XLSX.read(temperatureData, { type: 'array' });
        const temperatureFirstSheetName = temperatureWorkbook.SheetNames[0];
        const temperatureWorksheet = temperatureWorkbook.Sheets[temperatureFirstSheetName];
        const temperatureJsonData = XLSX.utils.sheet_to_json(temperatureWorksheet, { header: 1 });
        this.temperature = temperatureJsonData;
        this.updateChartData(this.temperature, this.temperatureChartData, this.temperatureChartOptions);

        // Salva i dati nel localStorage
        localStorage.setItem('precipitazioni_data', JSON.stringify(this.precipitazioni));
        localStorage.setItem('temperature_data', JSON.stringify(this.temperature));
      } catch (error) {
        console.error('Errore durante il caricamento dei file Excel:', error);
      }
    },
    updateChartData(data, chartDataArray, options) {
      if (Array.isArray(data) && data.length > 1) {
        options.xaxis.categories = data.slice(1).map(item => item[0]);
        chartDataArray[0].data = data.slice(1).map(item => parseFloat(item[1]));
      }
    },
    loadLocalData() {
      const localPrecipitazioniData = localStorage.getItem('precipitazioni_data');
      const localTemperatureData = localStorage.getItem('temperature_data');
      
      if (localPrecipitazioniData) {
        this.precipitazioni = JSON.parse(localPrecipitazioniData);
        this.updateChartData(this.precipitazioni, this.precipitazioniChartData, this.precipitazioniChartOptions);
      }

      if (localTemperatureData) {
        this.temperature = JSON.parse(localTemperatureData);
        this.updateChartData(this.temperature, this.temperatureChartData, this.temperatureChartOptions);
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
  padding: 16px; /* Aumenta la dimensione delle celle */
  text-align: center; /* Allinea il testo al centro */
  font-family: 'Arial', sans-serif; /* Font migliore */
  font-size: 14px; /* Dimensione font migliorata */
}

th.table-header {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #007bff; /* Colore azzurro per gli indici delle colonne */
  font-size: 20px; /* Aumenta la dimensione del font delle intestazioni */
}

td.table-cell {
  font-family: 'Arial', sans-serif; /* Font migliore */
  font-size: 14px; /* Dimensione font migliorata */
}
</style>
