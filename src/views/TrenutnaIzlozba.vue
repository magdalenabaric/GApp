<template>
    <div class="exhibit">
        <h2 class="exhibit-description">{{ exhibit.description }}</h2>
      <div class="image-grid">
        <div v-for="image in exhibitImages" :key="image.url" class="image-item" @click="openModal(image)">
          <img :src="image.url" :alt="image.name">
          <div class="comments-section">
            <div v-for="comment in image.comments" :key="comment.id" class="comment">
              {{ comment.text }}
            </div>
            <input v-if="currentUser" v-model="newComments[image.name]" @keyup.enter="addComment(image.name)" placeholder="Add a comment..." @click.stop>
            <p v-else>Morate biti prijavljeni da biste dodali komentar.</p>
          </div>
        </div>
      </div>
  
      <!-- Modal for image preview -->
      <div v-if="selectedImage" class="modal" @click="closeModal">
        <div class="modal-content">
          <img :src="selectedImage.url" :alt="selectedImage.name" class="full-image">
          <button class="close-button" @click.stop="closeModal">X</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { API_URL } from "@/config";
  import store from "@/store";

  export default {
    data() {
      return {
        exhibit: {},
        exhibitImages: [],
        newComments: {},
        currentUser: store.currentUser,
        selectedImage: null
      };
    },
    async created() {
      const exhibitId = this.$route.params.id;
      await this.fetchExhibit(exhibitId);
    },
    methods: {
      async fetchExhibit(exhibitId) { //metoda za dohvacanje izlozbi da ih mozemo prikazat
        try {
          const response = await fetch(`${API_URL}/exhibits/${exhibitId}`); //api zahtjev za dohvacanje izlozbi
          if (!response.ok) { //ako nisu ispravno dohvaceni podaci baca gresku
            throw new Error("Greška pri dohvaćanju izložbe");
          }
          const data = await response.json(); //parsiranje u json da se podaci mogu obradit

          this.exhibit = data;  //postavljanje izlozbi u varijablu exhibit
          this.exhibitImages = data.images || []; //postavljanje slika u varijablu, ako postoje a ako ne postavlja varijablu na prazan niz

          // Dohvati komentare za svaku sliku
          for (let image of this.exhibitImages) {
            image.comments = await this.fetchComments(image.name);
          }
        } catch (error) {
          console.error("Greška:", error);
        }
      },
      async fetchComments(imageName) {  //metoda za dohvacanje komentara za neku sliku
        try {
          const response = await fetch(`${API_URL}/comments/?imageName=${imageName}`);
          if (!response.ok) {
            throw new Error("Pogreška pri dohvaćanju komentara");
          }
          const data = await response.json();
          return data.comments || [];
        } catch (error) {
          console.error("Greška:", error);
          return [];
        }
      },
      async addComment(imageName) {   //metoda za dodavanje novog komentara
        if (!this.currentUser) {
          alert("Morate biti prijavljeni da biste dodali komentar.");
          return;
        }

        const newComment = this.newComments[imageName]; //dohvaca sadrzaj komentara
        if (newComment) {
          try {
            const response = await fetch(`${API_URL}/comments/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image_name: imageName,  
                text: newComment,
                user_id: this.currentUser
              })
            });

            if (!response.ok) {
              throw new Error("Pogreška pri dodavanju komentara!");
            }

            // Očisti input polje nakon unosa
            this.newComments[imageName] = "";

            // Dodaj novi komentar u lokalni state da se moze prikazat na frontendu
            const image = this.exhibitImages.find(img => img.name === imageName);
            if (image) {
              image.comments.push({ text: newComment, userId: this.currentUser });
            }
          } catch (error) {
            console.error("Greška:", error);
            alert("Došlo je do pogreške pri dodavanju komentara.");
          }
        }
      },

      //funkcije za otvaranje i zatvaranje modala sa slikama, tj kad pritisnes na sliku ono sto se otvori
      openModal(image) {
        this.selectedImage = image;
      },
      closeModal() {
        this.selectedImage = null;
      }
    }
  };
</script>
  
  <style scoped>
  .exhibit-description {
  font-size: 18px; /* Postavite veličinu slova prema želji */
  }
  .exhibit {
    color: white;
    padding: 20px;
    background-color: black;
    min-height: 100vh;
    position: relative;
  }
  .image-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
  }
  .image-item {
    width: calc(25% - 10px);
    margin-bottom: 10px;
    cursor: pointer;
  }
  .image-item img {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 5px;
  }
  .comments-section {
    margin-top: 10px;
  }
  .comment {
    background-color: white;
    color: black;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 5px;
    border: none;
    border-radius: 5px;
  }
  
  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background: white;
    padding: 10px;
    border-radius: 5px;
    overflow-y: auto; /* Omogućuje pomicanje ako je sadržaj veći od visine modala */
  }
  
  .full-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}
</style>