import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "@/components/auth/Signup.vue";
import Login from "@/components/auth/Login.vue";
import Password from "@/components/auth/ResetPassword.vue";
import PasswordEmailSent from "@/components/auth/PasswordEmailSent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/reset-password",
    name: "Password",
    component: Password,
  },
  {
    path: "/reset-password-verification",
    name: "PasswordEmailSent",
    component: PasswordEmailSent,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
