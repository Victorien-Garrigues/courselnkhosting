<template >
  <section style="margin: 0px !important">
    <div
      @dragenter="showDropArea = true"
      @mouseout="showDropArea = false"
      @drop="showDropArea = false"
    >
      <!-- start of navbar design -->
      <div class="navbar">
        <!-- brand design -->
        <div class="flexNav">
          <a href="#">
            <img src="@/assets/mainLogo.png" width="200" height="50" alt="main page logo" />
          </a>
        </div>

        <!-- search design -->
        <form class="flexNav">
          <b-field>
            <b-input
              v-model="searchTerm"
              placeholder="Search Posts"
              style="margin-left: -100%; width: 300%;"
            ></b-input>
          </b-field>
        </form>

        <!--p>{{ this.userCount }} Members</p-->

        <!-- profile design -->
        <div class="flexNav">
          <router-link
            class="navButton"
            :to="{
                name: 'Profile',
              }"
          >Profile</router-link>

          <router-link
            :to="{
                name: 'Login',
              }"
            @click="logout"
            class="navButton"
          >Logout</router-link>
        </div>
      </div>

      <!-- end of navbar design -->

      <!-- 3 columns for main page -->
      <div>
        <div class="row">
          <!-- FIRST COLUMN -->
          <div class="column left">
            <Courses />
          </div>
        </div>

        <!-- SECOND COLUMN -->
        <div class="column middle" style="height: 81vh">
          <!-- start of chat container design -->
          <div @scroll="onScroll" class="container is-fluid postContainer">
            <div v-if="!isFilter" class="posts is-multiline">
              <div v-for="(post, index) in posts" :key="index">
                <!-- this is the post card -->

                <Post
                  :post="post"
                  :index="index"
                  :currentUser="currentUser"
                  :replies="replies"
                  :listReplies="listReplies"
                  @addClip="addClip"
                  @onDelete="onDelete"
                  @reply="reply"
                  @openGallery="openGallery"
                  @viewReplies="viewReplies"
                />

                <!--div v-if="listReplies == post.id">
              <--  Start of List Of  Replies ->
              <div v-for="(reply, index) in replies" :key="index" class="replies">
                <Post
                  :post="reply"
                  :index="index"
                  :currentUser="currentUser"
                  @addClip="addClip"
                  @onDelete="onDelete"
                  @reply="reply"
                  @openGallery="openGallery"
                  @viewReplies="viewReplies"
                />
              </div>
              <--  End of List Of  Replies ->
                </div-->
              </div>
            </div>

            <!-- If there is a filter applied -->
            <div v-else>
              <div v-for="(post, index) in filteredPosts" :key="index">
                <!-- this is the post card -->
                <Post
                  :post="post"
                  :index="index"
                  :currentUser="currentUser"
                  @addClip="addClip"
                  @onDelete="onDelete"
                  @reply="reply"
                  @openGallery="openGallery"
                  @viewReplies="viewReplies"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- THIRD COLUMN -->
        <div class="column right">
          <div class="whiteBox">
            <h2>Post Filters</h2>

            <!-- Clips filter -->
            <div class="row" style="clear: both;">
              <div class="column">
                <p>Clips</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('clips')"
                  id="tags"
                  :class="{ filterClicked: filterByClips }"
                ></button>
              </div>
            </div>

            <!-- Files filter -->
            <div class="row" style="clear: both;">
              <div class="column">
                <p>Attachments</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('files')"
                  id="tags"
                  :class="{ filterClicked: filterByFiles }"
                ></button>
              </div>
            </div>

            <div class="row" style="clear: both;">
              <div class="column">
                <p>Notes</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('notes')"
                  id="tags"
                  :class="{ filterClicked: filterByNotes }"
                ></button>
              </div>
            </div>

            <div class="row" style="clear: both;">
              <div class="column">
                <p>Exam</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('exams')"
                  id="tags"
                  :class="{ filterClicked: filterByExams }"
                ></button>
              </div>
            </div>

            <div class="row" style="clear: both;">
              <div class="column">
                <p>Questions</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('questions')"
                  id="tags"
                  :class="{ filterClicked: filterByQuestions }"
                ></button>
              </div>
            </div>
            <!--/div-->

            <div class="row" style="clear: both;">
              <div class="column">
                <p>Assignments</p>
              </div>
              <div class="column">
                <button
                  @click.prevent="filterBy('assignments')"
                  id="tags"
                  :class="{ filterClicked: filterByAssignments }"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- END OF TABLE -->

        <!-- text area -->
        <div>
          <div class="flex-container3">
            <!-- if the post has files ->
        <div v-if="post.files.length > 0" class="image-div">
          <div style="display: inline-block" v-for="file in post.files" :key="file.src">
            <img :src="file.src" class="image" />
          </div>
            </div>-->

            <div class="flex-file">
              <!-- uploading files -->
              <vue-dropzone
                v-if="showDropArea || fileDropped"
                ref="imgDropZone"
                id="dropzone"
                style="width: 50%"
                :options="dropzoneOptions"
                @vdropzone-removed-file="onFileRemove"
                @vdropzone-drop="fileDropped = true"
                @vdropzone-complete="afterComplete"
              ></vue-dropzone>

              <label for="file-upload" class="custom-file-upload">
                <i class="fa fa-cloud-upload"></i>
              </label>
            </div>

            <!-- If the post is a reply -->
            <div v-if="post.isReply" class="flex-reply">
              <div class="replyingText">
                <p style="color: black">Replying to {{ replyingTo }}</p>
                <p>{{ replyingMessage }}</p>
              </div>
              <div class="flex-remove">
                <button @click="post.isReply = false" class="remButton">X</button>
              </div>
            </div>
          </div>

          <!-- table -->
          <div class="flex-container2">
            <!-- replies and docs -->
            <div class="chat-left">
              <!-- tags -->

              <button
                @click.prevent="post.notesTag = !post.notesTag"
                :class="{ notesFilterClicked: post.notesTag, notesFilter: true}"
                title="remove note-tag"
              ></button>

              <button
                @click.prevent="post.questionsTag = !post.questionsTag"
                id="questionsFilter"
                :class="{ questionsFilterClicked: post.questionsTag, questionsFilter: true }"
                title="add question-tag"
              ></button>

              <button
                @click.prevent="post.examsTag = !post.examsTag"
                id="examsFilter"
                :class="{ examsFilterClicked: post.examsTag, examsFilter: true }"
                title="add exam-tag"
              ></button>

              <button
                @click.prevent="post.assignmentsTag = !post.assignmentsTag"
                :class="{ assignmentsFilterClicked: post.assignmentsTag, assignmentsFilter: true }"
                id="assignmentsFilter"
                title="add assignment-tag"
                style="margin-top: 8px"
              ></button>
            </div>

            <div class="chat-mid">
              <!-- post itself -->
              <div class="wrapper">
                <form>
                  <!-- Text input area -->
                  <div>
                    <ResizeAuto>
                      <template v-slot:default="{ resize }">
                        <textarea
                          id="message"
                          v-model="post.content"
                          rows="1"
                          @input="resize"
                          placeholder="Have something to say?"
                        ></textarea>
                      </template>
                    </ResizeAuto>
                  </div>
                </form>
              </div>
            </div>

            <div class="chat-right">
              <!-- Dropzone with attachment icon beside text area -->
              <vue-dropzone
                ref="imgDropZone"
                id="attachDropzone"
                class="docButton"
                :include-styling="false"
                :options="dropzoneOptions"
                @vdropzone-complete="afterAttach"
              ></vue-dropzone>
            </div>

            <div class="chat-right">
              <!-- Add Post Button -->
              <button
                @click="onCreatePost()"
                class="sendButton is-success bottom"
                style="margin-left:-15px"
              ></button>
            </div>

            <div class="chat-right" style="padding:20px"></div>

            <div id="bottom"></div>
          </div>
        </div>

        <LightBox ref="lightbox" :media="media" :show-light-box="false" />
      </div>
    </div>
  </section>
