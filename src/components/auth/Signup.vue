<template>
  <div class="signup">
    <div class="background"></div>
    <div class="container">
      <form @submit.prevent="signup">
        <img src="../../assets/logo.png" alt />
        <h1>Sign Up</h1>
        <p style="margin-bottom: 22px">
          Interact with students in your classes for free
        </p>
        <select v-model="university" class="select-css">
          <option disabled selected="selected" value="0">
            Select University...
          </option>
          <option
            v-for="(school, index) in schools"
            :key="index"
            :value="school.id"
          >
            {{ school.data().name }}
          </option>
        </select>
        <input
          v-model="email"
          type="text"
          placeholder="University Email"
          name="email"
          required
        />

        <div class="name" style="display: flex">
          <input
            style="margin-right: 5px"
            v-model="firstName"
            type="text"
            placeholder="First name"
            name="name"
            required
          />
          <input
            v-model="lastName"
            type="text"
            placeholder="Last name"
            name="name"
            required
          />
        </div>

        <input
          v-model="password"
          type="password"
          placeholder="Create Password"
          name="psw"
          required
        />

        <p v-if="feedback" class="feedback">{{ feedback }}</p>

        <p>
          By signing up you agree to our
          <a href="#" style="color: dodgerblue">Terms & Privacy</a>.
        </p>

        <div class="clearfix">
          <button type="submit" class="signupbtn">Create Account</button>
        </div>

        <p>
          Already have an account?
          <router-link
            class="noUnderline"
            style="color: dodgerblue"
            :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/db";
import router from "@/router/index";
export default {
  name: "Signup",
  data: () => ({
    schools: [],
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    university: 0,
    feedback: null,
  }),
  mounted() {
    this.getSchools();
  },
  methods: {
    //Gets list of all schools
    async getSchools() {
      var tempSchools = [];
      await db
        .collection("schools")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            tempSchools.push(doc);
          });
        });
      this.schools = tempSchools;
    },

    //Signs the user up
    signup() {
      if (
        this.firstName &&
        this.lastName &&
        this.email &&
        this.password &&
        this.university != 0
      ) {
        //If a valid university email was entered
        if (
          (this.university == "pOFdIKe2KVcQ8IbEl6sw" &&
            this.email.endsWith("@uwo.ca")) ||
          (this.university == "5Uo24jSg4nGg3sVOzeec" &&
            this.email.endsWith("@mail.mcgill.ca"))
        ) {
          this.feedback = null;
          firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((cred) => {
              firebase
                .auth()
                .currentUser.sendEmailVerification()
                .then(
                  function () {
                    router.push("/verification-email-sent");
                  },
                  function (error) {
                    console.log(error.message);
                  }
                );
              db.collection("users").doc(cred.user.uid).set({
                firstName: this.firstName,
                lastName: this.lastName,
                school_id: this.university,
                courses: [],
                faculties: [],
                course_ids: [],
                profileImage:
                  "https://firebasestorage.googleapis.com/v0/b/courselnk.appspot.com/o/profileIcon.png?alt=media&token=3aca529c-14f9-45fe-91b8-d01a4d2ad1ed",
              });
            })
            .catch((err) => {
              this.feedback = err.message;
            });
        } else {
          this.feedback = "Please enter correct university email";
        }
      } else {
        this.feedback = "You must enter all fields";
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
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
.noUnderline {
  text-decoration: none;
}
.background {
  width: 50vh;
  height: 100vh;
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
  border: 2px solid #bdc3c7;
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 14px;
}
h1 {
  color: #0fb9b1ff;
}
p {
  margin: 5px;
  color: #535c68;
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
  background-color: #0fb9b1ff;
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
