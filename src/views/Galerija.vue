<template>
  <div class="gallery">
    <button class="btn-create-exhibit" @click="kreirajIzlozbu" v-if="!isGuest">Kreiraj svoju izložbu</button>
    <div v-if="isGuest">
      <p class="guest-welcome">Dobrodošli, gost! Nemate mogućnost dodavanja slika ili komentiranja.</p>
    </div>
    <div v-if="exhibits.length === 0">
      <p>Trenutno nema izložbi.</p>
    </div>
    <div class="image-grid" v-else>
      <div v-for="exhibit in exhibits" :key="exhibit.exhibition_id" class="exhibit-card" @click="otvoriIzlozbu(exhibit.exhibition_id)">
        <ArtGalleryCard :exhibit="exhibit" />
      </div>
    </div>
  </div>
</template>

<script>

import ArtGalleryCard from '@/components/ArtGalleryCard.vue';
import store from '@/store';
import { API_URL } from "@/config";

export default {
  components: {
    ArtGalleryCard,
  },
  data() {
    return {
      isGuest: false,
      exhibits: []
    }
  },
  created() {
    this.isGuest = !localStorage.getItem("token");  //provjerava jel korisnik prijavljen
    this.fetchExhibits();
  },
  methods: {
    kreirajIzlozbu() {
      this.$router.push({ name: 'KreirajIzlozbu' });
    },
    async fetchExhibits() {
      try {
        const response = await fetch(`${API_URL}/exhibits/`);
        if (!response.ok) {
          throw new Error("Došlo je do pogreške pri dohvaćanju izložbi");
        }
        const data = await response.json(); //pretvaranje podataka u json format
        
        this.exhibits = data.exhibitions;  // Postavi podatke u exhibits array
      } catch (error) {
        console.error("Greška:", error);
      }
    },
    otvoriIzlozbu(exhibitId) {
      this.$router.push({ name: 'Exhibit', params: { id: exhibitId } });  //kad se pritisne na izlozbu da se otvore detalji
    }
  }
}
</script>


<style>

.guest-welcome {
  font-size: 14px; /* Veličina slova za goste */
}
.gallery {
  color: white;
  padding: 20px;
  background-color: black;
  min-height: 100vh;
  position: relative;
}

.btn-create-exhibit {
  background-color: #ff6996;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  top: 20px;
  right: 20px;
}

.btn-create-exhibit:hover {
  background-color: #ff4f81;
}

.exhibit-card {
  background-color: #222; /* Tamno siva */
  color: white; /* Bijeli tekst */
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.exhibit-card:hover {
  background-color: #333; /* Nijansa tamno sive */
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
}
</style>