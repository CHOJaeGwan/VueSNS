<template>
  <v-form
    ref="form"
    v-model="valid"
    style="position: relative"
    @submit.prevent="onSubmitForm"
  >
    <v-textarea
      v-model="content"
      filled
      label="댓글 달기"
      :hide-details="hideDetails"
      :success-messages="successMessages"
      :success="success"
      @input="onChangeTextarea"
    ></v-textarea>
    <v-btn type="submit" dark absolute top right color="green">댓글 입력</v-btn>
  </v-form>
</template>

<script>
export default {
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  data() {
    return {
      valid: false,
      hideDetails: false,
      successMessages: "",
      success: false,
      content: "",
    };
  },
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onChangeTextarea(value) {
      if (value.length) {
        this.hideDetails = true;
        this.success = false;
        this.successMessages = "";
      }
    },
    onSubmitForm() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("posts/addComment", {
            content: this.content,
            postId: this.postId,
          })
          .then(() => {
            this.hideDetails = false;
            this.success = true;
            this.successMessages = "댓글이 작성되었습니다!";
            this.content = "";
          })
          .catch(() => {});
      }
    },
  },
};
</script>

<style></style>
