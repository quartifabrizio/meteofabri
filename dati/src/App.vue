<template>

  <nav class="navbar">
  <br>
    <button @click="goToRoute('/')" :class="{ active: currentRoute === '/' }">PRECIPITAZIONI</button>
    <button @click="goToRoute('/about')" :class="{ active: currentRoute === '/about' }">TEMPERATURE</button>
    <button @click="goToRoute('/grafici')" :class="{ active: currentRoute === '/grafici' }">GRAFICI</button>
    <button @click="goToRoute('/comuni')" :class="{ active: currentRoute === '/comuni' }">10 CITTA'PIU'CALDE</button>
    <button @click="goToRoute('/graficii')" :class="{ active: currentRoute === '/graficii' }">GRAFICI 2</button>
    <button @click="goToRoute('/regioni')" :class="{ active: currentRoute === '/regioni' }">REGIONI</button>
    <button @click="goToRoute('/regionii')" :class="{ active: currentRoute === '/regionii' }">REGIONI GRAFICI</button>
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
  watch: {
    '$route'(to) {
      this.currentRoute = to.path;
    }
  },
  methods: {
    goToRoute(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-evenly;
  padding: 10px 0;
}

.navbar button {
  font-weight: bold;
  color: #2c3e50;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.navbar button.active {
  background-color: #82d8fa;
  color: #fff;
}
</style>
