<template>
  <v-dialog v-model="fileuploaddialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="blue-grey" v-bind="attrs" v-on="on" class="ma-2 white--text">
        <slot>上傳</slot>
        <v-icon right dark> mdi-file-upload </v-icon>
      </v-btn>

      <v-dialog v-model="message" width="600" persistent>
        <v-card>
          <v-card-title class="headline grey lighten-2"> 訊息 </v-card-title>
          <v-card-text>
            <div v-if="successmessage.length > 0">
              <h3>{{ successmessage }}</h3>
              <ol>
                <li :key="item" v-for="item in successfiles">{{ item }}</li>
              </ol>
            </div>

            <div v-if="errormessage.length > 0">
              <h3>{{ errormessage }}</h3>
              <ol>
                <li :key="item" v-for="item in errorfiles">{{ item }}</li>
              </ol>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="iknow"> 我知道了 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2"> 上傳檔案 </v-card-title>

      <v-card-text>
        <v-form ref="fileuploadform" v-model="fileuploadvalid" lazy-validation>
          <v-file-input
            v-model="files"
            placeholder="限文件格式檔案,每個檔案限制1M以下"
            label="請選擇檔案"
            multiple
            show-size
            counter
            autofocus
            accept=".odt,.pdf,.ods,.odp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            prepend-icon="mdi-paperclip"
          >
            <template v-slot:selection="{ text }">
              <v-chip small label color="primary">
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <v-select
            :items="priorityItems"
            label="開放權限"
            :value="priority"
            @change="changePriority"
            item-text="text"
            item-value="value"
          >
          </v-select>
          <v-progress-linear :value="progress" v-if="showprogress"></v-progress-linear>
        </v-form>
        <v-alert border="right" colored-border type="error" elevation="2" v-model="alert">
          {{ alertMessage }}
        </v-alert>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" @click="fileuploaddialog = false" text>
          關閉
        </v-btn>
        <v-btn color="green darken-1" text :disabled="!canupload" @click="fileupload">
          上傳
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["activeid"],
  data: function () {
    return {
      fileuploaddialog: false,
      fileuploadvalid: false,
      alertMessage: "",
      files: [],
      priorityItems: [],
      priority: 0,
      showprogress: false,
      uploaded: 0,
      errormessage: "",
      errorfiles: [],
      successmessage: "",
      successfiles: [],
      successfileitems: [],
    };
  },
  methods: {
    loadPriority: function (defaultvalue) {
      var THIS = this;
      THIS._defaultvalue = defaultvalue;
      this.axios
        .get(this.absURL + "api/Item/Priority", { params: { activeid: this.activeid } })
        .then(function (response) {
          THIS.priorityItems = response.data;
          if (THIS._defaultvalue == undefined)
            THIS.changePriority(response.data[0].value);
          else THIS.changePriority(THIS._defaultvalue);
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    changePriority: function (val) {
      this.priority = val;
    },
    fileupload: function () {
      this.showprogress = true;
      this.uploaded = 0;
      var THIS = this;
      var uploadworks = [];
      for (let i = 0; i < this.files.length; i++) {
        var form = new FormData();
        form.append("file", this.files[i]);
        form.append("activeid", this.activeid);
        form.append("priority", this.priority);
        uploadworks.push(
          this.axios
            .post(
              this.absURL + "api/File?info=" + encodeURIComponent(this.loginuser.info),
              form
            )
            .then(function (response) {
              debugger;
              THIS.successfileitems.push(response.data);
              THIS.successfiles.push(response.data.name);
              THIS.uploaded += response.data.size;
            })
            .catch(function (error) {
              THIS.errorfiles.push(error.response.data);
            })
            .finally(function () {
              // always executed
            })
        );
      }
      Promise.all(uploadworks).then(function () {
        if (THIS.successfiles.length > 0) THIS.successmessage = "已成功上傳:";

        if (THIS.errorfiles.length > 0) THIS.errormessage = "發生下列錯誤:";

        THIS.files = [];
      });
    },
    iknow: function () {
      this.errormessage = "";
      this.errorfiles = [];
      this.successmessage = "";
      this.showprogress = false;
      this.$emit("uploads", this.successfileitems);
      this.successfiles = [];
      this.successfileitems = [];
    },
    filterFiles: function (files, acceptfiles, denyfiles) {
      for (let i = 0; i < files.length; i++) {
        let obj = files[i];
        if (this.filter.indexOf(obj.type) > -1 && this.sizelimit >= obj.size)
          acceptfiles.push(obj);
        else denyfiles.push(files[i].name);
      }
      return acceptfiles;
    },
  },
  computed: {
    alert: function () {
      return this.alertMessage.length > 0 ? true : false;
    },
    message: function () {
      return this.errormessage.length > 0 || this.successmessage.length > 0
        ? true
        : false;
    },
    canupload: function () {
      return this.files.length > 0 ? true : false;
    },
    totaluploadsize: function () {
      if (this.files.length > 0) {
        let tot = 0;
        for (let i = 0; i < this.files.length; i++) tot += this.files[i].size;
        return tot;
      } else {
        return 0;
      }
    },
    progress: function () {
      return (this.uploaded / this.totaluploadsize) * 100;
    },
    ...mapState(["absURL", "loginuser", "filter", "sizelimit"]),
  },
  watch: {
    activeid: function (newval, oldval) {},
    fileuploaddialog: function (newval, oldval) {
      if (newval && !oldval) this.loadPriority();
    },
    files: function (newobj, oldobj) {
      let changeobj = [];
      let emessage = [];
      this.filterFiles(newobj, changeobj, emessage);
      if (changeobj.length != newobj.length) {
        this.files = changeobj;
        this.errormessage = "以下的檔案因限制條件無法選取:";
        this.errorfiles = emessage;
      }
    },
  },
};
</script>
