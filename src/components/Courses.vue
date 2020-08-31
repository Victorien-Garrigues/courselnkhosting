<template>
  <section class="menu background-body">
    <div v-if="!isFaculty" class="faculties">
      <!-- Lists all of the users courses -->
      <ul v-if="!isEditing && !isAdding" class="menu-list">
        <div class="row courseList">
          <div class="column listName">
            <p class="menu-label">Your Courses</p>
          </div>
          <!-- Edit Courses Button -->
          <div class="column listEdit">
            <button
              v-if="!isAdding && !isEditing"
              @click="(isEditing = true), (isCourse = true)"
              class="editButton is-danger"
            ></button>
          </div>

          <div class="void"></div>
        </div>

        <li v-for="course in user.courses" :key="course.id">
          <div style="display: flex;">
            <router-link
              @click.native="
                $store.commit('messageBoard/setCourse', course.course_id)
              "
              :to="{
                name: 'MessageBoard',
                params: { name: course.courseCode.replace(/\s/g, '') },
              }"
            >
              {{ course.courseCode }}
            </router-link>
            <p v-if="course.unreadPosts">...</p>
          </div>
        </li>
      </ul>

      <div style="width: 100%; height: 5px;"></div>

      <!-- Add Course Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="showCourses()"
        class="addButton is-primary"
      >
        ADD COURSE +
      </button>

      <!-- Lists All Courses For The User To Add -->
      <div v-if="isAdding">
        <p class="menu-label" style="margin: 10px;">Add a course</p>
        <input
          class="input"
          type="text"
          style="width: 150px; margin: 10px;"
          placeholder="Search Courses"
          v-model="searchTerm"
        />
        <div style="height: 200px; overflow: auto;">
          <!-- Displays the courses for the user to add -->
          <ul class="menu-list">
            <li v-for="course in filteredCourses" :key="course.id">
              <button class="plusButton" @click="addCourse(course)">
                {{ course.courseCode }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Create course -->
        <div v-if="!isCreating" style="padding: 15px;">
          <p>Don't see the course you're looking for?</p>
          <button @click="isCreating = true" class="createButton is-success">
            Create Course
          </button>
        </div>

        <!-- If the user is creating a course -->
        <div v-if="isCreating" style="padding: 15px;">
          <p>Create a new course by entering its course code</p>
          <input
            style="margin-bottom: 1em; width: 100px; margin:10px"
            v-model="courseCode"
            class="input is-focused"
            type="text"
            placeholder="AAAA 000"
          />
          <!-- Cancel button -->
          <button
            @click="isCreating = false"
            class="delButton2 is-danger"
          ></button>

          <p class="feedback">{{ this.feedback }}</p>

          <!-- Create course button -->
          <button @click="createCourse()" class="createButton is-success">
            Create Course
          </button>
        </div>
      </div>

      <!-- Lists All The Users Courses To Be Removed When Clicked -->
      <ul v-if="isEditing" class="menu-list">
        <p class="menu-label removeName">
          Remove a course from your class list
        </p>
        <li v-for="course in user.courses" :key="course.id">
          <button class="delButton" @click="removeCourse(course.course_id)">
            {{ course.courseCode }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Lists the user faculties -->
    <div v-if="!isCourse" class="courses">
      <ul
        style="margin-top: 2em ;"
        v-if="!isEditing && !isAdding"
        class="menu-list"
      >
        <div class="row courseList">
          <div class="column listName">
            <p class="menu-label">Your Faculties</p>
          </div>

          <!-- Edit Faculties Button -->
          <div class="column listEdit2">
            <button
              v-if="!isAdding && !isEditing"
              @click="(isEditing = true), (isFaculty = true)"
              class="editButton is-danger"
            ></button>
          </div>
          <div class="void"></div>
        </div>

        <li v-for="faculty in user.faculties" :key="faculty.id">
          <router-link
            @click.native="
              $store.commit('messageBoard/setCourse', faculty.faculty_id)
            "
            :to="{
              name: 'MessageBoard',
              params: { name: faculty.name.replace(/\s/g, '') },
            }"
            >{{ faculty.name }}</router-link
          >
        </li>
      </ul>

      <div style="width: 100%; height: 5px;"></div>

      <!-- Add Faculties Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="showFaculties()"
        class="addButton is-primary"
      >
        ADD FACULTY +
      </button>

      <!-- Lists All Faculties For The User To Add -->
      <div v-if="isAdding">
        <ul class="menu-list">
          <p class="menu-label" style="margin: 10px;">Add a faculty</p>
          <li v-for="faculty in allFaculties" :key="faculty.id">
            <button class="plusButton" @click="addFaculty(faculty)">
              {{ faculty.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Lists All The Users Faculties To Be Removed When Clicked -->
      <ul v-if="isEditing" class="menu-list">
        <p class="menu-label removeName">
          Remove a faculty from your university list
        </p>
        <li v-for="faculty in user.faculties" :key="faculty.id">
          <button
            style="margin-top: 0.5em;"
            class="delButton"
            @click="removeFaculty(faculty.faculty_id)"
          >
            {{ faculty.name }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Done Button -->
    <button
      style="margin-top: 2em;"
      v-if="isEditing || isAdding"
      @click="reset()"
      class="doneButton is-primary"
    >
      Done
    </button>

    <h3 class="feedback">{{ this.alreadyAddedMessage }}</h3>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import firebase from '@/firebase';
import db from '@/db';

export default {
  data: () => ({
    isEditing: false, //If the user is editing courses or faculties
    isAdding: false, //If the user is adding a course or faculty
    isCreating: false, //If user is creating a course or facultyss
    isFaculty: false, //If user is adding, or editing faculties
    isCourse: false, //If user is adding, or editing courses
    courseCode: '', //the coureCode of the course
    feedback: '', //If the user enters a course that already exitst is shows a message
    alreadyAddedMessage: '', //if the user has already added that course or faculty
    searchTerm: '',
  }),

  computed: {
    ...mapState('courses', ['allCourses']),
    ...mapState('faculties', ['allFaculties']),
    ...mapState('user', ['user']),

    filteredCourses() {
      if (this.searchTerm) {
        const regexp = new RegExp(this.searchTerm, 'gi');
        return this.allCourses.filter((course) =>
          course.courseCode.match(regexp)
        );
      }
      return this.allCourses;
    },
  },
  methods: {
    ...mapActions('courses', ['initAllCourses']),
    ...mapActions('faculties', ['initAllFaculties']),

    //Shows all courses from the users school
    async showCourses() {
      this.isCourse = true;
      this.isAdding = true;
      await this.initAllCourses(this.user.school_id);
    },

    //Shows all faculties from the users school
    async showFaculties() {
      this.isFaculty = true;
      this.isAdding = true;
      await this.initAllFaculties(this.user.school_id);
    },

    //Adds a course to the users courses array
    async addCourse(course) {
      console.log(course);
      const userCourses = this.user.courses;
      // updates courses locally
      for (const index in userCourses) {
        if (userCourses[index].course_id === course.id) {
          this.alreadyAddedMessage = 'You have already added this course';
          return;
        }
      }

      userCourses.push({
        courseCode: course.courseCode,
        course_id: course.id,
        unreadPosts: true,
        lastVisited: Date.now(),
      });

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(this.user.id)
        .update({
          courses: userCourses,
          course_ids: firebase.firestore.FieldValue.arrayUnion(course.id),
        })
        .then(() => {
          //Increments userCount of course
          db.collection('courses')
            .doc(course.id)
            .update({
              userCount: firebase.firestore.FieldValue.increment(1),
            });

          // Add a post saying that a user has joined the group
          db.collection('posts').add({
            content:
              this.user.firstName +
              ' ' +
              this.user.lastName +
              ' joined the group',
            files: [],
            course_id: course.id,
            createdAt: Date.now(),
          });
        });

      this.$store.commit('user/setCourses', userCourses);

      this.reset();
    },

    async removeCourse(course_id) {
      const userCourses = this.user.courses;
      //Goes through the users courses and deletes the course the user selected
      for (const index in userCourses) {
        if (userCourses[index].course_id == course_id) {
          userCourses.splice(index, 1);
        }
      }
      //Updates those changes in firebase
      db.collection('users')
        .doc(this.user.id)
        .update({
          courses: userCourses,
          course_ids: firebase.firestore.FieldValue.arrayRemove(course_id),
        });
      this.$store.commit('user/setCourses', userCourses);
      this.reset();
      //Subtracts 1 from courses user count
      db.collection('courses')
        .doc(course_id)
        .update({
          userCount: firebase.firestore.FieldValue.increment(-1),
        });
    },

    //Adds a faculty to the users faculties array
    async addFaculty(faculty) {
      console.log(faculty, 'faculty');
      const userFaculties = this.user.faculties;
      // updates courses locally
      for (const index in userFaculties) {
        if (userFaculties[index].course_id === faculty.id) {
          this.alreadyAddedMessage = 'You have already added this course';
          return;
        }
      }

      userFaculties.push({
        name: faculty.name,
        faculty_id: faculty.id,
        unreadPosts: true,
        lastVisited: Date.now(),
      });

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(this.user.id)
        .update({
          faculties: userFaculties,
        })
        .then(() => {
          //Increments userCount of course
          db.collection('faculties')
            .doc(faculty.id)
            .update({
              userCount: firebase.firestore.FieldValue.increment(1),
            });
        });

      this.$store.commit('user/setFaculties', userFaculties);

      this.reset();
    },

    //Removes a course to the users courses array
    async removeFaculty(faculty_id) {
      const userFaculties = this.user.faculties;
      //Goes through the users courses and deletes the course the user selected
      for (const index in userFaculties) {
        if (userFaculties[index].faculty_id == faculty_id) {
          userFaculties.splice(index, 1);
        }
      }
      //Updates those changes in firebase
      db.collection('users')
        .doc(this.user.id)
        .update({
          faculties: userFaculties,
        });
      this.$store.commit('user/setFaculties', userFaculties);
      this.reset();
      //Subtracts 1 from courses user count
      db.collection('faculties')
        .doc(faculty_id)
        .update({
          userCount: firebase.firestore.FieldValue.increment(-1),
        });
    },

    // Creates a course
    async createCourse() {
      if (this.courseCode.length > 3) {
        for (const course in this.allCourses) {
          // If the course already exists
          if (
            this.allCourses[course].courseCode.toLowerCase() ===
            this.courseCode.toLowerCase()
          ) {
            this.feedback = 'The course already exists';
            return;
          }
        }

        const course = {
          courseCode: this.courseCode,
          school_id: this.user.school_id,
        };

        await db.collection('courses').add({
          courseCode: course.courseCode,
          school_id: course.school_id,
        });
        this.addCourse(course);
      }
      this.feedback = '';
      this.reset();
    },

    // Resets data
    reset() {
      this.feedback = '';
      this.alreadyAddedMessage = '';
      this.isEditing = false;
      this.isAdding = false;
      this.isCourse = false;
      this.isFaculty = false;
    },
  },
};
</script>

<style>
.feedback {
  color: red;
  text-align: left;
}

.background-body {
  height: 100%;
  background-color: #f3f3f3;
}

/* EDIT BUTTON */
.editButton {
  margin: 3px;
  padding: 10px 10px;
  cursor: pointer;
  background-color: #f3f3f3;
  background-image: url('../assets/editIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.editButton:hover {
  background-image: url('../assets/editIcon-hover.png');
}

/* ADD BUTTON */
.addButton {
  background-color: #edf2f7;
  border: none;
  color: #555555;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.addButton:hover {
  background-color: #e2e6eb;
}

/* DELETE BUTTON */
.delButton {
  margin: 3px;
  padding: 10px 10px;
  padding-right: 50px;
  cursor: pointer;
  background-color: #edf2f7;
  border: none;
  color: #555555;
  font-size: 16px;
}

.delButton:hover {
  background-image: url('../assets/courseDelIcon.png');
  background-repeat: no-repeat;
  background-position: 80% 45%;
}

/* DONE BUTTON */
.doneButton {
  background-color: #edf2f7;
  border: none;
  color: #555555;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 10px;
  cursor: pointer;
}

.doneButton:hover {
  background-color: #e2e6eb;
}

/* PLUS BUTTON */
.plusButton {
  background-color: #edf2f7;
  border: none;
  color: #555555;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 10px 10px;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
}

.plusButton:hover {
  background-color: #e2e6eb;
}

.courseList {
  width: 20%;
}

.void {
  width: 60%;
  height: 39px;
}

.listName {
  width: 150px;
}

.removeName {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: -10px;
}

.listEdit {
  width: 20%;
  margin-left: 110px;
  margin-top: -48px;
}

.listEdit2 {
  width: 10%;
  margin-left: 118px;
  margin-top: -48px;
}

/* CREATE BUTTON */
.createButton {
  margin: 3px;
  padding: 10px 10px;
  padding-right: 50px;
  cursor: pointer;
  background-color: #edf2f7;
  border: none;
  color: #555555;
  font-size: 16px;
  background-image: url('../assets/createIcon-hover.png');
  background-repeat: no-repeat;
  background-position: 95% 50%;
}

.createButton:hover {
  background-image: url('../assets/createIcon.png');
  background-repeat: no-repeat;
  background-position: 95% 50%;
  background-color: #e2e6eb;
}

/* DELETE BUTTON 2 */
.delButton2 {
  margin: 3px;
  margin-top: 10px;
  padding: 17px 17px;
  cursor: pointer;
  background-color: #edf2f7;
  background-image: url('../assets/courseDelIcon.png');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.delButton2:hover {
  background-color: #e2e6eb;
}
</style>