</template>

<script>
require("vue-image-lightbox/dist/vue-image-lightbox.min.css");
import { mapState, mapActions } from "vuex";
import firebase from "@/firebase";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import ResizeAuto from "@/components/ResizeAuto";
import Courses from "@/components/Courses";
import Post from "@/components/Post";

import db from "@/db";
import LightBox from "vue-image-lightbox";

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ResizeAuto,
    LightBox,
    Courses,
    Post,
  },

  data: () => ({
    media: [], //Clickable images in a post
    searchTerm: "", //Users input in search bar
    showDropArea: false, //Whether the drop area should be shown
    fileDropped: false, //If the user dropped a file in the drop zone

    replyingTo: "", //The name of the user you are replying to
    replyingToId: "", //The id of the user you are replying to
    replyingMessage: "", //The message of the post your are replying to
    listReplies: "", //id of post in which to list replies for
    inListReplies: "",

    lastCourse: null, //The previous course that the user was on
    userCount: null, //the number of users in the selected course
    otherCourses: [], //The courses that the user is not currently on

    userId: "", //the Id of the current user
    currentUser: null, //the current user

    scroll: true, //whether to scroll to the bottom on updated()
    lastScroll: null, //the previous scroll position

    posts: [], //the loaded posts
    filteredPosts: [], //the loaded tagged posts
    isFilter: false, //If a filter is applied

    //tags
    filterByFiles: false,
    filterByClips: false,
    filterByNotes: false,
    filterByExams: false,
    filterByAssignments: false,
    filterByQuestions: false,

    //Drop zone options
    dropzoneOptions: {
      url: "https://httpbin.org/post",
      thumbnailWidth: 150,
      thumbnailHeight: 150,
      maxFilesize: 5,
      maxFiles: 10,
      duplicateCheck: true,
      addRemoveLinks: true,
    },

    // Post info for adding a post
    post: {
      content: "",
      files: [],
      isReply: false, //if the post is a reply
      parent_id: "", //the id of the post being replied to
      course_id: "", //the id of the selected course

      //tags applied to the post
      notesTag: false,
      examsTag: false,
      assignmentsTag: false,
      questionsTag: false,
    },
  }),

  mounted() {
    if (this.user) {
      this.userId = this.user.id;
      this.currentUser = this.user;
      this.updateOtherCourses(this.course);
      this.loadPosts(this.course);
      this.initNewPost(this.course);
    } else {
      console.log("User is undefined");
    }
  },

  watch: {
    //Watches posts collection and scrolls if scroll is true
    posts: function () {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scrollToBottom();
        }
      });
    },

    //Watches filteredPosts collection and scrolls if scroll is true
    filteredPosts: function () {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scrollToBottom();
        }
      });
    },

    //Changes this.currentUser when user changes
    user() {
      this.currentUser = this.user;
    },

    //if the course changes reinit posts, change last visited of courses, update notifiction listeners
    course() {
      this.scroll = true;
      this.lastScroll = null;
      this.posts = [];

      if (this.course) {
        if (!this.lastCourse) {
          this.lastCourse = this.course;
        }

        this.initNewPost(this.course);
        this.setLastVisited(this.course);
        this.loadPosts(this.course);
        this.updateOtherCourses(this.course);

        //Get User count
        db.collection("courses")
          .doc(this.course)
          .get()
          .then((doc) => {
            this.userCount = doc.data().userCount;
          });
      }
    },

    //When a newPost is added to your current course
    newPost() {
      if (this.newPost[0]) {
        //If the most recent post is being updated
        if (
          this.posts.length != 0 &&
          this.posts[this.posts.length - 1].id === this.newPost[0].id
        ) {
          this.posts[0] = this.newPost[0];
        } else {
          this.posts.push(this.newPost[0]);
        }

        //Check to see if there are tags applied and if to push to filteredposts
        if (this.filtersMatch(this.newPost[0])) {
          //If the most recent post is being updated
          if (
            this.filteredPosts.length != 0 &&
            this.filteredPosts[this.filteredPosts.length - 1].id ===
              this.newPost[0].id
          ) {
            this.filteredPosts[0] = this.newPost[0];
          } else {
            this.filteredPosts.push(this.newPost[0]);
          }
        }
      }
    },

    //Updates the users courses if the notification is unread
    newNotification() {
      if (!this.currentUser) {
        console.log("Error current user is undefined");
        return;
      }

      const userCourses = this.currentUser.courses;
      var isUnreadPost = false;

      //Checks if the post has been read by the user
      for (const index in userCourses) {
        if (
          userCourses[index].course_id === this.newNotification[0].course_id &&
          userCourses[index].lastVisited < this.newNotification[0].created_at
        ) {
          isUnreadPost = true;
        }
      }

      if (!isUnreadPost) {
        console.log("The post has already been read");
        return;
      }

      if (this.currentUser) {
        for (const index in userCourses) {
          //If the notification is from a course with no unread posts
          if (
            userCourses[index].course_id ===
              this.newNotification[0].course_id &&
            !userCourses[index].unreadPosts
          ) {
            userCourses[index].unreadPosts = true;

            //Update users course
            db.collection("users").doc(this.userId).update({
              courses: userCourses,
            }),
              this.$store.commit("user/setCourses", this.currentUser.courses);

            var course_ids = [];
            this.otherCourses = [];

            //Updates otherCourses if there are courses with no unread posts
            for (const index in userCourses) {
              if (!userCourses[index].unreadPosts) {
                course_ids.push(userCourses[index].course_id);
                this.otherCourses.push(userCourses[index]);
              }
            }

            //If all the users courses have unread posts unbind the listener, else keep listening with the updated courses
            if (course_ids.length == 0) {
              this.unbindPosts();
            } else {
              this.newestNotification(course_ids);
            }
          }
        }
      } else {
        console.log("Error, could not get current user");
      }
    },

    // if the user views the replies of a different post -> list the replies
    listReplies() {
      this.initReplies(this.listReplies);
    },
  },

  computed: {
    ...mapState("messageBoard", [
      "replies",
      "course",
      "newPost",
      "newNotification",
    ]),
    ...mapState("user", ["user"]),
  },

  methods: {
    ...mapActions("messageBoard", [
      "createPost",
      "initNewPost",
      "deletePost",
      "initReplies",
      "newestNotification",
      "unbindPosts",
    ]),
    ...mapActions("user", ["logout"]),

    //Loads the first 20 most recent posts
    async loadPosts(course) {
      const tempPosts = [];
      var first = 0;
      if (course) {
        db.collection("posts")
          .where("course_id", "==", course)
          .orderBy("created_at", "desc")
          .limit(20)
          .get()
          .then(function (querySnapshot) {
            //adds all documents besides the most recent as the the newPost() listener will get it
            querySnapshot.forEach(function (doc) {
              if (first != 0) {
                tempPosts.unshift(doc.data());
              } else {
                first = 1;
              }
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
        this.posts = tempPosts;
      }
    },

    //Updates otherCourses to listen for notifications
    updateOtherCourses(course_id) {
      if (this.currentUser) {
        this.otherCourses = [];
        for (const index in this.currentUser.courses) {
          if (this.currentUser.courses[index].course_id === course_id) {
            this.currentUser.courses[index].unreadPosts = false;
            this.$store.commit("user/setUser", this.currentUser);
          } else if (!this.currentUser.courses[index].unreadPosts) {
            this.otherCourses.push(this.currentUser.courses[index]);
          }
        }

        //updates the user collection
        db.collection("users").doc(this.userId).update({
          courses: this.currentUser.courses,
        });

        this.$store.commit("user/setCourses", this.currentUser.courses);

        var course_ids = [];
        for (const index in this.otherCourses) {
          course_ids.push(this.otherCourses[index].course_id);
        }

        if (course_ids.length == 0) {
          this.unbindPosts();
        } else {
          this.newestNotification(course_ids);
        }
      } else {
        console.log("Error, Could not get current user");
      }
    },

    //Check if the newPost matches the currently applied filters
    filtersMatch(newPost) {
      var isMatch = true;
      if (
        (!newPost.notesTag && this.filterByNotes) ||
        (!newPost.examsTag && this.filterByExams) ||
        (!newPost.assignmentsTag && this.filterByAssignments) ||
        (!newPost.questionsTag && this.filterByQuestions) ||
        this.filterByClips ||
        (newPost.files.length == 0 && this.filterByFiles)
      ) {
        isMatch = false;
      }
      return isMatch;
    },
    // If the file is an image
    isImage(file) {
      return file.src.includes("png");
    },

    // If the file is a video
    isVideo(file) {
      return file.src.includes("MP4") || file.src.includes("mp4");
    },

    //Sets a timestamp for the last time a user visisted a course
    async setLastVisited(course_id) {
      if (this.lastCourse && this.lastCourse != course_id) {
        for (const index in this.currentUser.courses) {
          if (this.currentUser.courses[index].course_id === this.lastCourse) {
            this.currentUser.courses[index].lastVisited = Date.now();
            this.$store.commit("user/setUser", this.currentUser);
          }
        }

        //updates user collection in firebase
        db.collection("users").doc(this.userId).update({
          courses: this.currentUser.courses,
        });
      }
      this.lastCourse = course_id;
    },

    setQueryFilters() {
      var queryPosts = db
        .collection("posts")
        .where("course_id", "==", this.course);

      if (this.filterByNotes) {
        queryPosts = queryPosts.where("notesTag", "==", true);
      }

      if (this.filterByExams) {
        queryPosts = queryPosts.where("examsTag", "==", true);
      }

      if (this.filterByAssignments) {
        queryPosts = queryPosts.where("assignmentsTag", "==", true);
      }

      if (this.filterByQuestions) {
        queryPosts = queryPosts.where("questionsTag", "==", true);
      }

      if (this.filterByFiles) {
        queryPosts = queryPosts.where("hasFiles", "==", true);
      }

      if (this.filterByClips) {
        queryPosts = queryPosts.orderBy("clips", "desc");
      } else {
        queryPosts = queryPosts.orderBy("created_at", "desc");
      }

      return queryPosts;
    },

    filterBy(type) {
      this.scroll = true;
      if (type == "notes") {
        this.filterByNotes = !this.filterByNotes;
      } else if (type == "exams") {
        this.filterByExams = !this.filterByExams;
      } else if (type == "assignments") {
        this.filterByAssignments = !this.filterByAssignments;
      } else if (type == "questions") {
        this.filterByQuestions = !this.filterByQuestions;
      } else if (type == "clips") {
        this.filterByClips = !this.filterByClips;
      } else if (type == "files") {
        this.filterByFiles = !this.filterByFiles;
      }
      if (
        !this.filterByNotes &&
        !this.filterByExams &&
        !this.filterByAssignments &&
        !this.filterByQuestions &&
        !this.filterByClips &&
        !this.filterByFiles
      ) {
        this.isFilter = false;
        return;
      }

      this.isFilter = true;
      this.lastScroll = null;

      var queryPosts = this.setQueryFilters();

      var tempPosts = [];
      queryPosts
        .limit(20)
        .get()
        .then(function (querySnapshot) {
          //adds all documents besides the most recent as the the newPost() listener will get it
          querySnapshot.forEach(function (doc) {
            tempPosts.unshift(doc.data());
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });

      this.filteredPosts = tempPosts;
    },

    // Scrolls to the bottom of posts
    scrollToBottom() {
      var container = this.$el.querySelector(".postContainer");
      container.scrollTop = container.scrollHeight;
    },

    //Watches where the user is in the posts container
    onScroll({ target: { scrollTop, scrollHeight } }) {
      //If the user scrolls up -> stop scrolling to the bottom of postsContainer on post updates
      if (this.lastScroll && this.lastScroll > scrollTop) {
        this.scroll = false;
      }

      //If the user scrolls to the top of the postsContainer
      if (scrollTop == 0 && this.lastScroll) {
        if (this.isFilter) {
          this.appendFilteredPosts(scrollHeight);
        } else {
          this.appendPosts(scrollHeight);
        }
      }

      this.lastScroll = scrollTop;
    },

    // Adds clip to a post
    async addClip(post_id, index) {
      var postsCollection = this.isFilter ? this.filteredPosts : this.posts;
      var alreadyClipped = false;
      db.collection("users")
        .doc(this.userId)
        .get()
        .then((doc) => {
          for (const clip in doc.data().clips) {
            //Checks if the user has already clipped the post
            if (doc.data().clips[clip] === post_id) {
              alreadyClipped = true;
            }
          }

          // If the user hasnt clipped the post then clip it else unclip it
          if (!alreadyClipped) {
            postsCollection[index].clips += 1;
            db.collection("posts")
              .doc(post_id)
              .update({
                clips: firebase.firestore.FieldValue.increment(1),
              });
            db.collection("users")
              .doc(this.userId)
              .update({
                clips: firebase.firestore.FieldValue.arrayUnion(post_id),
              });
          } else {
            postsCollection[index].clips -= 1;

            db.collection("posts")
              .doc(post_id)
              .update({
                clips: firebase.firestore.FieldValue.increment(-1),
              });
            db.collection("users")
              .doc(this.userId)
              .update({
                clips: firebase.firestore.FieldValue.arrayRemove(post_id),
              });
          }
        });
    },

    //When a file is removed from dropzone
    onFileRemove(file) {
      for (const index in this.post.files) {
        if (this.post.files[index].name == file.name) {
          this.post.files.splice(index, 1);
        }
      }
      if (this.post.files.length == 0) {
        this.fileDropped = false;
        this.showDropArea = false;
      }
    },
    //Appends the next 20 posts to posts
    async appendPosts(scrollHeight) {
      var container = this.$el.querySelector(".postContainer");
      const tempPosts = [];

      //if there is no filter applied updates posts else update filteredPosts
      if (this.course) {
        await db
          .collection("posts")
          .where("course_id", "==", this.course)
          .orderBy("created_at", "desc")
          .startAfter(this.posts[0].created_at)
          .limit(20)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              tempPosts.push(doc.data());
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });

        //adds all the docs in tempPosts to the beggining of posts
        for (const index in tempPosts) {
          this.posts.unshift(tempPosts[index]);
        }
      }

      //scrolls to bottom
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight - scrollHeight;
      });
    },

    async appendFilteredPosts(scrollHeight) {
      var container = this.$el.querySelector(".postContainer");
      const tempPosts = [];

      var queryPosts = this.setQueryFilters();

      this.posts[0].created_at;
      console.log(this.filteredPosts[0]);
      if (this.course) {
        await queryPosts
          .startAfter(this.filteredPosts[0].created_at)
          .limit(20)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              tempPosts.push(doc.data());
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });

        //adds all the docs in tempPosts to the beggining of posts
        for (const index in tempPosts) {
          this.filteredPosts.unshift(tempPosts[index]);
        }
      }

      //scrolls to bottom
      this.$nextTick(() => {
        container.scrollTop = container.scrollHeight - scrollHeight;
      });
    },

    // Adds reply to a post
    async addReply(id) {
      db.collection("posts")
        .doc(id)
        .update({
          replies: firebase.firestore.FieldValue.increment(1),
        });
    },

    //Adds the files to post.files and to firebase storage if the file was drag and dropped
    async afterComplete(file) {
      this.fileDropped = true;
      try {
        const storageRef = firebase.storage().ref();
        var fileRef = "";

        // If is an image
        if (file["type"] === "image/jpeg" || file["type"] === "image/png") {
          fileRef = storageRef.child(`images/${file.name}.png`);
        } else {
          fileRef = storageRef.child(`files/${file.name}`);
        }

        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        this.post.files.push({
          src: downloadURL,
          name: file.name,
        });
      } catch (error) {
        console.log(error);
      }
    },

    //Adds the files to firebase storage if they were added by clicking on the attach icon in order to display them in top dropzone
    async afterAttach(file) {
      this.fileDropped = true;
      try {
        const storageRef = firebase.storage().ref();
        var fileRef = "";

        //If the file is an image
        if (file["type"] === "image/jpeg" || file["type"] === "image/png") {
          fileRef = storageRef.child(`images/${file.name}.png`);
        } else {
          fileRef = storageRef.child(`files/${file.name}`);
        }

        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();

        //Adds the file to the dropzone to be viewed
        this.$refs.imgDropZone.manuallyAddFile(file, downloadURL);
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

    search() {
      if (this.searchTerm) {
        const regexp = new RegExp(this.searchTerm, "gi");
        return this.posts.filter((post) => post.content.match(regexp));
      }
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
          db.collection("posts")
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
          content: "",
          files: [],
          isReply: false,
          parent_id: "",
          tags: [],
          notesTags: false,
          examsTag: false,
          questionsTag: false,
          assignmentsTag: false,
        };

        this.scroll = true;
        this.showDropArea = false;
        this.fileDropped = false;
      }
    },

    onDelete(post_id) {
      const name = this.currentUser.firstName + " " + this.currentUser.lastName;
      const postsCollection = this.isFilter ? this.filteredPosts : this.posts;
      for (const index in postsCollection) {
        if (postsCollection[index].id == post_id) {
          postsCollection[index].files = [];
          postsCollection[index].content = name + " deleted this post";
          postsCollection[index].deleted = true;
        }
      }
      this.deletePost({ post_id: post_id, name: name });
    },

    //checks if a post has the specified tag
    checkForTag(post, tag) {
      for (const index in post.tags) {
        if (post.tags[index] === tag) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style>
.main {
  margin: 0px;
  padding: 0px;
}

body {
  background: #f3f3f3;
  overflow: hidden;
  bottom: 0;
  height: 100vh;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  /*position: fixed;*/
  width: 100%;
}

.flexNav {
  display: flex;
  align-items: stretch;
  background-color: white;
  align-items: center;
}

.navButton {
  margin-right: 5px;
  background-color: white;
  color: black;
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
  height: 75vh;
  overflow: auto;
  margin-left: auto;
  margin-right: auto;
}

.filterClicked {
  background-color: blue;
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

input[type="file"] {
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

#message {
  background-color: white;
  width: 100%;
  border: none;
  border-radius: 20px;
  outline: none;
  font-size: 1em;
  color: black;
  resize: none;
  overflow: scroll;
  padding: 10px;
  max-height: 70px;
}

#attach {
  width: 50px;
  height: 50px;
  padding: 20px 20px;
  cursor: pointer;
  background: url("../assets/docIcon.png") center/cover;
}

#attach:hover {
  background: url("../assets/docIcon-hover.png") center/cover;
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

.fileType img {
  max-width: 25px;
  max-height: 25px;
  margin-top: 10px;
  margin-right: 10px;
}

/* DOC BUTTON */
.docButton {
  margin: 3px;
  background-color: #f3f3f3;
  padding: 30px 30px;
  max-width: 60px;
  cursor: pointer;
  background-image: url("../assets/docIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.docButton:hover {
  background-image: url("../assets/docIcon-hover.png");
}

.column {
  float: left;
  padding: 10px;
}

.middle {
  width: 70%;
}

.left {
  width: 15%;
}

.right {
  width: 15%;
}

.cardTable {
  display: flex;
  width: 100%;
}

.flex-container2 {
  display: flex;
  align-self: stretch;
  flex-wrap: wrap;
  background-color: #f3f3f3;
  justify-content: center;
  width: 100%;
  max-height: 70px;
  bottom: 0;
}

.flex-container3 {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  background-color: #f3f3f3;
  align-items: center;
  justify-content: center;
  bottom: 0px;
  /*position: fixed;*/
  z-index: 100;
  width: 100%;
}

.chat-left {
  flex-direction: row;
  flex-basis: 12%;
  align-self: center;
  align-items: center;
  justify-content: center;
}

.chat-mid {
  flex-direction: row;
  flex-basis: 40%;
  align-self: center;
}

.chat-right {
  flex-direction: row;
  flex-basis: 5%;
  align-self: center;
}

.whiteBox {
  /*  background-color: white;*/
  padding: 10px;
  border-radius: 0.3rem;
  min-height: 330px;
  margin-left: -25%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 21px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/*Filters */
#tag {
  color: black;
  border: 1px solid gray;
  padding: 5px;
  margin: 0 2px;
}

.notesFilter {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/noteFilter.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.notesFilterClicked {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-color: #f3f3f3;
  background-image: url("../assets/noteFilter-clicked.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.questionsFilter {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/questionFilter.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.questionsFilterClicked {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-color: #f3f3f3;
  background-image: url("../assets/questionFilter-clicked.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.examsFilter {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/examFilter.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.examsFilterClicked {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/examFilter-clicked.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.assignmentsFilter {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/assignmentFilter.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.assignmentsFilterClicked {
  border: 1px solid gray;
  padding: 17px 17px;
  margin: 3px;
  cursor: pointer;
  background-image: url("../assets/assignmentFilter-clicked.png");
  background-color: #f3f3f3;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.flex-reply {
  display: flex;
  align-items: stretch;
  background-color: #f1f1f1;
  justify-content: space-between;
  position: fixed;
  bottom: 65px;
  padding-left: 12%;
  padding-right: 5%;
  width: 70%;
}

.flex-file {
  display: flex;
  align-items: stretch;
  background-color: #f1f1f1;
  justify-content: center;
  position: fixed;
  bottom: 65px;
  width: 100%;
}

.replyingText {
  width: 80%;
}

.flex-remove {
  width: 20%;
}

.remButton {
  background-color: #f3f3f3;
  color: #808080;
  padding: 30px 30px;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  font-size: 15px;
  color: black;
}
</style>
