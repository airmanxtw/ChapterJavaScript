<template>
  <v-dialog v-model="confirmdialog" max-width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="cancel" text> 取消 </v-btn>
        <v-btn color="green darken-1" @click="confirm" text> 確定 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: function () {
    return {
      title: "",
      message: "",
      confirmdialog: false,
      target: [],
    };
  },
  methods: {
    confirm: function () {
      this.$emit("confirm", this.target);
    },
    cancel: function () {
      this.confirmdialog = false;
      this.$emit("cancel");
    },
  },
};
</script>
