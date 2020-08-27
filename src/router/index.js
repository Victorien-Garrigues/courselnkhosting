import Vue from 'vue';
import VueRouter from 'vue-router';
import Signup from '@/components/auth/Signup.vue';
import Login from '@/components/auth/Login.vue';
import Password from '@/components/auth/ResetPassword.vue';
import VerificationEmailSent from '@/components/auth/VerificationEmailSent.vue';
import MessageBoard from '@/views/MessageBoard.vue';
import Courses from '@/views/Courses.vue';
import Profile from '@/views/Profile.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/reset-password',
    name: 'Password',
    component: Password,
  },
  {
    path: '/verification-email-sent',
    name: 'VerificationEmailSent',
    component: VerificationEmailSent,
  },
  {
    path: '/:name',
    name: 'MessageBoard',
    component: MessageBoard,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
