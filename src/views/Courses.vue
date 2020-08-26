<template>
  <section class="menu">
    <div v-if="!isFaculty" class="faculties">
      <!-- Lists all of the users courses -->
      <ul v-if="!isEditing && !isAdding" class="menu-list">
        <p class="menu-label">
          Your Courses
        </p>
        <li v-for="course in courses" :key="course.id">
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
        </li>
      </ul>

      <!-- Add Course Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="showCourses()"
        class="button is-primary"
      >
        Add Course
      </button>

      <!-- Edit Courses Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="(isEditing = true), (isCourse = true)"
        class="button is-danger"
      >
        Edit Courses
      </button>

      <!-- Lists All Courses For The User To Add -->
      <div v-if="isAdding">
        <input
          class="input"
          type="text"
          placeholder="Search Courses"
          v-model="searchTerm"
        />

        <div style="margin-bottom: 2em;">
          <p>Don't see the course you're looking for?</p>
          <button
            v-if="!isCreating"
            @click="isCreating = true"
            class="button is-success"
          >
            Create Course
          </button>
        </div>
        <div style="margin: 2em 0;" v-if="isCreating">
          <h3>Course Code</h3>
          <input
            style="margin-bottom: 1em;"
            v-model="courseCode"
            class="input is-focused"
            type="text"
            placeholder="Enter Course Code"
          />
          <p class="feedback">{{ this.feedback }}</p>
          <button @click="createCourse()" class="button is-success">
            Create Course
          </button>
          <button @click="isCreating = false" class="button is-danger">
            Cancel
          </button>
        </div>
        <ul class="menu-list">
          <p>Click On Course To Add</p>
          <li v-for="course in filteredCourses" :key="course.id">
            <button
              style="margin-top: 0.5em;"
              class="button"
              @click="addCourse(course)"
            >
              {{ course.courseCode }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Lists All The Users Courses To Be Removed When Clicked -->
      <ul v-if="isEditing" class="menu-list">
        <p>Click On Class To Delete</p>
        <li v-for="course in courses" :key="course.id">
          <button
            style="margin-top: 0.5em;"
            class="button"
            @click="removeCourse(course.course_id)"
          >
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
        <p class="menu-label">
          Your Faculties
        </p>
        <li v-for="faculty in faculties" :key="faculty.id">
          <router-link
            @click.native="
              $store.commit('messageBoard/setCourse', faculty.faculty_id)
            "
            :to="{
              name: 'MessageBoard',
              params: { name: faculty.name.replace(/\s/g, '') },
            }"
          >
            {{ faculty.name }}
          </router-link>
        </li>
      </ul>
      <!-- Add Faculties Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="showFaculties()"
        class="button is-primary"
      >
        Add Faculty
      </button>

      <!-- Edit Faculties Button -->
      <button
        v-if="!isAdding && !isEditing"
        @click="(isEditing = true), (isFaculty = true)"
        class="button is-danger"
      >
        Edit Faculty
      </button>

      <!-- Lists All Faculties For The User To Add -->
      <div v-if="isAdding">
        <ul class="menu-list">
          <p>Click On Faculty To Add</p>
          <li v-for="faculty in allFaculties" :key="faculty.id">
            <button
              style="margin-top: 0.5em;"
              class="button"
              @click="addFaculty(faculty)"
            >
              {{ faculty.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Lists All The Users Faculties To Be Removed When Clicked -->
      <ul v-if="isEditing" class="menu-list">
        <p>Click On Faculty To Delete</p>
        <li v-for="faculty in faculties" :key="faculty.id">
          <button
            style="margin-top: 0.5em;"
            class="button"
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
      class="button is-primary"
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
let uuid = require('uuid');

export default {
  data: () => ({
    isEditing: false, //If the user is editing courses or faculties
    isAdding: false, //If the user is adding a course or faculty
    isCreating: false, //If user is creating a course or facultyss
    isFaculty: false, //If user is adding, or editing faculties
    isCourse: false, //If user is adding, or editing courses

    userDoc: null,
    courseCode: '',
    feedback: '',
    alreadyAddedMessage: '',
    searchTerm: '',
  }),
  mounted() {
    this.initCourses(); //Gets all the users courses
    this.initFaculties(); //Gets all the users faculties
  },
  computed: {
    ...mapState('courses', ['courses', 'allCourses']),
    ...mapState('faculties', ['faculties', 'allFaculties']),

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
    ...mapActions('courses', ['initCourses', 'initAllCourses']),
    ...mapActions('faculties', ['initFaculties', 'initAllFaculties']),

    //Shows all courses from the users school
    async showCourses() {
      this.isCourse = true;
      this.isAdding = true;
      if (!this.allCourses[0]) {
        if (!this.userDoc) {
          await this.getUserDoc();
        }
        await this.initAllCourses(this.userDoc.school_id);
      }
    },

    async showFaculties() {
      this.isFaculty = true;
      this.isAdding = true;
      if (!this.allFaculties[0]) {
        if (!this.userDoc) {
          await this.getUserDoc();
        }
        await this.initAllFaculties(this.userDoc.school_id);
      }
    },
    //returns the document from the users collection of the current user
    async getUserDoc() {
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          this.userDoc = doc.data();
        });
    },

    //Adds a course to the users courses array
    async addCourse(course) {
      if (!this.userDoc) {
        await this.getUserDoc();
      }
      const userCourses = await this.userDoc.courses;
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
      });

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          courses: userCourses,
        });
      await this.initCourses();
      this.reset();
    },

    //Adds a faculty to the users faculties array
    async addFaculty(faculty) {
      if (!this.userDoc) {
        await this.getUserDoc();
      }
      const userFaculties = await this.userDoc.faculties;
      // updates courses locally
      for (const index in userFaculties) {
        if (userFaculties[index].faculty_id === faculty.id) {
          this.alreadyAddedMessage = 'You have already added this faculty';
          return;
        }
      }
      userFaculties.push({
        name: faculty.name,
        faculty_id: faculty.id,
      });

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          faculties: userFaculties,
        });
      await this.initFaculties();
      this.reset();
    },

    //Removes a course to the users courses array
    async removeCourse(course_id) {
      if (!this.userDoc) {
        await this.getUserDoc();
      }
      const userCourses = await this.userDoc.courses;
      //Goes through the users courses and deletes the course the user selected
      for (const index in userCourses) {
        if (userCourses[index].course_id == course_id) {
          userCourses.splice(index, 1);
        }
      }

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          courses: userCourses,
        });

      await this.initCourses();
      this.reset();
    },

    //Removes a course to the users courses array
    async removeFaculty(faculty_id) {
      if (!this.userDoc) {
        await this.getUserDoc();
      }
      const userFaculties = await this.userDoc.faculties;
      //Goes through the users courses and deletes the course the user selected
      for (const index in userFaculties) {
        if (userFaculties[index].faculty_id == faculty_id) {
          userFaculties.splice(index, 1);
        }
      }

      //Updates those changes in firebase
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          faculties: userFaculties,
        });

      await this.initFaculties();
      this.reset();
    },
    async createCourse() {
      if (!this.userDoc) {
        await this.getUserDoc();
      }

      if (this.courseCode.length > 3) {
        for (const course in this.allCourses) {
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
          school_id: this.userDoc.school_id,
          id: uuid.v1(),
        };

        await db
          .collection('courses')
          .doc(course.id)
          .set({
            courseCode: course.courseCode,
            school_id: course.school_id,
          });
        this.addCourse(course);
      }
      this.feedback = '';
      this.reset();
    },
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
</style>
