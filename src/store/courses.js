import { firestoreAction } from 'vuexfire';
import db from '@/db';

const state = {
  courses: [],
};

const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('courses', db.collection('courses'));
  }),
};

export default {
  namespaced: true,
  state,
  actions,
};
