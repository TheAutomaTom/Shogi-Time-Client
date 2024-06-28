import { createWebHistory, createRouter } from "vue-router";
import Dashboard from "../../Views/Dashboard.vue";

export const routes = [
  {
    path: "/",
    //  This is the only page that is NOT lazy-loaded, so it looks different from the other imported pages.    
    component: Dashboard,
  },
  {
    path: "/game",
    component: () => import("../../Views/Game.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("../../Views/NotFound.vue"),
  },
];

const router = createRouter({  
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
