import { firestoreAction } from 'vuexfire';
import firebase from '@/firebase';
import db from '@/db';

const posts = db.collection('posts');

const state = {
  courses: [],
  posts: [],
};

const getters = {
  course: (state) => (state.courses[0] ? state.courses[0] : {}),
};

const actions = {
  async createPost({ getters }, post) {
    const result = posts.doc();
    post.course_id = getters.course.id;
    post.id = result.id;
    post.user_id = firebase.auth().currentUser.uid;
    post.created_at = firebase.firestore.FieldValue.serverTimestamp();
    post.updated_at = firebase.firestore.FieldValue.serverTimestamp();
    try {
      await posts.doc(post.id).set(post);
    } catch (error) {
      console.error(error);
    }
  },
  async deletePost(_, post_id) {
    await posts.doc(post_id).delete();
  },
  initCourse: firestoreAction(({ bindFirestoreRef }, courseCode) => {
    bindFirestoreRef(
      'courses',
      db.collection('courses').where('courseCode', '==', courseCode)
    );
  }),
  initPosts: firestoreAction(({ bindFirestoreRef }, course_id) => {
    bindFirestoreRef(
      'posts',
      db.collection('posts').where('course_id', '==', course_id)
    );
  }),
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
};
