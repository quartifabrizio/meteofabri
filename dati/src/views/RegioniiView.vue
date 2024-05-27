<template>
  <div>
    <br><br>
    <div class="tables-container">
      <table class="layout-table">
        <tr>
          <td>
            <div class="table-wrapper">
              <h4>Temperatura Per Regione</h4>
              <table v-if="regioni.length">
                <thead>
                  <tr>
                    <th>Città</th>
                    <th>Temperatura Media (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in regioni" :key="index">
                    <td>{{ item.regione }}</td>
                    <td>{{ Math.round(item.temps.reduce((a, b) => a + b, 0) / item.temps.length) }}</td>
                  </tr>
                </tbody>
              </table>
              <!-- Line Chart for Top 10 Temperatures -->
              <apexchart type="line" :options="chartOptions" :series="chartSeries" height="350">
              </apexchart>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="table-wrapper">
              <h4>Precipitazioni Per Regione</h4>
              <table v-if="regioni.length">
                <thead>
                  <tr>
                    <th>Città</th>
                    <th>Precipitazioni Medie (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in regioni" :key="index">
                    <td>{{ item.regione }}</td>
                    <td>{{ Math.round(item.precips.reduce((a, b) => a + b, 0) / item.precips.length) }}</td>
                  </tr>
                </tbody>
              </table>
              <!-- Line Chart for Top 10 Precipitations -->
              <apexchart type="line" :options="precChartOptions" :series="precChartSeries" height="350">
              </apexchart>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'ClassificaView',
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      temps: [],
      precips: [],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Temperatura (°C)'
          }
        }
      },
      chartSeries: [{
        name: 'Temperatura Media',
        data: []
      }],
      precChartOptions: {
        chart: {
          height: 350,
          type: 'line'
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Precipitazioni (mm)'
          }
        }
      },
      precChartSeries: [{
        name: 'Precipitazioni',
        data: []
      }],
      jsonRegioni: {
        "Lombardia": [
          "Milano",
          "Bergamo",
          "Brescia",
          "Como",
          "Pavia",
          "Sondrio"
        ],
        "Lazio": [
          "Roma",
          "Latina",
          "Frosinone",
          "Viterbo",
          "Rieti"
        ],
        "Campania": [
          "Napoli",
          "Salerno",
          "Caserta",
          "Benevento",
          "Avellino"
        ],
        "Sicilia": [
          "Palermo",
          "Catania",
          "Messina",
          "Siracusa",
          "Trapani"
        ],
        "Veneto": [
          "Venezia",
          "Verona",
          "Padova",
          "Vicenza",
          "Treviso",
          "Belluno"
        ],
        "Piemonte": [
          "Torino",
          "Novara",
          "Cuneo",
          "Asti",
          "Alessandria",
          "Biella"
        ],
        "Toscana": [
          "Firenze",
          "Pisa",
          "Siena",
          "Lucca",
          "Arezzo",
          "Grosseto"
        ],
        "Emilia-Romagna": [
          "Bologna",
          "Modena",
          "Parma",
          "Reggio Emilia",
          "Ferrara",
          "Ravenna"
        ],
        "Puglia": [
          "Bari",
          "Taranto",
          "Foggia",
          "Lecce",
          "Brindisi",
          "Barletta"
        ],
        "Calabria": [
          "Reggio Calabria",
          "Catanzaro",
          "Cosenza",
          "Crotone",
          "Vibo Valentia"
        ],
        "Liguria": [
          "Genova",
          "La Spezia",
          "Savona",
          "Imperia"
        ],
        "Marche": [
          "Ancona",
          "Pesaro",
          "Macerata",
          "Ascoli Piceno",
          "Fermo"
        ],
        "Abruzzo": [
          "L'Aquila",
          "Pescara",
          "Teramo",
          "Chieti"
        ],
        "Friuli-Venezia Giulia": [
          "Trieste",
          "Udine",
          "Gorizia",
          "Pordenone"
        ],
        "Trentino-Alto Adige": [
          "Trento",
          "Bolzano"
        ],
        "Umbria": [
          "Perugia",
          "Terni"
        ],
        "Basilicata": [
          "Potenza",
          "Matera"
        ],
        "Sardegna": [
          "Cagliari",
          "Sassari",
          "Olbia",
          "Oristano",
          "Nuoro"
        ],
        "Valle d'Aosta": [
          "Aosta"
        ],
        "Molise": [
          "Campobasso",
          "Isernia"
        ]
      },
      regioni: []
    };
  },
  async mounted() {
    for (const region in this.jsonRegioni) {
      var array = [];
      this.jsonRegioni[region].forEach(città => {
        array.push(città);
      });
      this.regioni.push({ regione: region, città: array, temps: [], precips: [] });
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      let storedTemps = localStorage.getItem('temperature_data');
      this.temps = JSON.parse(storedTemps);

      let storedPrecs = localStorage.getItem('precipitazioni_data');
      this.precips = JSON.parse(storedPrecs);

      let pos = 0;
      this.temps.forEach(datiCittà => {
        if (pos > 0) {
          datiCittà.forEach(datoCittà => {
            if (typeof datoCittà === 'number' || (!isNaN(parseFloat(datoCittà)) && isFinite(datoCittà))) {
              datoCittà = Number(datoCittà);
              this.regioni.forEach(regione => {
                regione.città.forEach(città => {
                  if (città == datiCittà[0]) {
                    console.log(datiCittà[0] + " è in " + regione.regione);
                    regione.temps.push(datoCittà);
                  }
                });
              });
            }
          });
        } else {
          pos++;
        }
      });

      pos = 0;
      this.precips.forEach(datiCittà => {
        if (pos > 0) {
          datiCittà.forEach(datoCittà => {
            if (typeof datoCittà === 'number' || (!isNaN(parseFloat(datoCittà)) && isFinite(datoCittà))) {
              datoCittà = Number(datoCittà);
              this.regioni.forEach(regione => {
                regione.città.forEach(città => {
                  if (città == datiCittà[0]) {
                    console.log(datiCittà[0] + " è in " + regione.regione);
                    regione.precips.push(datoCittà);
                  }
                });
              });
            }
          });
        } else {
          pos++;
        }
      });
      this.mostraPrecipitazioni(this.regioni);
      this.mostraTemperatureData(this.regioni);
    },
    mostraTemperatureData(data) {
      if (data.length > 1) {
        this.chartOptions.xaxis.categories = data.map(item => item.regione);
        this.chartSeries[0].data = data.map(item => Math.round(item.temps.reduce((a, b) => a + b, 0) / item.temps.length));
      }
    },
    mostraPrecipitazioni(data) {
      if (data.length > 1) {
        this.precChartOptions.xaxis.categories = data.map(item => item.regione);
        this.precChartSeries[0].data = data.map(item => Math.round(item.precips.reduce((a, b) => a + b, 0) / item.precips.length));
      }
    }
  }
};
</script>

<style scoped>
.tables-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.layout-table {
  width: 100%;
}

.table-wrapper {
  margin-bottom: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* Centro i valori delle celle */
}

th {
  background-color: #63a0e1; /* Sfondo azzurro */
  color: #fff; /* Testo bianco */
  font-size: 18px; /* Aumento la dimensione del carattere */
}

h4 {
  font-size: 32px; /* Aumento la dimensione del font dei titoli del doppio */
}
</style>
