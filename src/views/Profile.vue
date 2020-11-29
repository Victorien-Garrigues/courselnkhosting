<template>
  <section class="body-background">
    <!-- start of navbar design -->
    <div class="navbar">
      <!-- brand design -->
      <div class="flexNav">
        <a href="#" class="flexLogo">
          <img
            src="@/assets/mainLogo.png"
            width="237"
            height="49"
            alt="main page logo"
          />
        </a>
      </div>

      <!--p>{{ this.userCount }} Members</p-->

      <!-- profile design -->
      <div class="flexNav">
        <router-link
          class="navInfo"
          :to="{
            name: 'Login',
          }"
          @click="logout"
        ></router-link>

        <router-link
          class="navProfile"
          :to="{
            name: 'Profile',
          }"
          @click="profile"
        ></router-link>

        <!--div class="shrink">
            <a class="navProfile" href="#popup1"></a>
          </div-->

        <!-- profile popup 
          <div id="popup1" class="overlay">
            <div class="popup">
              <div class="delProfile">
                <a class="navProfile" href="#"></a>
              </div>

              <a class="close" href="#">&times;</a?

              <div class="content">
                <img
                  src="../assets/profileIcon.png"
                  loading="lazy"
                  width="54"
                  alt="profile pic"
                />
                <h5>NAME LASTNAME</h5>
              </div>
            </div>
          </div-->

        <!-- :to="{
              name: 'Profile',
            }" -->
      </div>
    </div>
    <!-- end of navbar design -->

    <!-- two columns (for side menu) -->
    <div class="row">
      <div class="column" style="width: 20%">
        <Courses />
        <!-- side menu -->
      </div>
      <div class="column" style="width: 80%">
        <div style="display: flex">
          <div class="profileImage">
            <img :src="this.profile.profileImage" alt="profile Image" />
            <vue-dropzone
              ref="imgDropZone"
              id="profile-pic"
              :include-styling="false"
              :options="dropzoneOptions"
              @vdropzone-complete="setImage"
            ></vue-dropzone>
          </div>

          <div class="info">
            <div style="display: flex">
              <p v-if="this.profile && !isEditingName" class="nameDesign">
                Name: {{ this.profile.firstName }} {{ this.profile.lastName }}
              </p>
              <button
                v-if="!isEditingName"
                @click="isEditingName = true"
                class="editButton3"
              ></button>
            </div>

            <div v-if="isEditingName" class="editing" style="display: flex">
              <input type="text" id="fname" name="fname" v-model="firstName" />
              <input type="text" id="lname" name="lname" v-model="lastName" />

              <button @click="saveName()">Save</button>
              <p class="feedback">{{ this.feedback }}</p>
            </div>

            <p v-if="this.email">Email: {{ this.email }}</p>
            <p v-if="this.school">School: {{ this.school }}</p>
            <button @click.prevent="resetPassword()">Change Password</button>
            <p v-if="changedPassword">
              An email has been sent to your university email with instructions
              on how to change your password
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import db from "@/db";
import firebase from "@/firebase";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import Courses from "@/components/Courses";

export default {
  components: {
    vueDropzone: vue2Dropzone,
    Courses,
  },
  data: () => ({
    profile: null,
    email: null,
    school: null,
    isEditingName: false,
    changedPassword: false,
    firstName: "",
    lastName: "",
    feedback: "",

    //Drop zone options
    dropzoneOptions: {
      url: "https://httpbin.org/post",
      thumbnailWidth: 150,
      thumbnailHeight: 150,
      maxFilesize: 5,
      maxFiles: 10,
      duplicateCheck: true,
      addRemoveLinks: true,
      dictDefaultMessage: "Edit Image",
      previewsContainer: false,
    },
  }),
  mounted() {
    this.initProfile(); //Gets all the users courses
  },

  methods: {
    async initProfile() {
      await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((doc) => {
          this.profile = doc.data();
          this.firstName = doc.data().firstName;
          this.lastName = doc.data().lastName;

          db.collection("schools")
            .doc(doc.data().school_id)
            .get()
            .then((doc) => {
              this.school = doc.data().name;
            });
        });
      await console.log(this.profile);
      this.email = firebase.auth().currentUser.email;
    },
    async saveName() {
      console.log(this.firstName);
      console.log(this.lastName);

      if (this.firstName.length > 0 && this.lastName.length > 0) {
        await db
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            firstName: this.firstName,
            lastName: this.lastName,
          });
      } else if (this.profile.firstName.length == 0) {
        this.feedback = "You must enter a first name";
      } else {
        this.feedback = "You must enter a last name";
      }
    },

    async setImage(file) {
      const storageRef = firebase.storage().ref();

      // If is an image
      if (file["type"] === "image/jpeg" || file["type"] === "image/png") {
        const fileRef = storageRef.child(`images/${file.name}.png`);
        await fileRef.put(file);
        const downloadURL = await fileRef.getDownloadURL();
        await db
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            profileImage: downloadURL,
          });

        this.profile.profileImage = downloadURL;
      }
    },
    resetPassword() {
      var auth = firebase.auth();
      var emailAddress = this.email;

      auth
        .sendPasswordResetEmail(emailAddress)
        .then(() => {
          this.changedPassword = true;
        })
        .catch(() => {
          this.feedback = "The email entered is not valid";
        });
    },
  },
};
</script>

<style>
.body-background {
  width: 100%;
  min-height: 100vh;
  background-color: #f3f3f3;
}

#profile-pic {
  width: 130px;
  height: 50px;
  cursor: pointer;
  background: url("../assets/editProfile.png") no-repeat;
  background-position: 50% 50%;
}

#profile-pic .dz-success-mark,
.dz-error-mark,
.dz-remove {
  display: none;
}

#profile-pic .dz-filename,
.dz-size {
  display: none;
}

.feedback {
  color: red;
}

/* EDIT BUTTON */
.editButton3 {
  margin: 3px;
  padding: 10px 10px;
  cursor: pointer;
  background-color: #edf2f7;
  background-image: url("../assets/editIcon.png");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: none;
  border-radius: 50%;
}

.editButton3:hover {
  background-image: url("../assets/editIcon-hover.png");
}

.nameDesign {
  color: rgb(70, 70, 70);
}
</style>
