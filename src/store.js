import { reactive } from 'vue';

const store = reactive({
  searchTerm: '',
  currentUser: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,

  token: localStorage.getItem("token") || null,

  login(user, token) {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem("token", token);   //spremi token
    localStorage.setItem("user", JSON.stringify(user)); // Spremi korisnika
  },

  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
});

export default store;