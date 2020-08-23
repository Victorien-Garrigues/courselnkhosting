import { firestoreAction } from 'vuexfire';
import firebase from '@/firebase';
import db from '@/db';

const posts = db.collection('posts');

const state = {
  courses: [],
  posts: [],
  replies: [],
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
    post.replies = 0;
    post.clips = 0;
    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        post.username = doc.data().username;

        if (post.isReply) {
          db.collection('posts')
            .where('id', '==', post.parent_id)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                post.replyUsername = doc.data().username;
                if (doc.data().isReply) {
                  post.originalPost_id = doc.data().parent_id;
                } else {
                  post.originalPost_id = post.parent_id;
                }
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
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  },
  async deletePost(_, post_id) {
    await posts.doc(post_id).update({
      files: [],
      content: '',
      deleted: true,
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
  initReplies: firestoreAction(({ bindFirestoreRef }, originalPost_id) => {
    bindFirestoreRef(
      'replies',
      db
        .collection('posts')
        .where('originalPost_id', '==', originalPost_id)
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
