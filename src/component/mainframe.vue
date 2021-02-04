<template>
  <v-app>
    <master @clicknavi="clicknavi" @login="login" @logout="logout"></master>
    <index ref="index"></index>
  </v-app>
</template>
<script>
//import {TOOLSMixin} from "../plugins/tools.1.0.1";
import master from "./master.vue";
import index from "./index.vue";
import { mapMutations, mapState } from "vuex";
export default {
  //mixins:[TOOLSMixin],
  data: function () {
    return {
      userinfo: true,
    };
  },
  computed: {
    ...mapState(["isguest", "ischief", "loginuser", "activeid"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
    loaduser: function (dosomething) {
      var THIS = this;
      THIS._dosomething = dosomething;
      this.axios
        .get(this.$store.state.absURL + "api/Ldap/info")
        .then(function (response) {
          THIS.setUser(response.data);
          THIS._dosomething();
        })
        .catch(function (error) {})
        .then(function () {});
    },
    openlogindialog: function () {
      this.$refs.loginb.logindialog = true;
    },
    getalldirectorys: function (val) {
      this.$refs.index.getalldirectorys(val);
    },
    clicknavi: function () {
      this.$refs.index.switchdrawer();
    },
    login: function () {
      var THIS = this;
      this.loaduser(function () {
        if (THIS.$store.state.loginuser.isadmin) THIS.getalldirectorys(0);
        else THIS.getalldirectorys(-1);
      });
    },
    logout: function () {
      var THIS = this;
      this.loaduser(function () {
        THIS.getalldirectorys(-1);
      });
    },
  },
  watch: {},
  components: {
    master,
    index,
  },
  created: function () {
    this.loaduser(function () {
      this.getalldirectorys(this.activeid);
    });
  },
};
</script>
