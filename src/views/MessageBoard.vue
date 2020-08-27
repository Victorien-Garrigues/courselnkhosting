<template>
  <body class="body-back">
    <section>
      <div
        class="top"
        @dragenter="showDropArea = true"
        @mouseout="showDropArea = false"
        @drop="showDropArea = false"
      >
        <!-- start of navbar design -->
        <div class="navbar">
          <!-- brand design -->
          <div class="container">
            <a href="#">
              <img
                src="@/assets/mainLogo.png"
                width="200"
                height="50"
                alt="main page logo"
              />
            </a>
          </div>

          <!-- search design -->
          <form style="display: flex;" class="search-form-outside">
            <!-- Files filter -->
            <button
              @click.prevent="filterByFiles = !filterByFiles"
              class="button"
            >
              Files
            </button>

            <!-- Clips filter -->
            <button
              @click.prevent="filterByClips = !filterByClips"
              class="button"
            >
              Clips
            </button>
            <b-field>
              <b-input
                v-model="searchTerm"
                placeholder="Search Posts"
              ></b-input>
            </b-field>
          </form>
        </div>

        <!-- profile design (to be added) -->

        <!-- ^^^ right here -->

        <!-- end of navbar design -->

        <!-- 3 columns for main page -->
        <div class="row">
          <!-- FIRST COLUMN -->
          <div class="column left">
            <h2>course 123</h2>
            <p>course 321</p>
          </div>

          <!-- SECOND COLUMN -->
          <div class="column middle">
            <!-- start of chat container design -->
            <div class="container is-fluid postContainer">
              <div class="posts is-multiline">
                <div v-for="(post, index) in filteredPosts" :key="index">
                  <div class="card" :id="post.id">
                    <!-- this is the post card -->

                    <div class="card-image" v-if="post.files[0]">
                      <figure
                        style="display: inline-block"
                        class="image"
                        :key="index"
                        v-for="(file, index) in post.files"
                      >
                        <!-- Displays a light box image view when images are clicked -->
                        <img
                          v-if="isImage(file)"
                          v-lazy="file.src || file.thumb"
                          @click="openGallery(index, post.files)"
                        />

                        <div style="display: flex;" v-else class="fileType">
                          <!-- If the file is a video -> display video image -->
                          <img v-if="isVideo(file)" src="../assets/video.png" />
                          <img v-else src="../assets/file.png" />
                          <a :href="file.src">{{ file.name }} </a>
                        </div>
                      </figure>
                    </div>
                    <!-- DELETED POSTS -->
                    <div v-if="post.deleted" class="card-content">
                      <p>{{ post.username }} deleted this post</p>
                    </div>
                    <!-- NON-DELETED POSTS -->
                    <div v-if="!post.deleted" class="card-content">
                      <!-- right side buttons -->
                      <p class="subtitle is-6">{{ post.username }}</p>
                      <div class="clipPosition">
                        <table style="width:100%">
                          <tr>
                            <!-- adds and unadds a clip -->
                            <button
                              @click="addClip(post.id)"
                              class="clipButton is-success"
                            ></button>
                          </tr>
                          <tr>
                            <!-- Deletes post -->
                            <button
                              @click="deletePost(post.id)"
                              class="deleteButton is-danger"
                            ></button>
                          </tr>
                          <tr>
                            <!-- Reply button -->
                            <button
                              @click="reply(post)"
                              class="replyButton is-primary"
                            ></button>
                          </tr>
                        </table>
                      </div>

                      <!-- replying to functionality -->
                      <div class="media">
                        <div class="media-left"></div>
                        <div class="media-content">
                          <div class="reply" v-if="post.isReply">
                            <button v-scroll-to="'#' + post.parent_id">
                              Replying to {{ post.replyUsername }}
                            </button>
                          </div>
                          <p>{{ post.content }}</p>
                        </div>
                      </div>

                      <!-- time posted -->
                      <div class="content">
                        <br />
                        <time>{{ getCreated(index) }}</time>
                        <br />

                        <!-- see replies button -->
                        <div v-if="post.replies > 0" class="post-info">
                          <button
                            class="button is-success"
                            @click="viewReplies(post.id)"
                            style="margin-right: 2em;"
                          >
                            {{ post.replies }} Replies
                          </button>
                        </div>
                        <p>{{ post.clips }} Clips</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="listReplies == post.id">
                    <!--  Start of List Of  Replies -->
                    <div
                      v-for="(reply, index) in replies"
                      :key="index"
                      class="replies"
                    >
                      <div style="margin-left: 75px;" class="card">
                        <div class="card-image" v-if="reply.files[0]">
                          <figure
                            class="image"
                            :key="index"
                            v-for="(file, index) in reply.files"
                          >
                            <img :src="file.src" alt="Placeholder image" />
                          </figure>
                        </div>
                        <div class="card-content">
                          <div class="media">
                            <!-- DELETED POST -->
                            <div v-if="reply.deleted">
                              <p>{{ post.username }} deleted this post</p>
                            </div>
                            <!-- NON DELETED POST -->
                            <div v-if="!reply.deleted" class="media-content">
                              <div class="reply" v-if="reply.isReply">
                                <p>Reply to {{ reply.replyUsername }}</p>
                              </div>
                              <p>{{ reply.content }}</p>
                              <p class="subtitle is-6">{{ reply.username }}</p>
                            </div>
                          </div>
                          <div v-if="!reply.deleted" class="content">
                            <br />
                            <time>{{ getCreated(index) }}</time>
                            <br />
                            <button
                              @click="deletePost(reply.id)"
                              class="deleteButton is-danger"
                            ></button>
                            <div class="post-info">
                              <p>{{ reply.clips }} Clips</p>
                            </div>
                            <button
                              @click="childReply(reply)"
                              class="button is-primary"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--  End of List Of  Replies -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="bottom"></div>
        </div>
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i>
        </label>

        <!-- Dropzone -> only show if the user drags onto the page or a files is dropped -->
        <vue-dropzone
          v-if="showDropArea || fileDropped"
          ref="imgDropZone"
          id="dropzone"
          :options="dropzoneOptions"
          @vdropzone-drop="fileDropped = true"
          @vdropzone-complete="afterComplete"
        ></vue-dropzone>

        <!-- If replying to someone -->
        <div class="wrapper">
          <div v-if="post.isReply" class="reply">
            <button @click="post.isReply = false" class="button is-danger">
              X
            </button>
            <p>Reply to {{ replyingTo }}</p>
            <p>{{ replyingMessage }}</p>
          </div>

          <form>
            <label for="file-upload" class="custom-file-upload">
              <i class="fa fa-cloud-upload"></i>
            </label>

            <!-- if the post has files -->
            <div v-if="post.files.length > 0" class="image-div">
              <div
                style="display: inline-block;"
                v-for="file in post.files"
                :key="file.src"
              >
                <img :src="file.src" class="image" />
              </div>
            </div>

            <div class="wrapper">
              <!-- If the post is a reply -->
              <div v-if="post.isReply" class="reply">
                <!-- Cancel reply button -->
                <button @click="post.isReply = false" class="button is-danger">
                  X
                </button>
                <p>Reply to {{ replyingTo }}</p>
                <p>{{ replyingMessage }}</p>
              </div>

              <!-- Text input area -->
              <div class="text-area">
                <ResizeAuto>
                  <template v-slot:default="{ resize }">
                    <textarea
                      v-model="post.content"
                      class="textarea"
                      rows="1"
                      @input="resize"
                    ></textarea>
                  </template>
                </ResizeAuto>

                <!-- Dropzone with attachment icon beside text area -->
                <vue-dropzone
                  ref="imgDropZone"
                  id="attach"
                  :include-styling="false"
                  :options="dropzoneOptions"
                  @vdropzone-complete="afterAttach"
                ></vue-dropzone>
              </div>
            </div>

            <!-- Add Post Button -->
            <button
              @click="onCreatePost()"
              class="button is-success bottom"
              style="margin-top: 1em"
              v-scroll-to="'#bottom'"
            >
              Add Post
            </button>
          </form>
        </div>

        <!-- THIRD COLUMN -->
        <div class="column right">
          <h2>Side</h2>
          <p>Smth will probably go here</p>
        </div>
      </div>
      <!-- END OF TABLE -->
      <LightBox ref="lightbox" :media="media" :show-light-box="false" />
    </section>
  </body>
