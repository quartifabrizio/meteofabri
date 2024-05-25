<template>
  <center><h1>VELIQI DATI-METEOCLIMATICI</h1></center>
  <nav>
    <div class="navbar">
      <button @click="goHome" :class="{ active: currentRoute === '/' }">PRECIPITAZIONI</button>
      <button @click="goAbout" :class="{ active: currentRoute === '/about' }">TEMPERATURE</button>
      <button @click="goGrafici" :class="{ active: currentRoute === '/grafici' }">GRAFICI</button>  
      <button @click="goComuni" :class="{ active: currentRoute === '/comuni' }">CALDE PRECIPITAZIONI</button>
      <button @click="goComunii" :class="{ active: currentRoute === '/comunii' }">CALDE TEMPERATURE</button>
      <button @click="goGraficii" :class="{ active: currentRoute === '/graficii' }">GRAFICI 2</button>
      <button @click="goRegioni" :class="{ active: currentRoute === '/regioni' }">REGIONI</button>
      <button @click="goRegionii" :class="{ active: currentRoute === '/regionii' }">REGIONI GRAFICI</button>
    </div>
  </nav>
  <router-view/>
</template>

<script>
export default {
  data() {
    return {
      currentRoute: ''
    };
  },
  created() {
    this.currentRoute = this.$route.path;
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goAbout() {
      this.$router.push('/about');
    },
    goGrafici() {
      this.$router.push('/grafici');
    },
    goComuni() {
      this.$router.push('/comuni');
    },
    goComunii() {
      this.$router.push('/comunii');
    },
    goRegioni() {
      this.$router.push('/regioni');
    },
    goGraficii() {
      this.$router.push('/graficii');
    },
    goRegionii() {
      this.$router.push('/regionii');
    }
  },
  watch: {
    '$route'(to,) {
      this.currentRoute = to.path;
    }
  }
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.navbar button {
  font-weight: bold;
  color: #2c3e50;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 20px;
  margin-right: 10px;
}

.navbar button.active {
  color: #42b983;
  text-decoration: underline;
}
</style>
