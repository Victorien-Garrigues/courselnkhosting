<template>
  <div :id="post.id">
    <div v-if="!post.deleted">
      <!-- OTHER USER'S POST CARD DESIGN -->
      <div class="flex-container" v-if="currentUser.id != post.user_id">
        <!-- columns -->
        <!-- column one (profile) -->
        <div class="card-left-other">
          <img
            v-if="currentUser.id != post.user_id"
            src="../assets/profileIcon.png"
            loading="lazy"
            width="54"
            alt="profile pic"
          />
        </div>

        <!-- column two (main) -->
        <div class="card-middle-other">
          <div class="mainCard-other">
            <div class="info-column">
              <p v-if="post.username" class="non-post">{{ post.username }}</p>
            </div>
            <!--div class="column info-column">
              <time class="non-post">{{ post.created_at | moment('ddd, MMM D YYYY hh:mma') }}</time>
            </div-->
            <div class="media">
              <div class="media-left"></div>
              <div class="media-content">
                <div class="reply" v-if="post.isReply">
                  <button
                    class="replyingButton"
                    v-scroll-to="'#' + post.parent_id"
                  >Replying to {{ post.replyUsername }}</button>
                </div>
              </div>
            </div>

            <!-- post itself -->
            <div class="postItself">
              <!-- if there's an image -->
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

              <!-- text -->
              <p>{{ post.content }}</p>
            </div>

            <button
              v-if="post.replies > 0"
              class="listButton"
              @click="viewReplies(post.id)"
              style="margin-right: 2em"
            >{{ post.replies }} Replies</button>

            <p>{{ post.clips }} Clips</p>
          </div>
        </div>

        <!-- column three (icons) -->
        <div class="card-right-other">
          <div v-if="currentUser.id != post.user_id" class="flexIcons">
            <div class="icon-placement">
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div class="icon-placement">
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
          </div>
        </div>
      </div>

      <!-- OWN USER'S POST CARD DESIGN -->
      <div class="flex-container" v-if="currentUser.id == post.user_id">
        <!-- columns -->
        <!-- column one (profile) -->
        <div class="card-left-own">
          <img
            v-if="currentUser.id != post.user_id"
            src="../assets/profileIcon.png"
            loading="lazy"
            width="54"
            alt
          />

          <div v-if="currentUser.id == post.user_id" class="flexIcons">
            <div class="icon-placement">
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div class="icon-placement">
              <!-- Deletes post -->
              <button @click="onDelete(post.id)" class="deleteButton is-danger"></button>
            </div>
            <div class="icon-placement">
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
          </div>
        </div>

        <!-- column two (main) -->
        <div class="card-middle-own">
          <div class="mainCard-own">
            <div class="info-column">
              <p v-if="post.username" class="non-post">{{ post.username }}</p>
            </div>
            <!--div class="column info-column">
              <time class="non-post">{{ post.created_at | moment('ddd, MMM D YYYY hh:mma') }}</time>
            </div-->

            <div class="reply" v-if="post.isReply">
              <button
                class="replyingButton"
                v-scroll-to="'#' + post.parent_id"
              >Replying to {{ post.replyUsername }}</button>
            </div>

            <!-- post itself -->
            <div class="postItself">
              <!-- if there's an image -->
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

              <!-- text -->
              <p>{{ post.content }}</p>
            </div>

            <button
              v-if="post.replies > 0"
              class="listButton"
              @click="viewReplies(post.id)"
              style="margin-right: 2em"
            >{{ post.replies }} Replies</button>

            <p>{{ post.clips }} Clips</p>
          </div>
        </div>

        <!-- column three (icons) -->
        <div class="card-right-own">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post", "index", "currentUser"],

  methods: {
    viewReplies(post_id) {
      this.$emit("viewReplies", post_id);
    },
    addClip(post_id, index) {
      console.log(post_id, index, "addClip");
      this.$emit("addClip", post_id, index);
    },
    onDelete(post_id) {
      this.$emit("onDelete", post_id);
    },
    reply(post) {
      this.$emit("reply", post);
    },
    openGallery(index, files) {
      this.$emit("openGallery", index, files);
    },

    // If the file is an image
    isImage(file) {
      return file.src.includes("png");
    },

    // If the file is a video
    isVideo(file) {
      return file.src.includes("MP4") || file.src.includes("mp4");
    },
  },
};
</script>

<style>
.post-info {
  display: flex;
}

/* CLIP BUTTON */
.clipButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/clipIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
}

.clipButton:hover {
  background-image: url("../assets/clipIcon-hover.png");
}

/* DELETE BUTTON */
.deleteButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/deleteIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
}

.deleteButton:hover {
  background-image: url("../assets/deleteIcon-hover.png");
}

/* REPLY BUTTON */
.replyButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/replyIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
}

.replyButton:hover {
  background-image: url("../assets/replyIcon-hover.png");
}

/* SEND BUTTON */
.sendButton {
  margin: 3px;
  background-color: #f3f3f3;
  padding: 30px 30px;
  cursor: pointer;
  background-image: url("../assets/sendIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.sendButton:hover {
  background-image: url("../assets/sendIcon-hover.png");
}

/* REPLYING BUTTON */
.replyingButton {
  margin-bottom: 5px;
  width: 100%;
  background-color: white;
  cursor: pointer;
  padding: 10px;
  border: white;
  border-radius: 5px 5px 0px 0px;
  opacity: 0.5;
}

/* LIST OF REPLIES BUTTON */
.listButton {
  margin-top: 5px;
  width: 100%;
  background-color: white;
  cursor: pointer;
  padding: 10px;
  border: white;
  border-radius: 0px 0px 5px 5px;
  opacity: 0.5;
}

.flex-container {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.flexIcons {
  display: none;
}

.flex-container:hover .flexIcons {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
}

.card-middle-other {
  margin-top: 5px;
  margin-bottom: 5px;
  flex-basis: 70%;
}

.card-left-other {
  flex-basis: 10%;
  padding: 16px;
}

.card-right-other {
  flex-basis: 23%;
  padding: 16px;
}

.card-middle-own {
  margin-top: 5px;
  margin-bottom: 5px;
  flex-basis: 70%;
}

.card-right-own {
  flex-basis: 10%;
  padding: 16px;
}

.card-left-own {
  flex-basis: 23%;
  padding: 16px;
}

.info-column {
  width: 50%;
}

.non-post {
  color: #a9a9a9;
  margin-top: -10%;
}

.mainCard-other {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  justify-content: flex-start;
  flex-direction: column;
}

.mainCard-own {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  justify-content: flex-end;
  flex-direction: column;
}

.postItself {
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
}
</style>