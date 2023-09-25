<template>
  <v-app>
    <v-container v-if="!me">
      <v-card>
        <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
          <v-container>
            <v-text-field
              v-model="email"
              label="이메일"
              type="email"
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="비밀번호"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>
            <v-btn label="로그인" color="green" type="submit" :disabled="!valid"
              >로그인</v-btn
            >
            <v-btn label="회원가입" nuxt to="/signup">회원가입</v-btn>
          </v-container>
        </v-form>
      </v-card>
    </v-container>
    <v-container v-else>
      <v-card>
        <v-container
          >{{ me.nickname }}님이 로그인 되었습니다
          <v-btn @click="onLogout">로그아웃</v-btn>
          <v-row>
            <v-col cols="4">{{ me.Followings.length }} 팔로잉</v-col>
            <v-col cols="4">{{ me.Followers.length }} 팔로워</v-col>
            <v-col cols="4">{{ me.Posts.length }} 게시물</v-col>
          </v-row></v-container
        ></v-card
      >
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "이메일을 입력하세요",
        (v) => /.+@.+/.test(v) || "유효한 이메일을 입력해주세요",
      ],
      passwordRules: [(v) => !!v || "비밀번호는 필수입니다."],
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  methods: {
    onSubmitForm() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("users/logIn", {
          email: this.email,
          password: this.password,
        });
      }
    },

    onLogout() {
      this.$store.dispatch("users/logOut");
    },
  },
  head() {
    return {
      title: "로그인",
    };
  },
};
</script>

<style></style>
