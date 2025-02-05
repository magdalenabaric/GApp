<template>
  <div class="login-container">
    <div class="button-container">
      <router-link to="/signin" class="btn btn-custom">Prijava</router-link>
      <router-link to="/signup" class="btn btn-custom">Registracija</router-link>
    </div>
    <div class="image-container">
      <img src="@/assets/maska.png" alt="Descriptive Alt Text" class="side-image" />
    </div>
  </div>
</template>

<style lang="scss">
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  padding: 0 20px;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 25%;
}

.btn-custom {
  background-color: #ff6996;
  color: rgb(3, 0, 0);
  padding: 10px 20px;/* velicina gumba */
  margin: 15px 0;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  display: block;
  width: 200px; /* širina gumba */
  font-weight: bold;
  font-size: 18px;
}

.image-container {
  position: absolute;
  right: 0; /* pomak slike desno */
  top: 40%; /* podizanje/spustanje slike */
  transform: translateY(-50%);
  overflow: hidden; /* Kako bi pseudo-element bio vidljiv samo unutar kontejnera */
}

.side-image {
  max-width: 80%; /* velicina slike */
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
  pointer-events: none; /* Kako bi klikovi prolazili kroz pseudo-element */
}
</style>