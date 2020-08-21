<template>
  <section>
    <div
      class="top"
      @dragenter="showDropArea = true"
      @mouseout="showDropArea = false"
      @drop="showDropArea = false"
    >
      <form class="search-form" style="margin-bottom: 2em">
        <b-field>
          <b-input v-model="searchTerm" placeholder="Search Posts"></b-input>
        </b-field>
      </form>
      <div class="container is-fluid postContainer">
        <div class="posts is-multiline">
          <div v-for="(post, index) in filteredPosts" :key="index">
            <div class="card" :id="post.id">
              <div class="card-image" v-if="post.files[0]">
                <figure
                  class="image"
                  :key="index"
                  v-for="(file, index) in post.files"
                >
                  <img :src="file.src" alt="Placeholder image" />
                </figure>
              </div>
              <div v-if="post.deleted" class="card-content">
                <p>{{ post.username }} deleted this post</p>
              </div>
              <div v-if="!post.deleted" class="card-content">
                <div class="media">
                  <div class="media-left"></div>
                  <div class="media-content">
                    <div class="reply" v-if="post.isReply">
                      <button v-scroll-to="'#' + post.parent_id">
                        Reply to {{ post.replyUsername }}
                      </button>
                    </div>
                    <p>{{ post.content }}</p>
                    <p class="subtitle is-6">{{ post.username }}</p>
                  </div>
                </div>
                <div class="content">
                  <br />
                  <time>{{ getCreated(index) }}</time>
                  <br />

                  <button @click="deletePost(post.id)" class="button is-danger">
                    Delete Post
                  </button>
                  <div v-if="post.replys > 0" class="post-info">
                    <button
                      class="button is-success"
                      @click="viewReplys(post.id)"
                      style="margin-right: 2em;"
                    >
                      {{ post.replys }} Replys
                    </button>
                    <p>{{ post.clips }} Clips</p>
                  </div>
                  <button @click="reply(post)" class="button is-primary">
                    Reply
                  </button>
                </div>
              </div>
            </div>
            <div v-if="listReplys == post.id">
              <!--  Start of List Of  Replys -->

              <div v-for="(reply, index) in replys" :key="index" class="replys">
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
                      <div class="media-left"></div>
                      <div class="media-content">
                        <div class="reply" v-if="reply.isReply">
                          <p>Reply to {{ reply.replyUsername }}</p>
                        </div>
                        <p>{{ reply.content }}</p>
                        <p class="subtitle is-6">{{ reply.username }}</p>
                      </div>
                    </div>
                    <div class="content">
                      <br />
                      <time>{{ getCreated(index) }}</time>
                      <br />
                      <button
                        @click="deletePost(reply.id)"
                        class="button is-danger"
                      >
                        Delete Post
                      </button>
                      <div class="post-info">
                        <p>{{ reply.clips }} Clips</p>
                      </div>
                      <button @click="reply(reply)" class="button is-primary">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--  End of List Of  Replys -->
          </div>
        </div>
        <div id="bottom"></div>
      </div>
      <form @submit.prevent="onCreatePost()">
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i>
        </label>
        <vue-dropzone
          v-if="showDropArea"
          ref="imgDropZone"
          id="customdropzone"
          :options="dropzoneOptions"
          @vdropzone-complete="afterComplete"
        ></vue-dropzone>
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
          <div v-if="post.isReply" class="reply">
            <button @click="post.isReply = false" class="button is-danger">
              X
            </button>
            <p>Reply to {{ replyingTo }}</p>
            <p>{{ replyingMessage }}</p>
          </div>
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
        </div>
        <button
          class="button is-success bottom"
          style="margin-top: 1em"
          v-scroll-to="'#bottom'"
        >
          Add Post
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import firebase from '@/firebase';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import ResizeAuto from '@/components/ResizeAuto';
import db from '@/db';

let uuid = require('uuid');

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ResizeAuto,
  },
  data: () => ({
    searchTerm: '',
    showDropArea: false,
    replyingTo: '',
    replyingToId: '',
    replyingMessage: '',
    repliedUsername: '',
    listReplys: '',
    dropzoneOptions: {
      url: 'https://httpbin.org/post',
      thumbnailWidth: 150,
      thumbnailHeight: 150,
      maxFilesize: 0.5,
    },
    post: {
      content: '',
      files: [],
      isReply: false,
      parent_id: '',
    },
  }),
  mounted() {
    this.initCourse(this.$route.params.name);
    this.initUsers();
  },
  created() {
    this.scrollToBottom();
  },
  watch: {
    '$route.params.name': function() {
      this.initCourse(this.$route.params.name);
    },
    course() {
      if (this.course.id) {
        this.initPosts(this.course.id);
      }
    },
    listReplys() {
      this.initReplys(this.listReplys);
    },
  },
  computed: {
    ...mapState('messageBoard', ['posts', 'replys']),
    ...mapGetters({
      course: 'messageBoard/course',
      usersById: 'users/usersById',
    }),
    loadedUsersById() {
      return this.posts.reduce((byId, post) => {
        byId[post.user_id] = this.usersById[post.user_id] || {
          username: 'Loading...',
        };
        return byId;
      }, {});
    },
    filteredPosts() {
      if (this.searchTerm) {
        const regexp = new RegExp(this.searchTerm, 'gi');
        return this.posts.filter((post) => post.content.match(regexp));
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
      'initReplys',
    ]),
    ...mapActions('users', {
      initUsers: 'init',
    }),
    scrollToBottom() {
      var container = this.$el.querySelector('.postContainer');
      container.scrollTop = container.scrollHeight;
    },
    async addReply(id) {
      console.log(id);
      db.collection('posts')
        .doc(id)
        .update({
          replys: firebase.firestore.FieldValue.increment(1),
        });
    },
    async afterComplete(file) {
      const fileName = uuid.v1();
      try {
        var metadata = {
          contentType: 'image/png',
        };
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`files/${fileName}.png`);
        await fileRef.put(file, metadata);
        const downloadURL = await fileRef.getDownloadURL();
        this.post.files.push({ src: downloadURL });
      } catch (error) {
        console.log(error);
      }
      this.$refs.imgDropZone.removeFile(file);
    },
    showReplys(post) {
      this.listReplys = post.id;
    },
    viewReplys(id) {
      this.listReplys = id;
    },
    reply(post) {
      console.log(post);
      this.post.isReply = true;
      this.replyingTo = post.username;
      this.replyingMessage = post.content;
      this.post.parent_id = post.id;
    },
    async onCreatePost() {
      if (this.post.content || this.post.files[0]) {
        this.createPost(this.post);

        if (this.post.isReply) {
          db.collection('posts')
            .doc(this.post.parent_id)
            .get()
            .then((doc) => {
              console.log(doc.data());
              //If the post being replied to is also a reply
              if (doc.data().isReply) {
                this.addReply(doc.data().parent_id);
              } else {
                console.log(doc.data().id);
                this.addReply(doc.data().id);
              }
            });
        }
        this.post = {
          content: '',
          files: '',
          isReply: false,
          parent_id: '',
        };
      }
    },
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

};

<style>
.search-form {
  margin-top: 2em;
}
.posts {
  margin-top: 2em;
}
.card {
  height: 100%;
  margin: 1%;
  border-radius: 5px;
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
</style>
