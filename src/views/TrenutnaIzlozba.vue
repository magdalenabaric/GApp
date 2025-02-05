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
  import { db } from '@/firebase';
  import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
  import store from '@/store';
  
  export default {
    data() {
      return {
        exhibit: {},
        exhibitImages: [],
        newComments: {},
        currentUser: null,
        selectedImage: null
      };
    },
    async created() {
      const exhibitId = this.$route.params.id;
      await this.fetchExhibit(exhibitId);
      this.currentUser = store.currentUser;
    },
    methods: {
      async fetchExhibit(exhibitId) {
        const exhibitDoc = await getDoc(doc(db, 'exhibits', exhibitId));
        if (exhibitDoc.exists()) {
          this.exhibit = exhibitDoc.data();
          this.exhibitImages = this.exhibit.images;
          for (let image of this.exhibitImages) {
            image.comments = await this.fetchComments(image.name);
          }
        } else {
          console.error('No such document!');
        }
      },
      async fetchComments(imageName) {
        const comments = [];
        const commentsSnapshot = await getDocs(collection(db, 'comments', imageName, 'imageComments'));
        commentsSnapshot.forEach(doc => {
          comments.push({ id: doc.id, ...doc.data() });
        });
        return comments;
      },
      async addComment(imageName) {
        if (!this.currentUser) {
          alert('Morate biti prijavljeni da biste dodali komentar.');
          return;
        }
        const newComment = this.newComments[imageName];
        if (newComment) {
          await addDoc(collection(db, 'comments', imageName, 'imageComments'), { text: newComment, userId: this.currentUser });
          this.newComments[imageName] = '';
          const image = this.exhibitImages.find(img => img.name === imageName);
          if (image) {
            image.comments = await this.fetchComments(imageName);
          }
        }
      },
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