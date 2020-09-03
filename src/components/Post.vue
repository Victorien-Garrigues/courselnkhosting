<template>
  <div :id="post.id">
    <div v-if="!post.deleted">
      <div class="flex-container">
        <!-- columns -->
        <!-- column one (profile) -->
        <div class="card-left">
          <img
            v-if="currentUser.id == post.user_id"
            src="../assets/profileIcon.png"
            loading="lazy"
            width="54"
            alt
          />

          <div v-if="currentUser.id != post.user_id" class="row">
            <div class="icon-placement">
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div class="column icon-placement">
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
          </div>
        </div>

        <!-- column two (main) -->
        <div class="card-middle">
          <div class="row">
            <div class="column info-column">
              <p v-if="post.username" class="non-post">
                {{ post.username }}
              </p>
            </div>
            <div class="column info-column">
              <time class="non-post">{{ post.created_at | moment('ddd, MMM D YYYY hh:mma') }}</time>
            </div>
          </div>

          <div class="media">
            <div class="media-left"></div>
            <div class="media-content">
              <div class="reply" v-if="post.isReply">
                <button v-scroll-to="'#' + post.parent_id">Replying to {{ post.replyUsername }}</button>
              </div>
            </div>
          </div>

          <!-- post itself -->
          <p>{{ post.content }}</p>

          <div class="card-image">
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

              <div style="display: flex" v-else class="fileType">
                <!-- If the file is a video -> display video image -->
                <img v-if="isVideo(file)" src="../assets/video.png" />
                <img v-else src="../assets/file.png" />
                <a :href="file.src">{{ file.name }}</a>
              </div>
            </figure>
          </div>

          <div v-if="post.replies > 0" class="post-info">
            <button class="button is-success" @click="viewReplies(post.id)" style="margin-right: 2em">
              {{ post.replies }} Replies
            </button>
          </div>
          <p>{{ post.clips }} Clips</p>
        </div>

        <!-- column three (icons) -->
        <div class="card-right">
          <img
            v-if="currentUser.id != post.user_id"
            src="../assets/profileIcon.png"
            loading="lazy"
            width="54"
            alt
          />

          <div v-if="currentUser.id == post.user_id" class="row">
            <div class="column icon-placement">
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div class="column icon-placement">
              <!-- Deletes post -->
              <button @click="onDelete(post.id)" class="deleteButton is-danger"></button>
            </div>
            <div class="column icon-placement">
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post', 'index', 'currentUser'],

  methods: {
    viewReplies(post_id) {
      this.$emit('viewReplies', post_id);
    },
    addClip(post_id, index) {
      console.log(post_id, index, 'addClip');
      this.$emit('addClip', post_id, index);
    },
    onDelete(post_id) {
      this.$emit('onDelete', post_id);
    },
    reply(post) {
      this.$emit('reply', post);
    },
    openGallery(index, files) {
      this.$emit('openGallery', index, files);
    },

    // If the file is an image
    isImage(file) {
      return file.src.includes('png');
    },

    // If the file is a video
    isVideo(file) {
      return file.src.includes('MP4') || file.src.includes('mp4');
    },
  },
};
</script>
