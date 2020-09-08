import db from '@/db';
import { firestoreAction } from 'vuexfire';

const state = {
  allFaculties: [], //All faculties from the users school
};

const actions = {
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
