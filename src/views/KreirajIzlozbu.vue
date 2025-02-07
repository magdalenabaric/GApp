<template>
  <div class="create-exhibit">
    <form @submit.prevent="submitExhibit">
      <div class="left-section">
        <div class="form-group">
          <label for="exhibit-description">Opis izložbe:</label>
          <textarea id="exhibit-description" v-model="exhibitDescription" required></textarea>
        </div>
        <div class="form-group">
          <label for="exhibit-images">Dodaj slike:</label>
          <input type="file" multiple id="exhibit-images" @change="handleFileUpload" required>
        </div>
        <croppa
          width="300"
          height="300"
          placeholder="Učitaj sliku..."
          v-model="imageReference"
          :output="{ width: 300, height: 300 }"
        ></croppa>
        <button type="submit" class="btn-submit">Kreiraj izložbu</button>
      </div>
      <div class="right-section">
        <div class="image-grid">
          <div v-for="image in exhibitImages" :key="image.id" class="image-item">
            <img :src="image.url" :alt="image.name">
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';
import store from '@/store'; // Pretpostavljamo da je store pravilno konfiguriran za korisnika

export default {
  components: {
    Croppa
  },
  data() {
    return {
      exhibitDescription: '',
      exhibitImages: [],
      imageReference: null
    }
  },
  methods: {
    handleFileUpload(event) {   //funkcija za upload slika za izlozbu
      const files = Array.from(event.target.files);   //pretvara slike u polje da se mogu iterirat
      this.exhibitImages = [];    //resetira se jer se trebaju prikazat samo trenutno ucitane slike
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.exhibitImages.push({
            id: index + 1,
            url: e.target.result, 
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    },
    async submitExhibit() {   //izlozbe se salju na backend
      try {
        const user = store.currentUser; // Dohvati trenutno prijavljenog korisnika

        if (!user) {
          alert("Morate biti prijavljeni kako biste kreirali izložbu.");
          return;
        }

        const exhibitData = {
          naziv: "Nova Izložba",
          opis: this.exhibitDescription,
          user: { displayName: user },
          images: this.exhibitImages.map(image => ({
            url: image.url,
            name: image.name
          }))
        };

        const response = await fetch(`${API_URL}/exhibits/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exhibitData)
        });

        if (!response.ok) {
          throw new Error("Greška pri kreiranju izložbe!");
        }

        alert("Izložba uspješno kreirana!");
        this.$router.push({ name: "Galerija" });

      } catch (error) {
        console.error("Greška:", error);
        alert("Došlo je do pogreške.");
       }
    } 
  }
};
</script>


<style>
.create-exhibit {
  color: white;
  padding: 20px;
  background-color: black;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.left-section {
  width: 30%; /* Širina lijevog dijela */
  float: left;
}

.right-section {
  width: 70%; /* Širina desnog dijela */
  float: right;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group textarea,
.form-group input[type="file"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #ff6996; /* Rozo/narančasta boja */
  color: black;
  margin-top: 0;
}

.btn-submit {
  background-color: #ff6996;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
}

.btn-submit:hover {
  background-color: #ff4f81;
}

/* Stilovi za galeriju slika */
.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  width: calc(25% - 10px); /* četvrtina širine sa razmakom od 10px */
  margin-bottom: 10px;
}

.image-item img {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
</style>