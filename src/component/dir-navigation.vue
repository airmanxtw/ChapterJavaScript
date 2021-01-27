<template>
  <v-navigation-drawer app v-model="drawer" width="300">
    <v-text-field
      class="ma-2"
      outlined
      label="搜尋檔案"
      append-icon="mdi-magnify"
      @keydown="searchkeydown"
      v-model="keyword"
      hint="輸入檔名、說明及關鍵字,按下Enter鍵後進行搜尋"
    >
    </v-text-field>
    <search-panel ref="searchp"></search-panel>
    <v-treeview
      :class="{ 'mt-n8': true, 'mb-16': ismobile }"
      transition
      activatable
      dense
      :items="items"
      :active.sync="active"
      :open.sync="openitems"
    >
      <template v-slot:prepend="{ open, active }">
        <v-icon>
          {{ open || active ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
      </template>
    </v-treeview>
    <v-divider v-if="ismobile" class="mb-8"></v-divider>
  </v-navigation-drawer>
</template>
<script>
export default {
  data: function () {
    return {
      items: [],
      active: [],
      openitems: [],
      keyword: "",
      drawer: true,
    };
  },
  methods: {
    searchkeydown: function (keyboard) {
      if (keyboard.key == "Enter" && this.keyword.trim().length > 0) {
        this.$refs.searchp.searchdialog = true;
        this.$refs.searchp.keyword = this.keyword;
        this.$refs.searchp.loading = true;
        this.$refs.searchp.searchstart();
      }
    },
  },
  computed: {
    ismobile: function () {
      return this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
        ? true
        : false;
    },
  },
  watch: {
    active: function (newQuestion, oldQuestion) {
      if (
        newQuestion.length > 0 &&
        ((oldQuestion.length > 0 && newQuestion[0] != oldQuestion[0]) ||
          oldQuestion.length == 0)
      ) {
        this.$emit("changeactiveid", newQuestion[0]);
      }
    },
  },
  created: function () {
    var n = this.$vuetify.breakpoint.name;
    if (n == "xs" || n == "sm") this.drawer = false;
  },
  components: {
    "search-panel": function (resolve) {
      require(["./search-panel.vue"], resolve);
    },
  },
};
</script>
