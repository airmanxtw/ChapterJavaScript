<template>
  <v-data-table
    v-if="files.length > 0"
    :headers="filesGrid.headers"
    :items="files"
    item-key="id"
    disable-pagination
    :show-select="canmodify"
    hide-default-footer
    @input="filetableselct"
    class="elevation-1 mb-3"
    @click:row="fileitemclick"
    :value="localCheckitem"
  >
    <template v-slot:item.icon="{ item }">
      <v-icon v-text="item.icon"></v-icon>
    </template>
    <template v-slot:item.share="{ item }">
      <file-share :url="URL() + 'home/file/' + item.id" :name="item.name"></file-share>
    </template>
    <template v-slot:item.createDate="{ item }">
      {{ item.createDate }}
      <v-icon class="mr-2" v-if="canmodify" @click.stop="openmodify(item.id)">
        mdi-cog-outline
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["files", "canmodify", "checkitem"],
  data: function () {
    return {
      filesGrid: {
        headers: [
          { text: "", value: "icon", class: "text-subtitle-1" },
          { text: "檔名", value: "name", class: "text-subtitle-1" },
          { text: "說明", value: "description", class: "text-subtitle-1" },
          {
            text: "大小",
            value: "sizeDesc",
            width: 150,
            align: "end",
            class: "text-subtitle-1",
          },
          {
            text: "下載",
            value: "download",
            width: 100,
            align: "end",
            class: "text-subtitle-1",
          },
          { text: "連結", value: "share", width: 100, class: "text-subtitle-1" },
          {
            text: "開放權限",
            value: "priorityDesc",
            width: 120,
            class: "text-subtitle-1",
          },
          { text: "傳檔日期", value: "createDate", width: 150, class: "text-subtitle-1" },
        ],
      },
    };
  },
  computed: {
    localCheckitem: {
      get: function () {
        var THIS = this;
        THIS.temparray = [];
        this.checkitem.forEach(function (item) {
          THIS.temparray.push({ id: item });
        });
        return THIS.temparray;
      },
    },
    ...mapState(["absURL"]),
  },
  methods: {
    filetableselct: function (obj) {
      var THIS = this;
      THIS.temparray = [];
      obj.forEach(function (item) {
        THIS.temparray.push(item.id);
      });
      this.$emit("update:checkitem", this.temparray);
    },
    openmodify: function (id) {
      this.$emit("openmodify", id);
    },
    fileitemclick: function (obj) {
      this.$emit("fileitemclick", obj.id);
    },
    URL: function () {
      return window.location.origin + this.absURL;
    },
  },
  components: {
    "file-share": function (resolve) {
      require(["./file-share.vue"], resolve);
    },
  },
};
</script>
