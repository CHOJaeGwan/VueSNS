<template>
  <div>
    <v-container>
      <v-card>
        <v-container>
          <v-subheader>회원가입</v-subheader>
          <v-form ref="form" @submit.prevent="onSubmitForm" v-model="valid">
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
            <v-text-field
              v-model="passwordCheck"
              label="비밀번호 확인"
              type="password"
              :rules="passwordCheckRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="nickname"
              label="닉네임"
              type="nickname"
              :rules="nicknameRules"
              required
            ></v-text-field>
            <v-checkbox
              required
              :rules="[(v) => !!v || '약관에 동의해야합니다.']"
              label="약속합니다"
            ></v-checkbox>
            <v-btn type="submit" color="green" :disabled="!valid"
              >가입하기</v-btn
            >
          </v-form>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
      terms: "false",
      emailRules: [
        (v) => !!v || "이메일은 필수입니다.",
        (v) => /.+@.+/.test(v) || "이메일이 유효하지 않습니다.",
      ],
      nicknameRules: [(v) => !!v || "닉네임은 필수입니다."],
      passwordRules: [(v) => !!v || "비밀번호는 필수입니다."],
      passwordCheckRules: [
        (v) => !!v || "비밀번호 확인은 필수입니다.",
        (v) => v === this.password || "비밀번호가 일치하지 않습니다.",
      ],
    };
  },
  methods: {
    onSubmitForm() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("users/signUp", {
            email: this.email,
            nickname: this.nickname,
            password: this.password,
          })
          .then(() => {
            this.$router.push({
              path: "/",
            });
          })
          .catch(() => {
            alert("회원가입 실패");
          });
      }
    },
  },
  middleware: "anonymous",
  head() {
    return {
      title: "회원가입",
    };
  },
  computed: {
    me() {
      return this.$store.state.users.me;
    },
  },
  watch: {
    me(value, oldvalue) {
      if (value) {
        this.$router.push({
          path: "/",
        });
      }
    },
  },
};
</script>

<style></style>
