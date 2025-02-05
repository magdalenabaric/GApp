<template>
  <div class="login-container">
    <div class="form-container">
      <h2 class="login-title">PRIJAVA</h2>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required>
        </div>
        <div class="form-group">
          <label for="lozinka">Lozinka:</label>
          <input 
            type="password" 
            id="lozinka" 
            v-model="form.lozinka" 
            required>
        </div>
        <button type="submit" class="btn-submit">POTVRDI</button>
      </form>
    </div>
    <div class="image-container">
      <img src="@/assets/maska.png" alt="Descriptive Alt Text" class="side-image" />
    </div>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import store from '@/store';

export default {
  name: 'PrijavaPrijava',
  data() {
    return {
      form: {
        email: '',
        lozinka: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
      //isto ko i kod registracije, provjera
      console.log('Pokušaj prijave:', this.form.email, this.form.lozinka);
      
      //zahtjev fastu za login
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.form.email,
          lozinka: this.form.lozinka
        })
      });

      const data = await response.json();

      //detail je poruka ako je doslo do pogreske kod registracije i sl, backend ju vraca
      if (!response.ok) {
        throw new Error(data.detail || "Neuspješna prijava");
      }

      //ispis samo za provjeru
      console.log("Uspješna prijava:", data);

      //spremanje tokena, pohrana emaila da se nav moze promijenit i preusmjeravanje na home
      localStorage.setItem("token", data.access_token);
      store.currentUser = this.form.email; 
      this.$router.replace({ name: "ArtGallery" });
    } catch (error) {
      console.error("Doslo je do pogreske prilikom prijave:", error.message);
      alert(`Greška prilikom prijave: ${error.message}`);
    }
    },
  },
};
</script>

<style lang="scss">
.login-container {
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

.login-title {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 24px;
  font-weight: bold;
  background-color: #ff6996;
  color: black;
  border-radius: 5px;
  text-align: center;
}

.login-form {
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
  align-self: center; 
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
  box-shadow: 0 0 30px 30px black; /* Prijelaz s crnom bojom */
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