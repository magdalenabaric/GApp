import { createRouter, createWebHistory } from 'vue-router';
import ArtGallery from '../views/ArtGallery.vue';
import Galerija from '../views/Galerija.vue';
import Prijava from '../views/Prijava.vue';
import PrijavaPrijava from '../views/PrijavaPrijava.vue';
import Registracija from '../views/Registracija.vue';
import KreirajIzlozbu from '../views/KreirajIzlozbu.vue';
import TrenutnaIzlozba from '../views/TrenutnaIzlozba.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'ArtGallery',
    component: ArtGallery
  },
  {
    path: '/galerija',
    name: 'Galerija',
    component: Galerija,
  },
  {
    path: '/prijava',
    name: 'Prijava',
    component: Prijava
  },
  {
    path: '/signin',
    name: 'PrijavaPrijava',
    component: PrijavaPrijava
  },
  {
    path: '/signup',
    name: 'Registracija',
    component: Registracija
  },
  {
    path: '/kreiraj-izlozbu',
    name: 'KreirajIzlozbu',
    component: KreirajIzlozbu,
    meta: { needsUser: true }
  },
  {path: '/trenutnaIzlozba/:id',
    name: 'Exhibit',
    component: TrenutnaIzlozba,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log('Stara ruta', from.name, '-> nova ruta', to.name, 'korisnik', store.currentUser);

  const noUser = store.currentUser === null;

  // Ako korisnik nije prijavljen i pokušava pristupiti stranici koja zahtijeva prijavu, preusmjeri ga na prijavu
  if (noUser && to.meta.needsUser) {
    next({ name: 'Prijava' });
  } else {
    next();
  }

});

export default router;