<template>
  <div class="container">
    <img src="../../assets/check.png" alt="checkmark" />
    <div v-if="!isVerification" class="password">
      <h1>Password Reset Email Sent</h1>
      <p>
        An email has been sent to your university email with instructions on how
        to reset your password
      </p>
    </div>

    <div v-else class="verification">
      <h1>Verification Email Sent</h1>
      <p>A verification email has been sent to your school email</p>
    </div>
    <button @click="backToLogin" type="submit" class="signupbtn">Done</button>
  </div>
</template>

<script>
export default {
  props: ["isVerification"],

  methods: {
    backToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 100px;
  text-align: center;
}

h1 {
  color: #0fb9b1ff;
}

p {
  color: #535c68;
}

button {
  background-color: #0fb9b1ff;
  color: white;
  padding: 10px 20px;
  margin: 8px 0;
  border-radius: 10px;
  cursor: pointer;
  width: 200px;
  opacity: 0.9;
  font: 24px bold Arial, Helvetica, sans-serif;
}
</style>
