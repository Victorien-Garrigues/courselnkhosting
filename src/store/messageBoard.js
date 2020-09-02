import { firestoreAction } from 'vuexfire';
import firebase from '@/firebase';
import db from '@/db';

const posts = db.collection('posts');

const mutations = {
  // Sets the course selected by the user
  setCourse(state, course) {
    state.course = course;
  },
};

const state = {
  course: [], //the selected course
  newPost: [], //the posts associated with the selected course
  replies: [], //the replies to a post
  newNotificaton: {}, //Newest Post
};

const actions = {
  // Finished creating the post and adds it to firebase
  async createPost(_, post) {
    const result = posts.doc();
    const user = firebase.auth().currentUser;
    post.id = result.id;
    post.user_id = user.uid;
    post.created_at = Date.now();
    post.replies = 0;
    post.clips = 0;
    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        post.username = doc.data().firstName + ' ' + doc.data().lastName;
        if (post.isReply) {
          db.collection('posts')
            .where('id', '==', post.parent_id)
            .get()
            .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                post.replyUsername = doc.data().username;

                // If the post is replying to a reply
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

  //Deletes a post
  async deletePost(_, { post_id, name }) {
    console.log(post_id);
    console.log(name);
    await posts.doc(post_id).update({
      files: [],
      content: name + ' deleted this post',
      deleted: true,
    });
  },

  // Adds clip to a post
  async addClip(_, { post_id, user_id }) {
    console.log('addClip');
    console.log(post_id);
    console.log(user_id);
    var alreadyClipped = false;
    db.collection('users')
      .doc(user_id)
      .get()
      .then((doc) => {
        for (const clip in doc.data().clips) {
          //Checks if the user has already clipped the post
          if (doc.data().clips[clip] == post_id) {
            alreadyClipped = true;
          }
        }

        // If the user hasnt clipped the post then clip it else unclip it
        if (!alreadyClipped) {
          db.collection('posts')
            .doc(post_id)
            .update({
              clips: firebase.firestore.FieldValue.increment(1),
            });
          db.collection('users')
            .doc(user_id)
            .update({
              clips: firebase.firestore.FieldValue.arrayUnion(post_id),
            });
        } else {
          db.collection('posts')
            .doc(post_id)
            .update({
              clips: firebase.firestore.FieldValue.increment(-1),
            });
          db.collection('users')
            .doc(user_id)
            .update({
              clips: firebase.firestore.FieldValue.arrayRemove(post_id),
            });
        }
      });
  },
  //Binds posts to the firebase collection of posts that have a given course_id
  initNewPost: firestoreAction(({ bindFirestoreRef }, course_id) => {
    bindFirestoreRef(
      'newPost',
      db
        .collection('posts')
        .where('course_id', '==', course_id)
        .orderBy('created_at', 'desc')
        .limit(1)
    ),
      console.log(course_id, 'newPOstCourse)id');
  }),

  //Binds replies to the firebase collection of posts that are repling to a given post
  initReplies: firestoreAction(({ bindFirestoreRef }, originalPost_id) => {
    bindFirestoreRef(
      'replies',
      db
        .collection('posts')
        .where('originalPost_id', '==', originalPost_id)
        .orderBy('created_at', 'asc')
    );
  }),

  //Gets the newest post from that course
  newestNotification: firestoreAction(({ bindFirestoreRef }, course_ids) => {
    bindFirestoreRef(
      'newNotification',
      db
        .collection('posts')
        .where('course_id', 'in', course_ids)
        .orderBy('created_at', 'desc')
        .limit(1)
    );
  }),

  unbindPosts: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef('newNotification');
  }),
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
