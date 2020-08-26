import db from '@/db';
import firebase from '@/firebase';
import { firestoreAction } from 'vuexfire';

const state = {
  faculties: [], //The users faculties
  allFaculties: [], //All faculties from the users school
};

const actions = {
  //Gets all faculties from the db and sets the 'faculties' state with those faculties
  async initFaculties({ state }) {
    await db
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => {
        state.faculties = doc.data().faculties;
      });
  },

  //Binds the 'allFaculties' state with all the faculties from the users school
  initAllFaculties: firestoreAction(({ bindFirestoreRef }, school_id) => {
    bindFirestoreRef(
      'allFaculties',
      db
        .collection('faculties')
        .where('school_id', '==', school_id)
        .orderBy('name')
    );
  }),
};

export default {
  namespaced: true,
  state,
  actions,
};
