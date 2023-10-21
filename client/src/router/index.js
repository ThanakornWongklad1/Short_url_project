import { createRouter, createWebHistory } from "vue-router";
import Firstpage from "../components/Firstpage.vue";
import History from "../components/History.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: Firstpage,
        },
        {
            path: "/history",
            name: "history",
            component: History,
        }
    ],
})

export default router;