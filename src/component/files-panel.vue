<template>
  <v-list dense>
    <v-dialog v-model="movedialog" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 移動檔案 </v-card-title>
        <v-card-text>
          <v-subheader class="pl-0"> 計移動{{ checkitem.length }}個檔案 </v-subheader>

          <v-form ref="removeform" lazy-validation>
            <v-select
              :items="dirItems"
              label="移動位置"
              :value="todirid"
              @change="changeDirItems"
              item-text="text"
              item-value="value"
            >
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="movedialog = false" text> 取消 </v-btn>
          <v-btn
            color="green darken-1"
            @click="moveconfirm"
            text
            :disabled="!canMoveConfirm"
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deletedialog" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 刪除檔案 </v-card-title>
        <v-card-text>
          <v-subheader class="pl-0">
            <h2>計刪除{{ checkitem.length }}個檔案，確定要刪除這些檔案嗎？</h2>
          </v-subheader>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="deletedialog = false" text> 取消 </v-btn>
          <v-btn color="green darken-1" @click="deleteconfirm" text> 確定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modifydialog" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2"> 設定檔案 </v-card-title>
        <v-card-text>
          <v-form ref="dirform" lazy-validation>
            <v-subheader class="pl-0">
              <h3>
                {{ modify_file.name }}
              </h3>
            </v-subheader>
            <v-textarea
              label="說明"
              v-model="modify_file.description"
              :counter="100"
              rows="2"
              :rules="descriptionRules"
              hint="簡要說明檔案用途"
            >
            </v-textarea>
            <v-textarea
              label="關鍵字"
              v-model="modify_file.keyword"
              :counter="100"
              rows="2"
              :rules="descriptionRules"
              hint="用於檔案搜尋,關鍵字之間請用逗號隔開"
            >
            </v-textarea>
            <v-select
              :items="priorityItems"
              label="開放權限"
              :value="modify_file.priority"
              @change="changePriority"
              item-text="text"
              item-value="value"
            >
            </v-select>
            <v-subheader class="pl-0">檔案排序順序</v-subheader>
            <v-slider
              v-model="modify_file.sortby"
              min="0"
              max="100"
              hint="數字愈小排序愈上方"
              persistent-hint
              thumb-label="always"
            >
            </v-slider>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="modifydialog = false" text> 取消 </v-btn>
          <v-btn color="green darken-1" @click="modifyconfirm" text> 確定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

    <v-subheader class="text-md-body-1" v-if="files.length > 0">
      <slot> 檔案 </slot>
    </v-subheader>
    <v-divider v-if="files.length > 0"></v-divider>

    <v-list-item v-if="canmodify && files.length > 0">
      <v-list-item-action>
        <v-row>
          <v-slide-y-transition>
            <v-btn
              color="blue-grey"
              v-if="canRemoveOrDelete"
              @click.stop="openmove"
              class="ma-2 white--text"
            >
              移動檔案
              <v-icon right dark> mdi-file-move </v-icon>
            </v-btn>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-btn
              color="blue-grey"
              v-if="canRemoveOrDelete"
              @click.stop="opendelete"
              class="ma-2 white--text"
            >
              刪除檔案
              <v-icon right dark> mdi-delete </v-icon>
            </v-btn>
          </v-slide-y-transition>
        </v-row>
      </v-list-item-action>
      <v-list-item-content> </v-list-item-content>
      <v-list-item-action>
        <v-checkbox v-if="ismobile" v-model="checkall"></v-checkbox>
      </v-list-item-action>
    </v-list-item>

    <component
      ref="flist"
      v-bind:is="currentFileListComponent"
      :files="files"
      :canmodify="canmodify"
      :ismobile="ismobile"
      :checkitem.sync="checkitem"
      @openmodify="openmodify"
      @fileitemclick="fileitemclick"
    >
    </component>
  </v-list>
