<template>
  <v-app-bar color="brown lighten-5" app>
    <v-app-bar-nav-icon v-if="userinfo">
      <v-btn fab depressed small @click="clicknavi">
        <v-icon dark> mdi-menu </v-icon>
      </v-btn>
    </v-app-bar-nav-icon>

    <v-toolbar-title>行政章則彙編平台</v-toolbar-title>
    <v-spacer></v-spacer>
    <template v-if="userinfo">
      <v-chip class="ma-1" label>
        <v-icon left> mdi-account-circle-outline </v-icon>
        <template v-if="loginuser.user_id == 'anonymous'">
          {{ loginuser.user_name }}
        </template>
        <template v-else> {{ loginuser.user_name }}({{ loginuser.user_id }}) </template>
      </v-chip>
      <config-menu v-if="$store.getters.ischief"></config-menu>
      <login-button ref="loginb" @login="login" v-if="isguest"></login-button>
      <logout-button @logout="logout" v-if="!isguest"></logout-button>
    </template>
    <!-- <v-btn @@click="openlogindialog">test</v-btn> -->
  </v-app-bar>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  methods: {
    login: function () {
      this.$emit("login");
    },
    logout: function () {
      this.$emit("logout");
    },
    clicknavi: function () {
      this.$emit("clicknavi");
    },
  },
  computed: {
    ...mapState(["isguest", "userinfo", "loginuser"]),
    ...mapGetters(["isguest"]),
  },
  components: {
    "login-button": function (resolve) {
      require(["./login-button.vue"], resolve);
    },
    "logout-button": function (resolve) {
      require(["./logout-button.vue"], resolve);
    },
    "config-menu": function (resolve) {
      require(["./config-menu.vue"], resolve);
    },
  },
};
</script>
