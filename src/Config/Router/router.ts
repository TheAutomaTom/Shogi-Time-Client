import { createWebHistory, createRouter } from "vue-router";
import Home from "../../Views/Home.vue";

export const routes = [
  {
    path: "/",
    name: "/home",
    //  This is the only page that is NOT lazy-loaded, so it looks different from the other imported pages.    
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("../../Views/NotFound.vue"),
  },
];

const router = createRouter({
  //
  history: createWebHistory(/*import.meta.env.BASE_URL*/),
  routes,
});

export default router;
