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
            <!--div class="info-column">
              <p v-if="post.username" class="non-post">{{ post.username }}</p>
            </div-->
            <!--div class="column info-column">
              <time class="non-post">{{ post.created_at | moment('ddd, MMM D YYYY hh:mma') }}</time>
            </div-->
            <div>
              <div class="media-left"></div>
              <div class="media-content">
                <div class="reply" v-if="post.isReply">
                  <button
                    class="replyingButton"
                    v-scroll-to="'#' + post.parent_id"
                  >
                    Replying to {{ post.replyUsername }}
                  </button>
                </div>
              </div>
            </div>

            <!-- post itself -->
            <div
              class="postItself-other-plain"
              v-if="!post.isReply && post.replies == 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-other-isReply"
              v-if="post.isReply && post.replies == 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-other-hasReplies"
              v-if="!post.isReply && post.replies > 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-other-both"
              v-if="post.isReply && post.replies > 0"
            >
              <b>{{ post.username }}</b>

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
            >
              {{ post.replies }} Replies
            </button>
          </div>
        </div>

        <!-- column three (icons) -->
        <div class="card-right-other">
          <div v-if="currentUser.id != post.user_id" class="flexIcons">
            <div>
              <!-- adds and unadds a clip -->
              <button
                v-if="post.clips == 0"
                @click="addClip(post.id, index)"
                class="clipButton is-success"
              ></button>
              <button
                v-if="post.clips == 1"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton1-other is-success"
              ></button>
              <button
                v-if="post.clips == 2"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton2-other is-success"
              ></button>
              <button
                v-if="post.clips == 3"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton3-other is-success"
              ></button>
              <button
                v-if="post.clips == 4"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton4-other is-success"
              ></button>
              <button
                v-if="post.clips == 5"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton5-other is-success"
              ></button>
              <button
                v-if="post.clips == 6"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton6-other is-success"
              ></button>
              <button
                v-if="post.clips == 7"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton7-other is-success"
              ></button>
              <button
                v-if="post.clips == 8"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton8-other is-success"
              ></button>
              <button
                v-if="post.clips == 9"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButton9-other is-success"
              ></button>
              <button
                v-if="post.clips > 9"
                @click="addClip(post.id, index)"
                class="clipButton-other clipButtonPlus-other is-success"
              ></button>
            </div>
            <div>
              <!-- Reply button -->
              <button
                @click="reply(post)"
                class="replyButton is-primary"
              ></button>
            </div>
          </div>
        </div>
      </div>

      <!-- OWN USER'S POST CARD DESIGN -->
      <div class="flex-container-own" v-if="currentUser.id == post.user_id">
        <!-- columns -->
        <!-- column one (icons) src="post.profile.profileImage" (or this.) src="../assets/profileIcon.png"-->
        <div class="card-right-own">
          <img
            v-if="currentUser.id == post.user_id"
            src="../assets/profileIcon.png"
            alt="profile Image"
            loading="lazy"
            width="54"
          />
        </div>

        <!-- column two (main) -->
        <div class="card-middle-own">
          <div class="mainCard-own">
            <div class="reply" v-if="post.isReply">
              <button
                class="replyingButton-own"
                v-scroll-to="'#' + post.parent_id"
              >
                Replying to {{ post.replyUsername }}
              </button>
            </div>

            <!-- post itself -->
            <div
              class="postItself-own-plain"
              v-if="!post.isReply && post.replies == 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-own-isReply"
              v-if="post.isReply && post.replies == 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-own-hasReplies"
              v-if="!post.isReply && post.replies > 0"
            >
              <b>{{ post.username }}</b>

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

            <div
              class="postItself-own-both"
              v-if="post.isReply && post.replies > 0"
            >
              <b>{{ post.username }}</b>

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
              class="listButton-own"
              @click="viewReplies(post.id)"
              style="margin-right: 2em"
            >
              {{ post.replies }} Replies
            </button>
          </div>
        </div>

        <!-- column three (profile) -->
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
              <button
                @click="onDelete(post.id)"
                class="deleteButton is-danger"
              ></button>
            </div>
            <div>
              <!-- Reply button -->
              <button
                @click="reply(post)"
                class="replyButton is-primary"
              ></button>
            </div>
            <div>
              <!-- adds and unadds a clip -->
              <button
                v-if="post.clips == 0"
                @click="addClip(post.id, index)"
                class="clipButton is-success"
              ></button>
              <button
                v-if="post.clips == 1"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton1-own is-success"
              ></button>
              <button
                v-if="post.clips == 2"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton2-own is-success"
              ></button>
              <button
                v-if="post.clips == 3"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton3-own is-success"
              ></button>
              <button
                v-if="post.clips == 4"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton4-own is-success"
              ></button>
              <button
                v-if="post.clips == 5"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton5-own is-success"
              ></button>
              <button
                v-if="post.clips == 6"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton6-own is-success"
              ></button>
              <button
                v-if="post.clips == 7"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton7-own is-success"
              ></button>
              <button
                v-if="post.clips == 8"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton8-own is-success"
              ></button>
              <button
                v-if="post.clips == 9"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButton9-own is-success"
              ></button>
              <button
                v-if="post.clips > 9"
                @click="addClip(post.id, index)"
                class="clipButton-own clipButtonPlus-own is-success"
              ></button>
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

        <div
          class="flex-container-list-other"
          v-if="currentUser.id != post.user_id"
        >
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
  background-color: #f3f3f3;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/noClipIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
  display: none;
}

