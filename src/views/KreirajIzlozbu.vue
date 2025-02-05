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
          <input type="file" multiple="multiple" id="exhibit-images" @change="handleFileUpload" required>
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
import { db, storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
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
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.exhibitImages = files.map((file, index) => ({
        id: index + 1,
        url: URL.createObjectURL(file),
        name: file.name
      }));
    },
    async submitExhibit() {
      const user = store.currentUser; // Dohvati trenutno prijavljenog korisnika

      // Dodaj izložbu u Firestore
      const exhibitDoc = await addDoc(collection(db, 'exhibits'), {
        description: this.exhibitDescription,
        images: [],
        user: {
          email: user,
          displayName: user  // Koristi displayName ako postoji, inače email
        }
      });

      const promises = this.exhibitImages.map(async (image) => {
        const file = await fetch(image.url).then(r => r.blob());
        const storageRef = ref(storage, `images/${exhibitDoc.id}/${image.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return {
          url: downloadURL,
          name: image.name
        };
      });

      const uploadedImages = await Promise.all(promises);

      // Ažuriraj dokument izložbe sa slikama
      const exhibitRef = doc(db, 'exhibits', exhibitDoc.id);
      await updateDoc(exhibitRef, {
        images: uploadedImages
      });

      // Očisti formu
      this.exhibitDescription = '';
      this.exhibitImages = [];

      // Preusmjeri na Galerija.vue nakon kreiranja izložbe
      this.$router.push({ name: 'Galerija' });
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