</template>

<script>
require('vue-image-lightbox/dist/vue-image-lightbox.min.css');
import { mapState, mapActions } from 'vuex';
import firebase from '@/firebase';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import ResizeAuto from '@/components/ResizeAuto';
import db from '@/db';
import LightBox from 'vue-image-lightbox';

// let uuid = require('uuid');

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ResizeAuto,
    LightBox,
  },
  data: () => ({
    media: [], //Clickable images in a post
    searchTerm: '', //Users input in search bar
    showDropArea: false, //Whether the drop area should be shown
    scroll: true, //If the posts container should scroll to the bottom
    fileDropped: false, //If the user dropped a file in the drop zone
    replyingTo: '', //The name of the user you are replying to
    replyingToId: '', //The id of the user you are replying to
    replyingMessage: '', //The message of the post your are replying to
    listReplies: '', //id of post in which to list replies for
    filterByFiles: false, //If the user is filtering by files
    filterByClips: false, //If the user is filtering by clips

    //Drop zone options
    dropzoneOptions: {
      url: 'https://httpbin.org/post',
      thumbnailWidth: 150,
      thumbnailHeight: 150,
      maxFilesize: 5,
      maxFiles: 10,
      duplicateCheck: true,
      addRemoveLinks: true,
    },

    // Post info for adding a post
    post: {
      content: '',
      files: [],
      isReply: false,
      parent_id: '',
      course_id: '',
    },
  }),
  mounted() {
    if (this.course) {
      this.initPosts(this.course);
    }
  },

  updated() {
    this.scrollToBottom(); //Scrolls to bottom of page
  },
  watch: {
    // if the parameter changes reinit posts
    '$route.params.name': function() {
      this.initPosts(this.$route.params.name);
    },

    //if the course changes reinit posts
    course() {
      if (this.course) {
        this.initPosts(this.course);
      }
    },

    // if the user views the replies of a different post
    listReplies() {
      this.initReplies(this.listReplies);
    },
  },
  computed: {
    ...mapState('messageBoard', ['posts', 'replies', 'course']),

    // Filters post depending on which filters the user applies
    filteredPosts() {
      // If typing in the search bar
      if (this.searchTerm) {
        const regexp = new RegExp(this.searchTerm, 'gi');
        return this.posts.filter((post) => post.content.match(regexp));
      }

      // If filtering by files
      if (this.filterByFiles) {
        return this.posts.filter((post) => post.files[0]);
      }

      // If filter by number of clips
      if (this.filterByClips) {
        return this.posts.slice().sort((a, b) => {
          return a.clips - b.clips;
        });
      }
      return this.posts;
    },
  },
  methods: {
    ...mapActions('messageBoard', [
      'createPost',
      'initCourse',
      'initPosts',
      'deletePost',
      'initReplies',
    ]),

    // If the file is an image
    isImage(file) {
      return file.src.includes('png');
    },

    // If the file is a video
    isVideo(file) {
      return file.src.includes('MP4') || file.src.includes('mp4');
    },

    // Scrolls to the bottom of posts
    scrollToBottom() {
      var container = this.$el.querySelector('.postContainer');
      if (this.scroll) {
        container.scrollTop = container.scrollHeight;
        if (container.scrollHeight > 400) {
          this.scroll = false;
        }
      }
    },

    // Adds reply to a post
    async addReply(id) {
      db.collection('posts')
        .doc(id)
        .update({
          replies: firebase.firestore.FieldValue.increment(1),
        });
    },

    // Adds clip to a pots
    async addClip(id) {
      const user = firebase.auth().currentUser;

      var alreadyClipped = false;
      db.collection('users')

        .doc(user.uid)
        .get()
        .then((doc) => {
          for (const clip in doc.data().clips) {
            //Checks if the user has already clipped the post
            if (doc.data().clips[clip] == id) {
              alreadyClipped = true;
            }
          }

          // If the user hasnt clipped the post then clip it else unclip it
          if (!alreadyClipped) {
            db.collection('posts')
              .doc(id)
              .update({
                clips: firebase.firestore.FieldValue.increment(1),
              });
            db.collection('users')
              .doc(user.uid)
              .update({
                clips: firebase.firestore.FieldValue.arrayUnion(id),
              });
          } else {
            db.collection('posts')
              .doc(id)
              .update({
                clips: firebase.firestore.FieldValue.increment(-1),
              });
            db.collection('users')
              .doc(user.uid)
              .update({
                clips: firebase.firestore.FieldValue.arrayRemove(id),
              });
          }
        });
    },

    //Adds the files to post.files and to firebase storage if the file was dropped
    async afterComplete(file) {
      this.fileDropped = true;
      try {
        const storageRef = firebase.storage().ref();

        // If is an image
        if (file['type'] === 'image/jpeg' || file['type'] === 'image/png') {
          const fileRef = storageRef.child(`images/${file.name}.png`);
          await fileRef.put(file);
          const downloadURL = await fileRef.getDownloadURL();
          this.post.files.push({ src: downloadURL, name: file.name });
        } else {
          const fileRef = storageRef.child(`files/${file.name}`);
          await fileRef.put(file);
          const downloadURL = await fileRef.getDownloadURL();
          this.post.files.push({
            src: downloadURL,
            name: file.name,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    //Adds the files to firebase storage if the file was manually added
    async afterAttach(file) {
      this.fileDropped = true;
      try {
        const storageRef = firebase.storage().ref();

        //If the file is an image
        if (file['type'] === 'image/jpeg' || file['type'] === 'image/png') {
          const fileRef = storageRef.child(`images/${file.name}.png`);
          await fileRef.put(file);
          const downloadURL = await fileRef.getDownloadURL();
          this.$refs.imgDropZone.manuallyAddFile(file, downloadURL);
        } else {
          const fileRef = storageRef.child(`files/${file.name}`);
          await fileRef.put(file);
          const downloadURL = await fileRef.getDownloadURL();

          //Adds the file to the dropzone to be viewed
          this.$refs.imgDropZone.manuallyAddFile(file, downloadURL);
        }
      } catch (error) {
        console.log(error);
      }
    },

    //Shows the lightbox of the files images
    openGallery(index, files) {
      this.media = [];
      for (const file in files) {
        const fi = {
          thumb: files[file].src,
          src: files[file].src,
        };
        this.media.push(fi);
      }
      this.$refs.lightbox.showImage(index);
    },

    viewReplies(id) {
      this.listReplies = id;
    },

    // if the user clicks reply to a post
    reply(post) {
      this.post.isReply = true;
      this.replyingTo = post.username;
      this.replyingMessage = post.content;
      this.post.parent_id = post.id;
    },

    // If replying to a reply
    childReply(post) {
      this.reply(post);
    },

    //Creates the post
    async onCreatePost() {
      //If the user has added content or files
      if (this.post.content || this.post.files[0]) {
        this.fileDropped = false;
        this.post.course_id = this.course;

        this.createPost(this.post);

        //if the post is a reply -> adds the reply to the post
        if (this.post.isReply) {
          db.collection('posts')
            .doc(this.post.parent_id)
            .get()
            .then((doc) => {
              //If the post being replied to is also a reply
              if (doc.data().isReply) {
                this.addReply(doc.data().parent_id);
              } else {
                this.addReply(doc.data().id);
              }
            });
        }

        //Resets the post
        this.post = {
          content: '',
          files: [],
          isReply: false,
          parent_id: '',
        };
      }
    },

    //Sets the time since the post was created
    getCreated(index) {
      function timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
          return `${interval} years`;
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return `${interval} months`;
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return `${interval} days`;
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return `${interval} hours`;
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return `${interval} minutes`;
        }
        return `${Math.floor(seconds)} seconds`;
      }
      return timeSince(this.posts[index].created_at.seconds * 1000) < 0
        ? '0 seconds ago'
        : `${timeSince(this.posts[index].created_at.seconds * 1000)} ago`;
    },
  },
};
</script>

<style>
.body-back,
html {
  margin: 0 !important;
  width: 100%;
  min-height: 100vh;
  background-color: #f3f3f3;
}

.navbar {
  position: fixed;
}

.search-form-outside {
  margin-top: 0em;
  margin-right: 30%;
  width: 100%;
}

.posts {
  margin-top: 2em;
}

.card {
  height: 100%;
  margin-top: 20px;
  border-radius: 5px;
  background-color: #f3f3f3;
}
.card img {
  border-radius: 5px;
}

.postContainer {
  height: 60vh;
  overflow: auto;
  margin-bottom: 100px;
}

.postContainer::-webkit-scrollbar {
  width: 3px;
}

.postContainer::-webkit-scrollbar-track {
  background: #ddd;
}

.postContainer::-webkit-scrollbar-thumb {
  background: #aaa;
}

input[type='file'] {
  display: none;
}

.image-div {
  display: flex;
  margin: 25px;
}
.image {
  max-width: 250px;
  margin: 15px;
}

.textarea {
  overflow-y: hidden;
  resize: vertical;
  margin: 0.5rem;
  padding: 0.5rem;
  border-color: #edf2f7;
  background-color: #edf2f7;
  border-width: 0.25rem;
  border-radius: 0.2rem;
  max-height: 18rem;
  min-width: 15rem;
  appearance: none;
}

.post-info {
  display: flex;
}

#attach {
  width: 50px;
  height: 50px;
  padding: 20px 20px;
  cursor: pointer;
  background: url('../assets/attach.png') center/cover;
}

#attach .dz-success-mark,
.dz-error-mark,
.dz-remove {
  display: none;
}

#attach .dz-filename,
.dz-size {
  display: none;
}

.text-area {
  display: flex;
  margin-right: 3em;
  margin-left: 1.5em;
}

.clipPosition {
  position: absolute;
  top: 25%;
  right: 0;

  z-index: 1;
  margin-top: 10px;
  margin-right: 10px;
}

.fileType img {
  max-width: 25px;
  max-height: 25px;
  margin-top: 10px;
  margin-right: 10px;
}

/* CLIP BUTTON */
.clipButton {
  background-color: white;
  padding: 20px 17px;
  cursor: pointer;
  background-image: url('../assets/clipIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
}

.clipButton:hover {
  background-image: url('../assets/clipIcon-hover.png');
}

/* DELETE BUTTON */
.deleteButton {
  background-color: white;
  padding: 20px 17px;
  cursor: pointer;
  background-image: url('../assets/deleteIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
}

.deleteButton:hover {
  background-image: url('../assets/deleteIcon-hover.png');
}

/* REPLY BUTTON */
.replyButton {
  background-color: white;
  padding: 20px 25px;
  cursor: pointer;
  background-image: url('../assets/replyIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
}

.replyButton:hover {
  background-image: url('../assets/replyIcon-hover.png');
}

.column {
  float: left;
  padding: 10px;
}

.middle {
  width: 60%;
}

.left {
  width: 20%;
}

.right {
  width: 20%;
}
</style>
