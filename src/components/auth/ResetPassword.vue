<template>
  <div class="signup">
    <div class="background"></div>
    <div class="container">
      <form @submit.prevent="resetPassword">
        <img src="../../assets/logo.png" alt="" />
        <h1 style="margin: 10px 0;">Forgot Password?</h1>
        <p style="margin-bottom: 22px;">
          Enter your accounts email address below to receive password reset
          instructions
        </p>
        <input
          v-model="email"
          type="text"
          placeholder="University Email"
          name="email"
          required
        />
        <p v-if="feedback" class="feedback">{{ feedback }}</p>

        <div class="clearfix">
          <button type="submit" class="signupbtn">Reset Password</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signup",
  data() {
    return {
      email: null,
      feedback: null,
    };
  },
  methods: {
    resetPassword() {
      var auth = firebase.auth();
      var emailAddress = this.email;

      auth
        .sendPasswordResetEmail(emailAddress)
        .then(() => {
          this.$router.push({ name: "PasswordEmailSent" });
        })
        .catch(() => {
          this.feedback = "The email entered is not valid";
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

p {
  color: #535c68;
}
h1 {
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
