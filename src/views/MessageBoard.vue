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
              <img src="@/assets/mainLogo.png" width="200" height="50" alt="main page logo" />
            </a>
          </div>

          <!-- search design -->
          <form style="display: flex;" class="search-form-outside">
            <b-field>
              <b-input v-model="searchTerm" placeholder="Search Posts"></b-input>
            </b-field>
          </form>
          <p>{{ this.userCount }} Members</p>

          <!-- profile design -->
          <div>
            <router-link
              class="button"
              :to="{
                name: 'Profile',
              }"
              >Profile</router-link
            >

            <router-link
              :to="{
                name: 'Login',
              }"
              @click="logout"
              class="button"
              >Logout</router-link
            >
          </div>
        </div>

        <!-- end of navbar design -->

        <!-- 3 columns for main page -->
        <div class="row">
          <!-- FIRST COLUMN -->
          <div class="column left">
            <Courses />
          </div>

          <!-- SECOND COLUMN -->
          <div class="column middle">
            <!-- start of chat container design -->
            <div @scroll="onScroll" class="container is-fluid postContainer">
              <div class="posts is-multiline">
                <div v-for="(post, index) in filteredPosts" :key="index">
                  <!-- this is the post card -->
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
                              <time class="non-post">{{
                                post.created_at | moment('ddd, MMM D YYYY hh:mma')
                              }}</time>
                            </div>
                          </div>

                          <div class="media">
                            <div class="media-left"></div>
                            <div class="media-content">
                              <div class="reply" v-if="post.isReply">
                                <button v-scroll-to="'#' + post.parent_id">
                                  Replying to {{ post.replyUsername }}
                                </button>
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
                            <button
                              class="button is-success"
                              @click="viewReplies(post.id)"
                              style="margin-right: 2em"
                            >
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

                  <div v-if="listReplies == post.id">
                    <!--  Start of List Of  Replies -->
                    <div v-for="(reply, index) in replies" :key="index" class="replies">
                      <div :id="post.id">
                        <div v-if="!post.deleted" class="card-content">
                          <div class="row">
                            <!-- columns -->
                            <!-- column one (profile) -->
                            <div class="column card-left">
                              <img src="../assets/profileIcon.png" loading="lazy" width="54" alt />
                            </div>

                            <!-- column two (main) -->
                            <div class="column card-middle">
                              <div class="row">
                                <div class="column info-column">
                                  <p class="non-post">{{ post.username }}</p>
                                </div>
                                <div class="column info-column">
                                  <time class="non-post">{{
                                    post.created_at | moment('dddd, MMMM Do YYYY')
                                  }}</time>
                                </div>
                              </div>

                              <div class="media">
                                <div class="media-left"></div>
                                <div class="media-content">
                                  <div class="reply" v-if="post.isReply">
                                    <button v-scroll-to="'#' + post.parent_id">
                                      Replying to {{ post.replyUsername }}
                                    </button>
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
                                <button
                                  class="button is-success"
                                  @click="viewReplies(post.id)"
                                  style="margin-right: 2em"
                                >
                                  {{ post.replies }} Replies
                                </button>
                              </div>
                              <p>{{ post.clips }} Clips</p>
                            </div>

                            <!-- column three (icons) -->
                            <div class="column card-right">
                              <div class="row">
                                <div class="column icon-placement">
                                  <!-- adds and unadds a clip -->
                                  <button
                                    @click="onAddClip(post.id, index)"
                                    class="clipButton is-success"
                                  ></button>
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
                    </div>
                    <!--  End of List Of  Replies -->
                  </div>
                </div>
              </div>
            </div>

            <div class="type-menu">
              <!-- uploading files (outside of table) -->
              <label for="file-upload" class="custom-file-upload">
                <i class="fa fa-cloud-upload"></i>
              </label>

              <vue-dropzone
                v-if="showDropArea || fileDropped"
                ref="imgDropZone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-drop="fileDropped = true"
                @vdropzone-complete="afterComplete"
              ></vue-dropzone>

              <!-- table -->
              <div class="row">
                <div class="column chat-left">
                  <!-- tags -->
                  <div style="display: flex" class="tags">
                    <button
                      @click.prevent="generalTag = !generalTag"
                      class
                      :class="{ clicked: generalTag }"
                      id="tag"
                    >
                      General
                    </button>
                    <button @click.prevent="notesTag = !notesTag" id="tag" :class="{ clicked: notesTag }">
                      Notes
                    </button>
                    <button @click.prevent="examTag = !examTag" id="tag" :class="{ clicked: examTag }">
                      Exam
                    </button>
                    <button
                      @click.prevent="assignmentTag = !assignmentTag"
                      id="tag"
                      :class="{ clicked: assignmentTag }"
                    >
                      Assignment
                    </button>
                  </div>

                  <!-- post itself -->
                  <div class="wrapper">
                    <form>
                      <label for="file-upload" class="custom-file-upload">
                        <i class="fa fa-cloud-upload"></i>
                      </label>

                      <!-- if the post has files -->
                      <div v-if="post.files.length > 0" class="image-div">
                        <div style="display: inline-block" v-for="file in post.files" :key="file.src">
                          <img :src="file.src" class="image" />
                        </div>
                      </div>

                      <div class="wrapper buttons are-small">
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
                        <div>
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
                      </div>
                    </form>
                  </div>
                  <div id="bottom"></div>
                </div>

                <div class="column chat-right">
                  <!-- Add Post Button -->
                  <button @click="onCreatePost()" class="sendButton is-success bottom"></button>
                </div>

                <div class="column chat-right">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- THIRD COLUMN -->
      <div class="column right">
        <div class="whiteBox">
          <h2>Post Filters</h2>

          <!-- Files filter -->
          <div class="row">
            <div class="column">
              <p>Attachment</p>
            </div>
            <div class="column">
              <label class="switch">
                <input
                  type="checkbox"
                  @click.prevent="filterByFiles = !filterByFiles"
                  id="tags"
                  :class="{ clicked: filterByFiles }"
                />
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <!-- Clips filter -->
          <div class="row" style="clear: both;">
            <div class="column">
              <p>Clips</p>
            </div>
            <div class="column">
              <button
                @click.prevent="filterByClips = !filterByClips"
                id="tags"
                :class="{ clicked: filterByClips }"
              ></button>
            </div>
          </div>

          <!-- General Tag -->
          <div class="row" style="clear: both;">
            <div class="column">
              <p>General</p>
            </div>
            <div class="column">
              <button
                @click.prevent="filterByGeneral = !filterByGeneral"
                id="tags"
                :class="{ clicked: filterByGeneral }"
              ></button>
            </div>
          </div>

          <div class="row" style="clear: both;">
            <div class="column">
              <p>Notes</p>
            </div>
            <div class="column">
              <button
                @click.prevent="filterByNotes = !filterByNotes"
                id="tags"
                :class="{ clicked: filterByNotes }"
              ></button>
            </div>
          </div>

          <div class="row" style="clear: both;">
            <div class="column">
              <p>Exam</p>
            </div>
            <div class="column">
              <button
                @click.prevent="filterByExam = !filterByExam"
                id="tags"
                :class="{ clicked: filterByExam }"
              ></button>
            </div>
          </div>

          <div class="row" style="clear: both;">
            <div class="column">
              <p>Assignment</p>
            </div>
            <div class="column">
              <button
                @click.prevent="filterByAssignment = !filterByAssignment"
                id="tags"
                :class="{ clicked: filterByAssignment }"
              ></button>
            </div>
          </div>
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
import Courses from '@/components/Courses';
import db from '@/db';
import LightBox from 'vue-image-lightbox';

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ResizeAuto,
    LightBox,
    Courses,
  },

  data: () => ({
    media: [], //Clickable images in a post
    searchTerm: '', //Users input in search bar
    showDropArea: false, //Whether the drop area should be shown
    fileDropped: false, //If the user dropped a file in the drop zone

    replyingTo: '', //The name of the user you are replying to
    replyingToId: '', //The id of the user you are replying to
    replyingMessage: '', //The message of the post your are replying to
    listReplies: '', //id of post in which to list replies for
    lastCourse: null, //The previous course that the user was on
    userCount: null, //the number of users in the selected course
    otherCourses: [], //The courses that the user is not currently on
    userId: '', //the Id of the current user
    currentUser: null, //the current user
    posts: [], //the loaded posts
    scroll: true, //whether to scroll to the bottom on updated()
    lastScroll: null, //the previous scroll position

    //Filters
    filterByFiles: false,
    filterByClips: false,
    filterByGeneral: false,
    filterByNotes: false,
    filterByExam: false,
    filterByAssignment: false,
    filterByQuestions: false,

    //Which Tags are clicked
    generalTag: false,
    notesTag: false,
    examTag: false,
    assignmentTag: false,
    questionsTag: false,

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
      isReply: false, //if the post is a reply
      parent_id: '', //the id of the post being replied to
      course_id: '', //the id of the selected course
      tags: [], //tags applied to the post
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
      console.log('User is undefined');
    }
  },

  watch: {
    //Watches posts collection and scrolls if scroll is true
    posts: function() {
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

        db.collection('courses')
          .doc(this.course)
          .get()
          .then((doc) => {
            this.userCount = doc.data().userCount;
          });
      }
    },

    //the new post is added to posts
    newPost() {
      if (this.newPost[0] && this.posts[0].id != this.newPost[0].id) {
        this.posts.push(this.newPost[0]);
      } else if (this.posts[0].id == this.newPost[0].id) {
        this.posts[0] = this.newPost[0];
      }
    },

    //Updates the users courses if the notification is unread
    newNotification() {
      if (!this.currentUser) {
        console.log('Error current user is undefined');
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
        console.log('The post has already been read');
        return;
      }

      if (this.currentUser) {
        for (const index in userCourses) {
          //If the notification is from a course with no unread posts
          if (
            userCourses[index].course_id === this.newNotification[0].course_id &&
            !userCourses[index].unreadPosts
          ) {
            userCourses[index].unreadPosts = true;

            //Update users course
            db
              .collection('users')
              .doc(this.userId)
              .update({
                courses: userCourses,
              }),
              this.$store.commit('user/setCourses', this.currentUser.courses);

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
        console.log('Error, could not get current user');
      }
    },

    // if the user views the replies of a different post list the replies
    listReplies() {
      this.initReplies(this.listReplies);
    },
  },

  computed: {
    ...mapState('messageBoard', ['replies', 'course', 'newPost', 'newNotification']),
    ...mapState('user', ['user']),

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

      // If filter by number of clips
      if (this.filterByGeneral) {
        return this.posts.filter((post) => this.checkForTag(post, 'general'));
      }

      // If filter by number of clips
      if (this.filterByNotes) {
        return this.posts.filter((post) => this.checkForTag(post, 'notes'));
      }

      // If filter by number of clips
      if (this.filterByExam) {
        return this.posts.filter((post) => this.checkForTag(post, 'exam'));
      }

      // If filter by number of clips
      if (this.filterByAssignment) {
        return this.posts.filter((post) => this.checkForTag(post, 'assignment'));
      }

      // If filter by number fof clips
      if (this.filterByQuestions) {
        return this.posts.filter((post) => this.checkForTag(post, 'questions'));
      }
      return this.posts;
    },
  },

  methods: {
    ...mapActions('messageBoard', [
      'createPost',
      'initNewPost',
      'deletePost',
      'initReplies',
      'newestNotification',
      'unbindPosts',
    ]),
    ...mapActions('user', ['logout']),

    //Loads the first 10 most recent posts
    async loadPosts(course) {
      const tempPosts = [];
      var first = 0;
      if (course) {
        db.collection('posts')
          .where('course_id', '==', course)
          .orderBy('created_at', 'desc')
          .limit(10)
          .get()
          .then(function(querySnapshot) {
            //adds all documents besides the most recent as the the newPost() listener will get it
            querySnapshot.forEach(function(doc) {
              if (first != 0) {
                tempPosts.unshift(doc.data());
              } else {
                first = 1;
              }
            });
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
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
            this.$store.commit('user/setUser', this.currentUser);
          } else if (!this.currentUser.courses[index].unreadPosts) {
            this.otherCourses.push(this.currentUser.courses[index]);
          }
        }

        //updates the user collection
        db.collection('users')
          .doc(this.userId)
          .update({
            courses: this.currentUser.courses,
          });

        this.$store.commit('user/setCourses', this.currentUser.courses);

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
        console.log('Error, Could not get current user');
      }
    },
    // If the file is an image
    isImage(file) {
      return file.src.includes('png');
    },

    // If the file is a video
    isVideo(file) {
      return file.src.includes('MP4') || file.src.includes('mp4');
    },

    //Sets a timestamp for the last time a user visisted a course
    async setLastVisited(course_id) {
      if (this.lastCourse && this.lastCourse != course_id) {
        for (const index in this.currentUser.courses) {
          if (this.currentUser.courses[index].course_id === this.lastCourse) {
            this.currentUser.courses[index].lastVisited = Date.now();
            this.$store.commit('user/setUser', this.currentUser);
          }
        }

        //updates user collection in firebase
        db.collection('users')
          .doc(this.userId)
          .update({
            courses: this.currentUser.courses,
          });
      }
      this.lastCourse = course_id;
    },

    // Scrolls to the bottom of posts
    scrollToBottom() {
      var container = this.$el.querySelector('.postContainer');
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
        this.appendPosts(scrollHeight);
      }

      this.lastScroll = scrollTop;
    },

    // Adds clip to a post
    async addClip(post_id, index) {
      var alreadyClipped = false;
      db.collection('users')
        .doc(this.userId)
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
            this.posts[index].clips += 1;
            db.collection('posts')
              .doc(post_id)
              .update({
                clips: firebase.firestore.FieldValue.increment(1),
              });
            db.collection('users')
              .doc(this.userId)
              .update({
                clips: firebase.firestore.FieldValue.arrayUnion(post_id),
              });
          } else {
            this.posts[index].clips -= 1;

            db.collection('posts')
              .doc(post_id)
              .update({
                clips: firebase.firestore.FieldValue.increment(-1),
              });
            db.collection('users')
              .doc(this.userId)
              .update({
                clips: firebase.firestore.FieldValue.arrayRemove(post_id),
              });
          }
        });
    },

    //Appends the next 10 posts to posts
    async appendPosts(scrollHeight) {
      var container = this.$el.querySelector('.postContainer');
      const tempPosts = [];
      if (this.course) {
        await db
          .collection('posts')
          .where('course_id', '==', this.course)
          .orderBy('created_at', 'desc')
          .startAfter(this.posts[0].created_at)
          .limit(10)
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              tempPosts.push(doc.data());
            });
          })
          .catch(function(error) {
            console.log('Error getting documents: ', error);
          });

        //adds all the docs in tempPosts to the beggining of posts
        for (const index in tempPosts) {
          this.posts.unshift(tempPosts[index]);
        }

        //Keeps scroll position
        this.$nextTick(() => {
          container.scrollTop = container.scrollHeight - scrollHeight;
        });
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

    //Adds the files to post.files and to firebase storage if the file was drag and dropped
    async afterComplete(file) {
      this.fileDropped = true;
      try {
        const storageRef = firebase.storage().ref();
        var fileRef = '';

        // If is an image
        if (file['type'] === 'image/jpeg' || file['type'] === 'image/png') {
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
        var fileRef = '';

        //If the file is an image
        if (file['type'] === 'image/jpeg' || file['type'] === 'image/png') {
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
        const regexp = new RegExp(this.searchTerm, 'gi');
        return this.posts.filter((post) => post.content.match(regexp));
      }
    },
    //Creates the post
    async onCreatePost() {
      //If the user has added content or files
      if (this.post.content || this.post.files[0]) {
        this.fileDropped = false;
        this.post.course_id = this.course;
        this.setTags();
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

        //Resets tags
        this.generalTag = false;
        this.notesTag = false;
        this.examTag = false;
        this.notesTag = false;
        this.questionsTag = false;

        this.scrollToBottom();
        //Resets the post
        this.post = {
          content: '',
          files: [],
          isReply: false,
          parent_id: '',
          tags: [],
        };
      }
    },

    onDelete(post_id) {
      const name = this.currentUser.firstName + ' ' + this.currentUser.firstName;
      for (const index in this.posts) {
        if (this.posts[index].id == post_id) {
          this.posts[index].files = [];
          this.posts[index].content = name + ' deleted this post';
          this.posts[index].deleted = true;
        }
      }
      this.deletePost({ post_id: post_id, name: name });
    },

    //If the user adds a tag
    setTags() {
      if (this.generalTag) {
        this.post.tags.push('general');
      }

      if (this.notesTag) {
        this.post.tags.push('notes');
      }

      if (this.examTag) {
        this.post.tags.push('exam');
      }

      if (this.assignmentTag) {
        this.post.tags.push('assignment');
      }
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
.body-back {
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
  height: 300px;
  overflow: auto;
  margin-left: auto;
  margin-right: auto;
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
  border-color: #f3f3f3;
  background-color: #f3f3f3;
  border-width: 0.25rem;
  border-radius: 2rem;
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
  background: url('../assets/docIcon.png') center/cover;
}

#attach:hover {
  background: url('../assets/docIcon-hover.png') center/cover;
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

/* CLIP BUTTON */
.clipButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url('../assets/clipIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.clipButton:hover {
  background-image: url('../assets/clipIcon-hover.png');
}

/* DELETE BUTTON */
.deleteButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url('../assets/deleteIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.deleteButton:hover {
  background-image: url('../assets/deleteIcon-hover.png');
}

/* REPLY BUTTON */
.replyButton {
  background-color: white;
  padding: 17px 17px;
  cursor: pointer;
  background-image: url('../assets/replyIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.replyButton:hover {
  background-image: url('../assets/replyIcon-hover.png');
}

/* SEND BUTTON */
.sendButton {
  margin: 3px;
  background-color: #f3f3f3;
  padding: 30px 30px;
  cursor: pointer;
  background-image: url('../assets/sendIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.sendButton:hover {
  background-image: url('../assets/sendIcon-hover.png');
}

/* DOC BUTTON */
.docButton {
  margin: 3px;
  background-color: #f3f3f3;
  padding: 30px 30px;
  cursor: pointer;
  background-image: url('../assets/docIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.docButton:hover {
  background-image: url('../assets/docIcon-hover.png');
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

.clicked {
  background-color: gray;
}

#tag {
  color: black;
  border: 1px solid gray;
  padding: 5px;
  margin: 0 2px;
}

.cardTable {
  display: flex;
  width: 100%;
}

.flex-container {
  display: flex;
  align-items: stretch;
  background-color: #f3f3f3;
  align-items: center;
}

.card-middle {
  background-color: #fff;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  flex-basis: 70%;
  padding: 16px;
}

.card-left {
  flex-basis: 15%;
  padding: 16px;
}
.card-right {
  flex-basis: 15%;
  padding: 16px;
}

.info-column {
  width: 50%;
}

.non-post {
  color: #a9a9a9;
  margin-top: -10%;
}

.chat-left {
  width: 70%;
  display: table-cell;
}

.chat-right {
  width: 10%;
  display: table-cell;
  margin-top: 40px;
}

.whiteBox {
  background-color: white;
  padding: 10px;
  border-radius: 0.3rem;
  min-height: 330px;
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
  content: '';
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
</style>
