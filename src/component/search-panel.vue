<template>
  <v-dialog v-model="searchdialog" width="600" scrollable>
    <v-card :loading="loading" :disabled="loading" max-height="500">
      <v-card-title>
        <v-text-field
          class="ma-2"
          outlined
          label="搜尋檔案"
          append-icon="mdi-magnify"
          @keydown="searchkeydown"
          v-model="keyword"
          hint="檔名、說明及關鍵字,按下Enter鍵搜尋"
        >
        </v-text-field>
      </v-card-title>
      <v-card-text>
        <div v-if="files.length > 0">搜尋結果:</div>
        <v-list-item
          v-for="file in files"
          :key="file.id"
          @click.stop="fileitemclick(file.id)"
          two-line
        >
          <v-list-item-icon>
            <v-icon v-text="file.icon" large></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="text-md-body-1"
              v-text="file.name"
            ></v-list-item-title>
            <v-list-item-subtitle>{{ file.Desc }}</v-list-item-subtitle>
            <v-list-item-subtitle>目錄:{{ file.path }}</v-list-item-subtitle>
          </v-list-item-content>
          <file-share
            :url="absURL() + 'home/file/' + file.id"
            :name="file.name"
          ></file-share>
        </v-list-item>
        <h2 v-if="files.length == 0">查無符合檔案</h2>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="searchdialog = false" text> 關閉 </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="messagedialog" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 訊息 </v-card-title>
        <v-card-text>
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="messagedialog = false" text> 確定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return {
      searchdialog: false,
      files: [],
      keyword: "",
      loading: false,
      messagedialog: false,
      message: "",
    };
  },
  methods: {
    searchkeydown: function (keyboard) {
      if (keyboard.key == "Enter") {
        this.searchstart();
      }
    },
    searchstart: function () {
      var THIS = this;
      if (this.keyword.trim().length > 0) {
        this.axios
          .get(this.absURL + "api/Search", {
            params: { id: this.keyword, info: THIS.loginuser.info },
          })
          .then(function (response) {
            THIS.files = response.data;
          })
          .catch(function (error) {})
          .finally(function () {
            // always executed
            THIS.loading = false;
          });
      }
    },
    fileitemclick: function (fileid) {
      var THIS = this;
      THIS._fileid = fileid;
      this.axios
        .get(this.absURL + "api/Auth", {
          params: { id: fileid, info: this.loginuser.info, counter: true },
        })
        .then(function (response) {
          if (response.data.canopen) {
            saveAs(THIS.absURL + "home/file/" + THIS._fileid);
          } else {
            THIS.messagedialog = true;
            THIS.message = "您無此權限下載該檔案";
          }
        })
        .catch(function (error) {
          THIS.messagedialog = true;
          THIS.message = error.response.data;
        })
        .finally(function () {
          // always executed
        });
    },
    absURL: function () {
      return window.location.origin + this.absURL;
    },
  },
  computed: {
    ...mapState(["absURL", "loginuser"]),
  },
  components: {
    "file-share": function (resolve) {
      require(["./file-share.vue"], resolve);
    },
  },
};
</script>
