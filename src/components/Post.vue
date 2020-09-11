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
          </div>
        </div>

        <!-- column three (icons) -->
        <div class="card-right-other">
          <div v-if="currentUser.id != post.user_id" class="flexIcons">
            <div>
              <!-- shows number of clips -->
              <button class="clipNum is-success">{{ post.clips }}</button>
            </div>
            <div>
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div>
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

          <div v-if="currentUser.id == post.user_id" class="flexIcons-own">
            <div>
              <!-- Deletes post -->
              <button @click="onDelete(post.id)" class="deleteButton is-danger"></button>
            </div>
            <div>
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
            <div>
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div>
              <!-- shows number of clips -->
              <button class="clipNum is-success">{{ post.clips }}</button>
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
            <div>
              <!-- adds and unadds a clip -->
              <button @click="addClip(post.id, index)" class="clipButton is-success"></button>
            </div>
            <div>
              <!-- Reply button -->
              <button @click="reply(post)" class="replyButton is-primary"></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="post.deleted" class="flex-container-deleted">
      <div class="mainCard-delete">
        <p class="post-itself">{{ post.username }} has deleted this post</p>
      </div>
    </div>

    <div v-if="listReplies == post.id && showRepliesList">
      <div v-for="(reply, index) in replies" :key="index">
        <div class="flex-container-list" v-if="currentUser.id == post.user_id">
          <div class="mainCard-listOwn">
            <p>{{ reply.username }}</p>
            <p>{{ reply.content }}</p>
          </div>
        </div>

        <div class="flex-container-list" v-if="currentUser.id != post.user_id">
          <div class="mainCard-listOther">
            <p>{{ reply.username }}</p>
            <p>{{ reply.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post", "index", "currentUser", "replies", "listReplies"],

  data: () => ({
    showRepliesList: false,
  }),

  methods: {
    viewReplies(post_id) {
      this.showRepliesList = !this.showRepliesList;
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
  display: none;
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
  display: none;
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
  display: none;
}

.replyButton:hover {
  background-image: url("../assets/replyIcon-hover.png");
}

.clipNum {
  background-color: white;
  padding: 10.5px 14.5px;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  margin: 3px;
  display: flex;
}

.clipNum:hover {
  background-color: #0fafa8;
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

.flex-container-list {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.flex-container-deleted {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 30px;
}

/*.flexIcons {
  display: none;
}

.flex-container:hover .flexIcons {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
}*/

.flexIcons {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
}

.flexIcons-own {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  justify-content: flex-end;
}

.flex-container:hover .clipButton {
  display: flex;
}

.flex-container:hover .replyButton {
  display: flex;
}

.flex-container:hover .deleteButton {
  display: flex;
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
  margin-top: 20px;
  margin-bottom: -8px;
  margin-left: 5px;
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

.mainCard-delete {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
}

.mainCard-listOwn {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  /*break*/
  width: 100%;
  background-color: white;
  padding: 10px;
  border: white;
  border-radius: 5px;
  opacity: 0.5;
  margin-left: 22.4%;
  margin-right: 10%;
}

.mainCard-listOther {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  /*break*/
  width: 100%;
  background-color: white;
  padding: 10px;
  border: white;
  border-radius: 5px;
  opacity: 0.5;
  margin-right: 22.4%;
  margin-left: 10%;
}

.postItself {
  background-color: #fff;
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
}
</style>