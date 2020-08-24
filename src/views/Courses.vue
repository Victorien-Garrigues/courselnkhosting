<template>
  <aside class="menu">
    <p class="menu-label">
      Courses
    </p>
    <ul class="menu-list">
      <li v-for="course in courses" :key="course.id">
        <router-link
          :to="{ name: 'MessageBoard', params: { name: course.course_id } }"
        >
          {{ course.courseCode }}
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  mounted() {
    this.initCourses();
  },
  computed: mapState('courses', ['courses']),
  methods: mapActions('courses', ['initCourses']),
};
</script>
