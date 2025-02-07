import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Croppa from "vue-croppa";
import 'vue-croppa/dist/vue-croppa.css';
import store from "./store";

const savedUser = localStorage.getItem("user");   //dodano da kad reloadas stranicu korisnik ostane prijavljen
if (savedUser) {
  store.currentUser = JSON.parse(savedUser);
}

const app = createApp(App);
app.use(router);
app.use(Croppa);
app.mount('#app');