<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link left-link" :class="{ active: isActive('/') }">ArtGallery</router-link>
      <router-link to="/galerija" class="nav-link center-link" :class="{ active: isActive('/galerija') }">Galerija</router-link>
      <router-link v-if="!isUserLoggedIn" to="/prijava" class="nav-link right-link" :class="{ active: isActive('/prijava') }">Prijava/Registracija</router-link>
      <a v-if="isUserLoggedIn" href="#" @click="logout" class="nav-link right-link">Odjava</a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import store from '@/store';

export default {
  computed: {
    isUserLoggedIn() {
      return store.currentUser !== null;
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    logout() {
      
      console.log("Odjava korisnika...");
  
      // Brisanje tokena jer je korisnik odjavljen
      localStorage.removeItem("token");

      // Resetiramo korisnika na null jer nije prijavljen
      store.currentUser = null;

      // preusmjeravanje na stranicu za prijavu
      this.$router.push({ name: "Prijava" });

      //ispis za provjeru, mozes obrisat kad provjeris, isto ko i godnji console log
      console.log("Korisnik odjavljen!");
    }
  },
  beforeRouteEnter(to, from, next) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        store.currentUser = user.email;
        next();
      } else {
        store.currentUser = null;
        next();
      }
    });
  }
}
</script>

<style lang="scss">
@import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar {
  display: flex;
  justify-content: space-between;
  background-color: black;
  padding: 20px;
}

.nav-link {
  font-weight: bold;
  color: white;
  text-decoration: none;
  font-size: 20px; /* Povećava veličinu slova */
  
  &.active {
    color: blue !important; /* Plava slova kad je aktivan */
  }
}

.left-link {
  color: red; /* Crvena slova za ArtGallery */
  font-family: 'Dancing Script', cursive; /* Primjena fonta */
  font-size: 30px;
}

.center-link, .right-link {
  color: white; /* Bijela slova za Galerija i Prijava */
}
</style>