<template>
  <div>
    <div class="pb-8">
      <div v-if="canmodify">
        <v-btn color="blue-grey" @click.stop="openCreateDir" class="ma-2 white--text">
          新增目錄
          <v-icon right dark> mdi-folder-plus </v-icon>
        </v-btn>
        <fileupload-button
          ref="fileuploadbutton"
          :activeid="activeid"
          @uploads="fileuploads"
          >上傳檔案</fileupload-button
        >
      </div>

      <v-dialog v-model="dirdialog" max-width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            {{ dirdialogtitle }}
          </v-card-title>

          <v-card-text>
            <v-form ref="dirform" lazy-validation>
              <v-text-field
                v-model="currentDIR.name"
                :counter="20"
                :rules="nameRules"
                label="目錄名稱"
                required
              >
              </v-text-field>
              <v-textarea
                label="說明"
                v-model="currentDIR.description"
                :counter="100"
                rows="2"
                :rules="descriptionRules"
                hint="簡要說明目錄用途(選填)"
              >
              </v-textarea>
              <v-select
                :items="dirItems"
                label="存放位置"
                :value="currentDIR.parent_id"
                @change="changeDirItems"
                item-text="text"
                item-value="value"
              >
              </v-select>
              <v-select
                :items="priorityItems"
                label="開放權限"
                :value="currentDIR.priority"
                @change="changePriority"
                item-text="text"
                item-value="value"
              >
              </v-select>
              <v-subheader class="pl-0">目錄排序順序</v-subheader>
              <v-slider
                v-model="currentDIR.sortby"
                min="0"
                max="100"
                hint="數字愈小排序愈上方"
                persistent-hint
                thumb-label="always"
              >
              </v-slider>
            </v-form>

            <v-alert
              border="right"
              colored-border
              type="error"
              elevation="2"
              v-model="is_dirdialog_message"
            >
              {{ dirdialog_message }}
            </v-alert>
          </v-card-text>

          <v-card-actions>
            <v-checkbox
              color="red"
              label="刪除此目錄"
              v-if="candel"
              v-model="todel"
            ></v-checkbox>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" @click="dirdialog = false" text> 取消 </v-btn>

            <v-btn color="green darken-1" @click="confirm" text>
              {{ confirmtitle }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-list id="dirpaneldiv" dense>
        <v-subheader class="text-md-body-1">
          目錄
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:item="{ item }">
              <a @click="listitemclick(item.id)">
                {{ item.text }}
              </a>
            </template>
          </v-breadcrumbs>
        </v-subheader>
        <v-divider></v-divider>

        <v-list-item
          v-show="canopen"
          v-for="dir in directorys"
          :key="dir.id"
          @click.stop="listitemclick(dir.id)"
          two-line
        >
          <v-list-item-icon>
            <v-icon v-text="dir.icon" large></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="text-md-body-1"
              v-text="dir.name"
            ></v-list-item-title>
            <v-list-item-subtitle>{{ dir.Desc }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon v-if="canmodify" @click.stop="openUpdateDir(dir.id)">
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <files-panel
        v-if="canopen"
        :activeid="activeid"
        :uploads="uploads"
        :canmodify="canmodify"
        >檔案</files-panel
      >
    </div>
    <v-card v-show="!hiddenshow" class="mx-auto my-12" max-width="374">
      <v-card-title>
        <v-icon> mdi-eye-off </v-icon>
        無權限讀取此目錄,{{ prioritydesc }}
      </v-card-title>
    </v-card>

    <v-btn
      v-scroll="onScroll"
      v-show="showtop"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="goTop"
    >
      <v-icon>mdi-arrow-up-thick</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { TOOLSMixin } from "../plugins/tools.1.0.1";
import { CHECKERMixin } from "../plugins/fieldchecker.1.0.0";
import FilesPanel from "./files-panel.vue";
import { mapState } from "vuex";
export default {
  mixins: [TOOLSMixin, CHECKERMixin],
  props: ["activeid"],
  data: function () {
    return {
      dirdialog: false,
      fileupdialog: false,
      dirdialog_title: "新增目錄",
      dirdialog_message: "",
      breadcrumbs: [],
      directorys: [],
      currentDIR: {
        id: -1,
        name: "",
        description: "",
        sortby: 50,
        priority: 0,
        parent_id: 0,
      },
      dirItems: [],
      priorityItems: [],
      nameRules: [
        (v) => this.blank(v) || "請填寫",
        (v) => this.maxlength(v, 20) || "已超過20個字元",
      ],
      descriptionRules: [(v) => this.maxlength(v, 100) || "已超過100個字元"],
      canopen: false,
      canmodify: false,
      hiddenshow: true,
      prioritydesc: "",
      candel: false,
      todel: false,
      uploads: [],
      showtop: false,
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.showtop = top > 20;
    },
    listitemclick: function (id) {
      this.$emit("dirclick", id);
    },
    setauthority: function () {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Auth", {
          params: { id: this.activeid, info: this.loginuser.info },
        })
        .then(function (response) {
          THIS.canopen = response.data.canopen;
          THIS.canmodify = response.data.canmodify;
          THIS.hiddenshow = response.data.canopen;
          THIS.prioritydesc = response.data.prioritydesc;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    openCreateDir: function () {
      this.dirdialog_message = "";
      this.candel = false;
      this.currentDIR.id = -1;
      this.currentDIR.name = "";
      this.currentDIR.description = "";
      this.currentDIR.sortby = 50;
      this.dirdialog = true;
      this.loadDirItems();
      this.loadPriority();
    },
    openUpdateDir: function (dirid) {
      this.dirdialog_message = "";
      this.candel = true;
      this.todel = false;
      this.currentDIR.id = dirid;
      var target = this.finditems(this.directorys, dirid);
      this.currentDIR.name = target.name;
      this.currentDIR.description = target.description;
      this.currentDIR.priority = target.priority;
      this.currentDIR.parent_id = target.parent_id;
      this.currentDIR.sortby = target.sortby;

      this.dirdialog = true;
      this.loadDirItems(this.currentDIR.parent_id);

      this.loadPriority(this.currentDIR.priority);
    },
    confirm: function () {
      if (this.currentDIR.id == -1) this.addDir();
      else if (!this.todel) this.updateDir();
      else this.deleteDir();
    },
    addDir: function () {
      let isval = this.$refs.dirform.validate();
      if (isval) {
        let P = {
          name: this.currentDIR.name,
          description: this.currentDIR.description,
          sortby: this.currentDIR.sortby,
          parent_id: this.currentDIR.parent_id,
          priority: this.currentDIR.priority,
        };
        let THIS = this;
        this.axios
          .post(
            this.absURL + "api/Dir?info=" + encodeURIComponent(this.loginuser.info),
            P
          )
          .then(function (response) {
            THIS.pushDir(response.data);
            THIS.$emit("newdir", response.data);
            THIS.dirdialog = false;
          })
          .catch(function (error) {
            THIS.dirdialog_message = error.response.data;
          })
          .finally(function () {
            // always executed
          });
      }
    },
    updateDir: function () {
      let isval = this.$refs.dirform.validate();
      if (isval) {
        let P = {
          id: this.currentDIR.id,
          name: this.currentDIR.name,
          description: this.currentDIR.description,
          sortby: this.currentDIR.sortby,
          parent_id: this.currentDIR.parent_id,
          priority: this.currentDIR.priority,
        };

        let THIS = this;
        this.axios
          .put(
            this.absURL +
              "api/Dir/" +
              this.currentDIR.id +
              "?info=" +
              encodeURIComponent(this.loginuser.info),
            P
          )
          .then(function (response) {
            THIS.pushDir(response.data);
            THIS.$emit("upddir", response.data);
            THIS.dirdialog = false;
          })
          .catch(function (error) {
            THIS.dirdialog_message = error.response.data;
          })
          .finally(function () {
            // always executed
          });
      }
    },
    deleteDir: function () {
      let THIS = this;
      this.axios
        .delete(
          this.absURL +
            "api/Dir/" +
            this.currentDIR.id +
            "?info=" +
            encodeURIComponent(this.loginuser.info)
        )
        .then(function (response) {
          THIS.delitem(THIS.directorys, THIS.currentDIR.id);
          THIS.$emit("deldir", THIS.currentDIR.id);
          THIS.dirdialog = false;
        })
        .catch(function (error) {
          THIS.dirdialog_message = error.response.data;
        })
        .finally(function () {
          // always executed
        });
    },
    pushDir: function (newobj) {
      this.delitem(this.directorys, newobj.id);
      if (newobj.parent_id == this.activeid) {
        this.directorys.push(newobj);
      }
      this.directorys = this.sortitems(this.directorys);
    },
    changeDirItems: function (val) {
      this.currentDIR.parent_id = val;
    },
    loadPriorityByParent: function () {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Item/PriorityByParent", {
          params: { activeid: this.activeid },
        })
        .then(function (response) {
          THIS.priorityItems = response.data;
          THIS.changePriority(response.data[0].value);
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    loadPriority: function (defaultvalue) {
      var THIS = this;
      THIS._defaultvalue = defaultvalue;
      this.axios
        .get(this.absURL + "api/Item/Priority", {
          params: { activeid: this.activeid },
        })
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
      this.currentDIR.priority = val;
    },
    loadDirItems: function (defaultvalue) {
      var THIS = this;
      THIS._defaultvalue = defaultvalue;
      this.axios
        .get(this.absURL + "api/Item/MyDirectory", {
          params: { info: THIS.loginuser.info },
        })
        .then(function (response) {
          THIS.dirItems = response.data;
          if (THIS._defaultvalue == undefined) THIS.changeDirItems(THIS.activeid);
          else THIS.changeDirItems(THIS._defaultvalue);
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    loadbreadcrumbs: function () {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Bread", {
          params: { dirid: this.activeid, info: this.loginuser.info },
        })
        .then(function (response) {
          THIS.breadcrumbs = response.data;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    loaddirectorys: function () {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Dir/DIRS", {
          params: { dirid: this.activeid, info: THIS.loginuser.info },
        })
        .then(function (response) {
          THIS.directorys = response.data;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    fileuploads: function (files) {
      this.uploads = files;
    },
    openfileupload: function (files) {
      let fb = this.$refs.fileuploadbutton;
      if (fb != undefined) {
        fb.files = fb.filterFiles(files, [], []);
        if (fb.files.length > 0) fb.fileupload();
      }
    },
    goTop: function () {
      this.$vuetify.goTo(0);
    },
  },
  computed: {
    is_dirdialog_message: function () {
      return this.dirdialog_message.length == 0 ? false : true;
    },
    confirmtitle: function () {
      return this.currentDIR.id == -1 ? "新增" : "修改";
    },
    dirdialogtitle: function () {
      return this.currentDIR.id == -1 ? "新增目錄" : "修改目錄";
    },
    ...mapState(["isauth", "absURL", "loginuser"]),
  },
  watch: {
    activeid: function (newvalue, oldvalue) {
      //this.currentDIR.parent_id = newvalue;
      this.setauthority();
      this.loadbreadcrumbs();
      this.loaddirectorys();
    },
    loginuser: function () {
      this.setauthority();
    },
  },
  created: function () {},
  components: {
    "fileupload-button": function (resolve) {
      require(["./fileupload-button.vue"], resolve);
    },
    FilesPanel,
    //'files-panel':function (resolve){require(['./files-panel.vue'], resolve)},
  },
};
</script>
