<template>
  <div class="registration-container">
    <div class="form-container">
      <h2 class="registration-title">REGISTRACIJA</h2>
      <form @submit.prevent="handleSubmit" class="registration-form">
        <div class="form-group">
          <label for="ime">Ime:</label>
          <input 
            type="text" 
            id="ime" 
            v-model="form.ime" required>
        </div>
        <div class="form-group">
          <label for="korisnicko-ime">Korisničko ime:</label>
          <input 
            type="text" 
            id="korisnicko-ime" 
            v-model="form.korisnickoIme" required>
        </div>
        <div class="form-group">
          <label for="email">E-mail:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" required>
        </div>
        <div class="form-group">
          <label for="lozinka">Lozinka:</label>
          <input 
            type="password" 
            id="lozinka" 
            v-model="form.lozinka" required>
        </div>
        <button type="submit" class="btn-submit">POTVRDI</button>
        <p v-if="registracijaUspjesna" class="success-message">Registracija je uspješna!</p>
      </form>
    </div>
    <div class="image-container">
      <img src="@/assets/maska.png" alt="Descriptive Alt Text" class="side-image" />
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import store from "@/store"; 

export default {
  name: 'Registracija',
  data() {
    return {
      form: {
        ime: '',
        korisnickoIme: '',
        email: '',
        lozinka: ''
      },
      registracijaUspjesna: false
    }
  },
  methods: {
    async handleSubmit() {
    try {
      //ispis u konzoli za provjeru registracije, mozes obrisat 
      console.log("Pokušaj registracije:", this.form);
      
      //salje post zahtjev na fast api da se moze registrirat novi korisnik
      const response = await fetch("http://127.0.0.1:8000/users/register", { //ovaj link je fast api endpoint za registraciju korisnika
        method: "POST",
        headers: { "Content-Type": "application/json",
        "Authorization": `Bearer ${store.token}` },   //zbog reloada i logina dodano da se salje i token
        //podaci novog korisnika koji se salju za registraciju
        body: JSON.stringify({
          ime: this.form.ime,
          korisnicko_ime: this.form.korisnickoIme,
          email: this.form.email,
          lozinka: this.form.lozinka
        })
      });

      if (!response.ok) {
        throw new Error(`Doslo je do greske prilikom registracije: ${response.statusText}`);
      }

      console.log("Registracija je uspjela!");
      this.registracijaUspjesna = true;

      //kad se uspjesno registriro korisnik, odma ga prijavimo u app
      const loginResponse = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.form.email,
          lozinka: this.form.lozinka
        })
      });

      if (!loginResponse.ok) {
        throw new Error(`Došlo je do pogreške prilikom prijave: ${loginResponse.statusText}`);
      }

      const loginData = await loginResponse.json();

      //isto provjera jel login uspio, mozes obrisat ako zelis
      console.log("Prijava je uspjesna", loginData);

      //spremanje jwt tokena u localStorage, taj token je odgovor backenda nakon prijave 
      localStorage.setItem("token", loginData.access_token);

      //ovo moras azurirat da bi ostatak app znao da je korisnik prijavljen, pr da bi se navbar promjenio i sl
      store.currentUser = this.form.email;

      //preusmjeravanje na home stranicu, ArtGallery je ruta koja ti je definirana u souter/index.js
      this.$router.push({ name: "ArtGallery" });

    } catch (error) {
      console.error("Došlo je do pogreške prlikom registracije ili prijave:", error);
      alert("Greška: " + error.message);
    }
  
    },
  },
};
</script>

<style scoped>
.success-message {
  color: rgb(225, 158, 177);
}
</style>

<style lang="scss">
.registration-container {
position: relative;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
background-color: black;
padding: 0 20px;
margin-top: -30px; 
}

.form-container {
display: flex;
flex-direction: column;
align-items: center;
position: absolute;
top: 15%; 
left: 50%;
transform: translateX(-50%);
}

.registration-title {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 24px;
  font-weight: bold;
  background-color: #ff6996;
  color: black;
  border-radius: 5px;
  text-align: center;
}

.registration-form {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-group {
  margin-bottom: 15px;
  display: flex; 
  align-items: center; 
}

label {
  display: inline-block;
  width: 160px; 
  color: white;
  margin-right: 10px; 
}

input {
flex: 1; 
padding: 8px;
border-radius: 5px;
border: none;
background-color: #ff6996;
color: black;
}

.btn-submit {
  background-color: #ff6996;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
  align-self: center; /* Centriranje gumba */
}

.btn-submit:hover {
  background-color: #ff4f81;
}

.image-container {
  position: absolute;
  right: 0; /* Pomak slike desno */
  top: 40%; /* Podizanje/spuštanje slike */
  transform: translateY(-50%);
  overflow: hidden; 
}

.side-image {
  max-width: 80%; /* Veličina slike */
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 30px 30px black; 
}

.image-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(circle at center, transparent, black 65%);
  pointer-events: none; 
}
</style>
  