.clipButton:hover {
  background-image: url("../assets/noClipIcon.png");
  background-color: #dddddd;
}

.clipButton-one {
  background-color: #f3f3f3;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/clipIcon-one.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  margin: 3px;
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton-own {
  background-color: #f3f3f3;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/clipIcon-own.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
  display: flex;
}

.clipButton1-own {
  background-image: url("../assets/clipIcon1-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton1-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton2-own {
  background-image: url("../assets/clipIcon2-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton2-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton3-own {
  background-image: url("../assets/clipIcon3-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton3-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton4-own {
  background-image: url("../assets/clipIcon4-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton4-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton5-own {
  background-image: url("../assets/clipIcon5-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton5-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton6-own {
  background-image: url("../assets/clipIcon6-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton6-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton7-own {
  background-image: url("../assets/clipIcon7-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton7-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton8-own {
  background-image: url("../assets/clipIcon8-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton8-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButton9-own {
  background-image: url("../assets/clipIcon9-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton9-own:hover {
  background-image: url("../assets/clipIcon-own.png");
  border-radius: 50%;
}

.clipButtonPlus-own {
  background-image: url("../assets/clipIcon9+-own.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButtonPlus-own:hover {
  background-image: url("../assets/clipIcon9+-own.png");
  border-radius: 50%;
}

/* other user's clips */
.clipButton-other {
  background-color: #f3f3f3;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url("../assets/clipIcon-other.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
  margin: 3px;
  display: flex;
}

.clipButton1-other {
  background-image: url("../assets/clipIcon1-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton1-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton2-other {
  background-image: url("../assets/clipIcon2-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton2-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton3-other {
  background-image: url("../assets/clipIcon3-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton3-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton4-other {
  background-image: url("../assets/clipIcon4-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton4-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton5-other {
  background-image: url("../assets/clipIcon5-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton5-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton6-other {
  background-image: url("../assets/clipIcon6-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton6-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton7-other {
  background-image: url("../assets/clipIcon7-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton7-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton8-other {
  background-image: url("../assets/clipIcon8-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton8-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButton9-other {
  background-image: url("../assets/clipIcon9-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButton9-other:hover {
  background-image: url("../assets/clipIcon-other.png");
  border-radius: 50%;
}

.clipButtonPlus-other {
  background-image: url("../assets/clipIcon9+-other.png");
  display: flex;
  border-radius: 0% 50% 50% 50%;
}

.clipButtonPlus-other:hover {
  background-image: url("../assets/clipIcon9+-other.png");
  border-radius: 50%;
}

/* DELETE BUTTON */
.deleteButton {
  background-color: #f3f3f3;
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
  background-image: url("../assets/deleteIcon.png");
  background-color: #dddddd;
}

/* REPLY BUTTON */
.replyButton {
  background-color: #f3f3f3;
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
  background-image: url("../assets/replyIcon.png");
  background-color: #dddddd;
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
  margin-bottom: -5px;
  width: 100%;
  background-color: white;
  cursor: pointer;
  padding: 10px;
  border: white;
  border-radius: 15px 15px 0px 0px;
  opacity: 0.5;
}

.replyingButton-own {
  margin-bottom: -5px;
  padding-bottom: 30px;
  width: 100%;
  background-color: #0fb9b1;
  cursor: pointer;
  padding: 10px;
  border: #0fb9b1;
  border-radius: 15px 15px 0px 0px;
  opacity: 0.5;
}

/* LIST OF REPLIES BUTTON */
.listButton-own {
  margin-top: -5px;
  width: 100%;
  background-color: #0fb9b1;
  cursor: pointer;
  padding: 10px;
  border: #0fb9b1;
  border-radius: 0px 0px 15px 15px;
  opacity: 0.5;
}

.listButton {
  margin-top: -5px;
  width: 100%;
  background-color: white;
  cursor: pointer;
  padding: 10px;
  border: white;
  border-radius: 0px 0px 15px 15px;
  opacity: 0.5;
}

.flex-container {
  display: flex;
  align-items: center;
  background-color: #f3f3f3;
  margin-top: 10px;
  margin-bottom: 10px;
}

.flex-container-list {
  display: flex;
  align-items: center;
  background-color: #f3f3f3;
  align-items: center;
  flex-direction: row-reverse;
  margin-top: 10px;
  margin-bottom: 10px;
}

.flex-container-list-other {
  display: flex;
  align-items: center;
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

.flex-container-own {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  background-color: #f3f3f3;
  margin-top: 10px;
  margin-bottom: 10px;
}

.flex-container-own:hover .clipButton {
  display: flex;
}

.flex-container-own:hover .replyButton {
  display: flex;
}

.flex-container-own:hover .deleteButton {
  display: flex;
}

.card-middle-other {
  margin-top: 5px;
  margin-bottom: 5px;
  max-width: 60%;
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
  /*  flex-basis: 5%;*/
  max-width: 60%;
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
  overflow: visible;
}

.non-post {
  color: black;
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
  background-color: #0fb9b1;
  padding: 10px;
  border: #0fb9b1;
  color: white;
  border-radius: 15px;
  opacity: 0.5;
  max-width: 60%;
  margin-right: 75px;
}

.mainCard-listOther {
  background-color: white;
  padding: 10px;
  border: white;
  border-radius: 5px;
  opacity: 0.5;
  margin-right: 22.4%;
  margin-left: 10%;
}

.postItself-own-plain {
  background-color: #0fb9b1;
  color: white;
  border-radius: 15px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-own-isReply {
  background-color: #0fb9b1;
  color: white;
  border-radius: 5px 5px 15px 15px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-own-hasReplies {
  background-color: #0fb9b1;
  color: white;
  border-radius: 15px 15px 5px 5px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-own-both {
  background-color: #0fb9b1;
  color: white;
  border-radius: 5px 5px 5px 5px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

/* other post design */
.postItself-other-plain {
  background-color: white;
  color: #707070;
  border-radius: 15px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-other-isReply {
  background-color: white;
  color: #707070;
  border-radius: 5px 5px 15px 15px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-other-hasReplies {
  background-color: white;
  color: #707070;
  border-radius: 15px 15px 5px 5px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}

.postItself-other-both {
  background-color: white;
  color: #707070;
  border-radius: 5px 5px 5px 5px;
  padding: 10px;
  max-width: 100%;
  word-wrap: break-word;
}
</style>
