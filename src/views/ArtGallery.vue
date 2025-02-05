<template>
  <div class="art-gallery">
    <!-- Slika -->
    <div class="image-section">
      <img class="banner-image" src="../assets/oci.png" alt="Art Banner">
    </div>
    <!-- Tekst ispod slike -->
    <div class="text-section">
      <p>Svijet je pun umjetnosti koju nitko nikada ne vidi i umjetnika koji se nikada ne pronađu.</p>
      <p>Svijet je pun ljudi koji vole umjetnost i posjećuju izložbe.</p>
      <p>Teško je uspjeti kao umjetnik. Prilika nije dostupna svima.</p>
      <p>Kreirajte svoju virtualnu izložbu ili posjetite brojne druge.</p>
      <p>Kad god, gdje god!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtGallery',
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

.art-gallery {
  height: 90vh;
  background-color: black;
  color: #ff6996;
  display: flex;
  flex-direction: column; /* vertikalno poravnanje */
  align-items: center;
  justify-content: center;

  .image-section {
    /* širina slike */
    max-width: 100%;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .banner-image {
    max-width: 75%; /* za veličinu slike*/
    height: auto;
  }

  .text-section {
    text-align: center;
    font-family: 'Dancing Script', sans-serif;
    font-size: 25px;
    line-height: 1.5;
    max-width: 800px;
  }
}
</style>