</template>
<script>
import { TOOLSMixin } from "../plugins/tools.1.0.1";
import { CHECKERMixin } from "../plugins/fieldchecker.1.0.0";
import FilesTableList from "./files-table-list.vue";
import FilesList from "./files-list.vue";
import { mapState } from "vuex";
export default {
  mixins: [TOOLSMixin, CHECKERMixin],
  props: ["activeid", "uploads", "canmodify"],
  data: function () {
    return {
      files: [],
      dirItems: [],
      checkitem: [],
      priorityItems: [],
      movedialog: false,
      deletedialog: false,
      modifydialog: false,
      messagedialog: false,
      message: "",
      modify_file: {
        id: 0,
        name: "",
        description: "",
        keyword: "",
        priority: 0,
        sortby: 0,
      },
      checkall: false,
      todirid: 0,
      descriptionRules: [(v) => this.maxlength(v, 100) || "已超過100個字元"],
    };
  },
  methods: {
    loadfiles: function () {
      let THIS = this;
      this.axios
        .get(
          this.absURL +
            "api/File/" +
            this.activeid +
            "?info=" +
            encodeURIComponent(this.loginuser.info)
        )
        .then(function (response) {
          THIS.files = response.data;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    loadDirItems: function (defaultvalue) {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Item/MyDirectory", {
          params: { info: THIS.loginuser.info },
        })
        .then(function (response) {
          THIS.dirItems = response.data;
          if (defaultvalue == undefined) THIS.todirid = THIS.activeid;
          else THIS.todirid = defaultvalue;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    changeDirItems: function (val) {
      this.todirid = val;
    },
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
      this.modify_file.priority = val;
    },
    openmove: function () {
      this.movedialog = true;
      this.loadDirItems();
    },
    opendelete: function () {
      this.deletedialog = true;
    },
    openmodify: function (fileid) {
      var target = this.finditems(this.files, fileid);
      this.modify_file.id = target.id;
      this.modify_file.name = target.name;
      this.modify_file.description = target.description;
      this.modify_file.keyword = target.keyword;
      this.modify_file.sortby = target.sortby;
      this.modify_file.priority = target.priority;
      this.loadPriority(target.priority);
      this.modifydialog = true;
    },
    moveconfirm: function () {
      var THIS = this;
      this.axios
        .put(
          this.absURL +
            "api/File/move" +
            "?info=" +
            encodeURIComponent(this.loginuser.info) +
            "&todirid=" +
            this.todirid,
          this.checkitem
        )
        .then(function (response) {
          THIS.checkitem.forEach(function (id) {
            THIS.delitem(THIS.files, id);
          });
          THIS.checkitem = [];
          THIS.movedialog = false;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    deleteconfirm: function () {
      var THIS = this;
      this.axios
        .put(
          this.absURL +
            "api/File/delete" +
            "?info=" +
            encodeURIComponent(this.loginuser.info),
          this.checkitem
        )
        .then(function (response) {
          THIS.checkitem.forEach(function (id) {
            THIS.delitem(THIS.files, id);
          });
          THIS.checkitem = [];
          THIS.deletedialog = false;
        })
        .catch(function (error) {})
        .finally(function () {
          // always executed
        });
    },
    modifyconfirm: function () {
      let isval = this.$refs.dirform.validate();
      if (isval) {
        var THIS = this;
        this.axios
          .put(
            this.absURL +
              "api/FileInfo/" +
              this.modify_file.id +
              "?info=" +
              encodeURIComponent(this.loginuser.info),
            this.modify_file
          )
          .then(function (response) {
            var target = THIS.finditems(THIS.files, THIS.modify_file.id);
            Object.assign(target, response.data);
            if (target.sortby != response.data.sortby) {
              target.sortby = response.data.sortby;
              THIS.files = THIS.sortitems(THIS.files);
            }
            THIS.modifydialog = false;
          })
          .catch(function (error) {})
          .finally(function () {
            // always executed
          });
      }
    },
    fileitemclick: function (fileid) {
      var THIS = this;
      this.axios
        .get(this.absURL + "api/Auth", {
          params: { id: fileid, info: this.loginuser.info, counter: true },
        })
        .then(function (response) {
          if (response.data.canopen) {
            saveAs(THIS.absURL + "home/file/" + fileid);
            THIS.axios
              .get(THIS.absURL + "api/FileInfo", { params: { id: fileid } })
              .then(function (res) {
                var target = THIS.finditems(THIS.files, fileid);
                Object.assign(target, res.data);
                //target.download = res.data.download;
                //debugger;
              });
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
  },
  computed: {
    canRemoveOrDelete: function () {
      return this.canmodify && this.checkitem.length > 0;
    },
    canMoveConfirm: function () {
      return this.activeid == this.todirid ? false : true;
    },
    ismobile: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return true;
        default:
          return false;
      }
    },
    currentFileListComponent: function () {
      if (this.ismobile) return "FilesList";
      else return "FilesTableList";
    },
    ...mapState(["absURL", "loginuser"]),
  },
  watch: {
    activeid: function (newval, oldval) {
      this.loadfiles();
      this.checkitem = [];
    },
    uploads: function (newobj, oldobj) {
      for (var i = 0; i < newobj.length; i++) this.files.push(newobj[i]);
      this.files = this.sortitems(this.files);
    },
    checkall: function (newval, oldval) {
      if (newval) {
        let THIS = this;
        this.checkitem = [];
        this.files.forEach(function (item) {
          THIS.checkitem.push(item.id);
        });
      } else {
        this.checkitem = [];
      }
    },
    ismobile: function () {},
    todirid: function (newval, oldval) {},
  },
  components: {
    FilesTableList,
    FilesList,
  },
};
</script>
