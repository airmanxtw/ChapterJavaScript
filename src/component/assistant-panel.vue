<template>
  <div>
    <v-dialog v-model="assdialog" max-width="700">
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot>設定助理</slot>
        </span>
      </template>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          設定助理
          <v-spacer></v-spacer>
          <v-btn @click="openadd" dark>
            <v-icon left dark> mdi-plus </v-icon>
            新增帳號
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" align-self="center">
              <v-data-table
                :headers="headers"
                :items="assItems"
                :items-per-page="5"
                class="elevation-1"
                @click:row="rowclick"
                :footer-props="{
                  disableItemsPerPage: true,
                  itemsPerPageText: '每頁筆數',
                }"
              >
                <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
                  第{{ pageStart }}筆至{{ pageStop }}第筆,共{{ itemsLength }}筆
                </template>
                <template v-slot:item.deadline="{ item }">
                  {{ item.deadline }}

                  <v-chip color="red" class="white--text" small v-if="item.isexpired"
                    >已過期</v-chip
                  >
                </template>
                <template v-slot:item.dept_no="{ item }">
                  <v-btn @click.stop="del(item)" @confirm="confirmdel" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="assdialog = false" text> 關閉 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="adddialog" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ dialogtitle }}
        </v-card-title>
        <v-card-text>
          <v-form ref="addform" lazy-validation>
            <v-select
              :items="deptItems"
              :disabled="disabledauto"
              label="所屬單位"
              :value="deptno"
              item-text="text"
              item-value="key"
              prepend-icon="mdi-briefcase"
            >
            </v-select>
            <v-autocomplete
              ref="vauto"
              :disabled="disabledauto"
              v-model="model"
              :items="items"
              :loading="isLoading"
              :rules="addAccountRules"
              :search-input.sync="search"
              item-text="text"
              item-value="key"
              hint="請輸入教職員姓名或學生學號"
              label="助理名稱"
              clearable
              hide-selected
              prepend-icon="mdi-account"
              hide-no-data
            >
            </v-autocomplete>

            <v-menu
              ref="menu"
              v-model="datemenu"
              :close-on-content-click="false"
              :return-value.sync="deadline"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="deadline"
                  label="到期日"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="deadline" no-title scrollable locale="zh-tw">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="datemenu = false"> 取消 </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(deadline)">
                  確定
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-form>
          <v-alert
            border="right"
            colored-border
            type="error"
            elevation="2"
            v-model="iserr"
          >
            {{ errmessage }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="adddialog = false" text> 取消 </v-btn>
          <v-btn color="green darken-1" @click="addconfirm" text>
            {{ dialogconfirmtitle }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirm-panel ref="cfp" @confirm="confirmdel"></confirm-panel>
  </div>
</template>
<script>
let moment = require("moment");
export default {
  data: function () {
    return {
      assdialog: false,
      adddialog: false,
      items: [],
      deptItems: [],
      isLoading: false,
      search: null,
      model: null,
      deptno: null,
      headers: [
        { text: "單位", value: "dept_name" },
        { text: "姓名", value: "user_name" },
        { text: "到期", value: "deadline" },
        { text: "", value: "dept_no" },
      ],
      assItems: [],
      addAccountRules: [(v) => this.model != null || "請輸入助理"],
      datemenu: false,
      deadline: null,
      errmessage: "",
      disabledauto: false,
    };
  },
  methods: {
    loaddepts: function () {
      var THIS = this;
      this.axios
        .get(this.$store.state.absURL + "api/Item/ChiefDepts", {
          params: {
            info: this.loginuser.info,
          },
        })
        .then(function (response) {
          THIS.deptItems = response.data;
          THIS.deptno = response.data[0].key;
        })
        .catch(function (error) {})
        .finally(function () {});
    },
    loadassistant: function () {
      var THIS = this;
      this.axios
        .get(this.$store.state.absURL + "api/Assistant/MyAssistant", {
          params: {
            info: this.loginuser.info,
          },
        })
        .then(function (response) {
          THIS.assItems = response.data;
        })
        .catch(function (error) {})
        .finally(function () {});
    },
    openadd: function () {
      this.adddialog = true;
      this.disabledauto = false;
      this.errmessage = "";
      this.model = null;
      this.items = [];
      this.deadline = moment().add(6, "months").format("YYYY-MM-DD");
      this.loaddepts();
    },
    addconfirm: function () {
      //var man = this.$refs.vauto.model;
      let isval = this.$refs.addform.validate();
      if (isval) {
        var THIS = this;
        this.errmessage = "";
        this.axios
          .post(
            this.$store.state.absURL +
              "api/Assistant?info=" +
              encodeURIComponent(this.loginuser.info),
            {
              user_id: this.model,
              dept_no: this.deptno,
              deadline: this.deadline,
            }
          )
          .then(function (response) {
            if (!THIS.disabledauto) {
              THIS.assItems.push(response.data);
              THIS.adddialog = false;
            } else {
              var obj = THIS.assItems.find(function (obj) {
                return (
                  obj.user_id == response.data.user_id &&
                  obj.dept_no == response.data.dept_no
                );
              });
              obj.deadline = response.data.deadline;
              THIS.adddialog = false;
            }
          })
          .catch(function (error) {
            THIS.errmessage = error.response.data;
            THIS.model = null;
          })
          .finally(function () {});
      }
    },
    rowclick: function (rowdata, items) {
      this.model = rowdata.user_id;
      this.items.push({ text: rowdata.user_name, key: rowdata.user_id });
      this.adddialog = true;
      this.errmessage = "";
      this.loaddepts();
      this.deptno = rowdata.dept_no;
      this.disabledauto = true;
      this.deadline = rowdata.deadline;
    },
    del: function (item) {
      var cfp = this.$refs.cfp;
      cfp.target = item;
      cfp.title = "刪除帳號";
      cfp.message = `確定要刪除${item.user_name}這個帳號嗎?`;
      this.$refs.cfp.confirmdialog = true;
    },
    confirmdel: function (item) {
      var THIS = this;
      THIS._item = item;
      this.axios
        .delete(this.$store.state.absURL + "api/Assistant/", {
          params: {
            info: this.loginuser.info,
            id: item.user_id,
            deptno: item.dept_no,
          },
        })
        .then(function (response) {
          THIS.assItems = THIS.assItems.filter(function (ass) {
            return !(
              ass.dept_no == THIS._item.dept_no && ass.user_id == THIS._item.user_id
            );
          });
          THIS.$refs.cfp.confirmdialog = false;
        })
        .catch(function (error) {})
        .finally(function () {});
    },
  },
  computed: {
    loginuser: function () {
      return this.$store.state.loginuser;
    },
    iserr: function () {
      return this.errmessage.length > 0 ? true : false;
    },
    dialogtitle: function () {
      return this.disabledauto ? "編輯助理" : "新增助理";
    },
    dialogconfirmtitle: function () {
      return this.disabledauto ? "儲存" : "新增";
    },
  },
  watch: {
    search: function (val) {
      if (
        this.model == null &&
        val != undefined &&
        ((val.charCodeAt(0) >= 0 && val.charCodeAt(0) <= 127 && val.length == 8) ||
          (val.charCodeAt(0) > 127 && val.length >= 2)) &&
        !this.isLoading
      ) {
        this.isLoading = true;
        var THIS = this;
        var VAL = val;
        this.axios
          .get(this.$store.state.absURL + "api/Item/EmpOrStud", {
            params: {
              search: val,
            },
          })
          .then(function (response) {
            var v = THIS.model;
            THIS.items = response.data;
          })
          .catch(function (error) {})
          .finally(function () {
            THIS.isLoading = false;
          });
      }
    },
    assdialog: function (val) {
      if (val) this.loadassistant();
    },
    model: function (newobj, oldobj) {},
  },
  components: {
    "confirm-panel": function (resolve) {
      require(["./confirm-panel.vue"], resolve);
    },
  },
};
</script>
