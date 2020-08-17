<template>
  <section>
    <div
      class="top"
      @dragenter="showDropArea = true"
      @mouseout="showDropArea = false"
    >
      <form class="search-form" style="margin-bottom: 2em">
        <b-field label="Search">
          <b-input v-model="searchTerm"></b-input>
        </b-field>
      </form>
      <div class="container is-fluid postContainer" v-chat-scroll>
        <div class="posts is-multiline">
          <div v-for="(post, index) in filteredPosts" :key="post.id">
            <div class="card">
              <div class="card-image" v-if="post.files[0]">
                <figure
                  class="image"
                  :key="index"
                  v-for="(file, index) in post.files"
                >
                  <img :src="file.src" alt="Placeholder image" />
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left"></div>
                  <div class="media-content">
                    <p>{{ post.title }}</p>
                    <p class="subtitle is-6">
                      {{ loadedUsersById[post.user_id].username }}
                    </p>
                  </div>
                </div>
                <div class="content">
                  <br />
                  <time>{{ getCreated(index) }}</time>
                  <br />
                  <button @click="deletePost(post.id)" class="button is-danger">
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form @submit.prevent="onCreatePost()">
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i>
        </label>
        <input @change="onFileChanged" id="file-upload" type="file" />
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
        <b-input v-model="post.title" type="textarea" rows="3"></b-input>
        <button class="button is-success" style="margin-top: 1em">
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
let uuid = require('uuid');
export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    searchTerm: '',
    showDropArea: false,
    dropzoneOptions: {
      url: 'https://httpbin.org/post',
      thumbnailWidth: 150,
      thumbnailHeight: 150,
      maxFilesize: 0.5,
    },
    post: {
      title: '',
      files: [],
    },
  }),
  mounted() {
    this.initCourse(this.$route.params.name);
    this.initUsers();
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
  },
  computed: {
    ...mapState('messageBoard', ['posts']),
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
        return this.posts.filter((post) => post.title.match(regexp));
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
    ]),
    ...mapActions('users', {
      initUsers: 'init',
    }),
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
    onFileChanged(event) {
      let file = event.target.post.files[0];

      var storageRef = firebase
        .storage()
        .ref('products/' + Math.random() + '_' + file.name);

      let uploadTask = storageRef.put(file);

      uploadTask.on('state_changed', () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.post.files.push(downloadURL);
        });
      });
    },

    async onCreatePost() {
      if (this.post.title || this.post.files[0]) {
        console.log(this.post.files);
        this.createPost(this.post);
        this.post = {
          title: '',
          files: '',
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
.custom-file-upload {
  display: inline-block;
  padding: 12.5px 12.5px;
  cursor: pointer;
  background: url('../assets/attach.png') center/cover;
}

.image-div {
  display: flex;
  margin: 25px;
}
.image {
  max-width: 250px;
  margin: 15px;
}
</style>
