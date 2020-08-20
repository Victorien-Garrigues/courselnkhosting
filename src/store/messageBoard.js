import { firestoreAction } from 'vuexfire';
import firebase from '@/firebase';
import db from '@/db';

const posts = db.collection('posts');

const state = {
  courses: [],
  posts: [],
  replys: [],
};

const getters = {
  course: (state) => (state.courses[0] ? state.courses[0] : {}),
};

const actions = {
  async createPost({ getters }, post) {
    const result = posts.doc();
    const user = firebase.auth().currentUser;
    post.course_id = getters.course.id;
    post.id = result.id;
    post.user_id = user.uid;
    post.created_at = firebase.firestore.FieldValue.serverTimestamp();
    post.replys = 0;
    post.clips = 0;
    db.collection('users')
      .where('userId', '==', user.uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          post.username = doc.data().username;

          if (post.isReply) {
            db.collection('posts')
              .where('id', '==', post.parent_id)
              .get()
              .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                  post.replyUsername = doc.data().username;
                  try {
                    posts.doc(post.id).set(post);
                  } catch (error) {
                    console.error(error);
                  }
                });
              })
              .catch(function(error) {
                console.log('Error getting documents: ', error);
              });
          } else {
            try {
              posts.doc(post.id).set(post);
            } catch (error) {
              console.error(error);
            }
          }
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  },
  async deletePost(_, post_id) {
    await posts.doc(post_id).delete();
  },
  async addReply(post) {
    console.log('yo');
    console.log(post);
    db.collection('posts')
      .doc(post.id)
      .update({
        replys: post.replys + 1,
      });
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
      db
        .collection('posts')
        .where('course_id', '==', course_id)
        .orderBy('created_at', 'asc')
    );
  }),
  initReplys: firestoreAction(({ bindFirestoreRef }, parent_id) => {
    bindFirestoreRef(
      'replys',
      db
        .collection('posts')
        .where('parent_id', '==', parent_id)
        .orderBy('created_at', 'asc')
    );
  }),
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
};
