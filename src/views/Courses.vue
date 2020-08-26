<template>
  <aside class="menu">
    <p class="menu-label">
      Courses
    </p>

    <!-- Lists all of the users courses -->
    <ul v-if="!isEditing && !isAdding" class="menu-list">
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
      @click="isEditing = true"
      class="button is-danger"
    >
      Edit Courses
    </button>

    <!-- Lists All Courses For The User To Add -->
    <ul v-if="isAdding" class="menu-list">
      <p>Click On Class To Add</p>
      <li v-for="course in allCourses" :key="course.id">
        <button class="button" @click="addCourse(course)">
          {{ course.courseCode }}
        </button>
      </li>
    </ul>

    <!-- Lists All The Users Courses To Be Removed When Clicked -->
    <ul v-if="isEditing" class="menu-list">
      <p>Click On Class To Delete</p>
      <li v-for="course in courses" :key="course.id">
        <button class="button" @click="removeCourse(course.course_id)">
          {{ course.courseCode }}
        </button>
      </li>
    </ul>
    <!-- Done Button -->
    <button
      v-if="isEditing || isAdding"
      @click="(isEditing = false), (isAdding = false)"
      class="button is-primary"
    >
      Done
    </button>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import firebase from '@/firebase';
import db from '@/db';

export default {
  data: () => ({
    isEditing: false, //If the user isEditing Classes
    isAdding: false, //If the user isAdding a class
  }),
  mounted() {
    this.initCourses(); //Gets all the Users courses
  },
  computed: mapState('courses', ['courses', 'allCourses']),
  methods: {
    ...mapActions('courses', ['initCourses', 'initAllCourses']),

    //Shows all courses from the users school
    async showCourses() {
      this.isAdding = true;
      const userDoc = await this.getUserDoc();
      await this.initAllCourses(userDoc.school_id);
    },

    //returns the document from the users collection of the current user
    async getUserDoc() {
      var data = null;
      await db
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          data = doc.data();
        });
      return data;
    },

    //Adds a course to the users courses array
    async addCourse(course) {
      //Gets userDoc and updates courses locally
      const userDoc = await this.getUserDoc();
      const userCourses = userDoc.courses;
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
    },

    //Removes a course to the users courses array
    async removeCourse(course_id) {
      //Gets userDoc
      const userDoc = await this.getUserDoc();
      const userCourses = userDoc.courses;
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
    },
  },
};
</script>
