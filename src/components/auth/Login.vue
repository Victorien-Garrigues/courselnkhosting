<template>
  <div class="signup">
    <div class="background"></div>
    <div class="container">
      <form @submit.prevent="login">
        <img src="../../assets/logo.png" alt="simple logo" />
        <h1>Welcome to CourseLnk</h1>
        <input
          v-model="email"
          type="text"
          placeholder="University Email"
          name="email"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          name="psw"
          required
        />
        <p v-if="feedback" class="feedback">{{ feedback }}</p>

        <p style="text-align: left">
          <router-link class="forgotPassword" :to="{ name: 'Password' }"
            >Forgot password?</router-link
          >
        </p>

        <div class="clearfix">
          <button type="submit" class="signupbtn">Login</button>
        </div>

        <p>
          Not on CoursLnk yet?
          <router-link
            class="noUnderline"
            style="color: dodgerblue"
            :to="{ name: 'Signup' }"
            >Signup</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase";
import db from "@/db";
import router from "@/router/index.js";
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null,
      course: null,
    };
  },
  methods: {
    //Logs the user in if the correct email and password were entered
    async login() {
      if (this.email && this.password) {
        const user = firebase.auth().currentUser;
        this.feedback = null;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            if (user.emailVerified) {
              this.setInitialCourse(user.uid).then(() => {
                if (this.course) {
                  this.$store.commit(
                    "messageBoard/setCourse",
                    this.course.course_id
                  );

                  router.push({
                    name: "MessageBoard",
                    params: { name: this.course.courseCode.replace(/\s/g, "") },
                  });
                } else {
                  this.$router.push({ name: "MessageBoard" });
                }
              });
            } else {
              this.feedback = "The email or password is incorrect";
            }
          })
          .catch(() => {
            this.feedback = "The email or password is incorrect";
          });
      } else {
        this.feedback = "Please Fill In Both Fields";
      }
    },

    async setInitialCourse(id) {
      await db
        .collection("users")
        .doc(id)
        .get()
        .then((doc) => {
          this.course = doc.data().courses[0];
        });
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 2px;
  padding: 0;
}
.signup {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  background: url("../../assets/authBackground.png") no-repeat left/contain
    fixed;
}
.background {
  width: 50vh;
  height: 100vh;
}
.forgotPassword {
  text-decoration: none;
  color: #535c68;
}
.noUnderline {
  text-decoration: none;
}
.feedback {
  color: red;
  margin-top: -15px;
  text-align: left;
}
/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: -7px 0 22px 0;
  display: inline-block;
  border: 2px solid rgb(189, 195, 199);
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 14px;
}
p {
  color: rgb(83, 92, 104);
}
h1 {
  margin-bottom: 20px;
  color: #0fb9b1ff;
}
input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}
hr {
  border: 2px solid #f1f1f1;
  margin-bottom: 25px;
}
/* Set a style for all buttons */
button {
  background-color: rgb(15, 185, 177);
  color: white;
  padding: 10px 20px;
  margin: 8px 0;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
  font: 24px bold Arial, Helvetica, sans-serif;
}
button:hover {
  opacity: 1;
}
/* Add padding to container elements */
.container {
  margin: auto;
  margin-left: 400px;
  max-width: 400px;
  padding: 16px;
  text-align: center;
}
/* Clear floats */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.select-css {
  font-size: 14px;
  width: 100%;
  padding: 15px;
  margin: -10px 0 22px 0;
  display: inline-block;
  border: 2px solid #bdc3c7;
  background: #f9f9f9;
  border-radius: 5px;
  line-height: 1.3;
  appearance: none;
  background-image: url("../../assets/dropdown.png"),
    linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
/* Hover style */
.select-css:hover {
  border-color: #888;
}
.select-css option {
  font-weight: normal;
}
body {
  margin: 2rem;
}
/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {
  .cancelbtn,
  .signupbtn {
    width: 100%;
  }
}
</style>
