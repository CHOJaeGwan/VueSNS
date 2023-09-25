<template>
  <div>
    <v-container>
      <v-card style="margin-bottom: 20px">
        <v-container>
          <v-subheader>내 프로필</v-subheader>
          <v-form v-model="valid" @submit.prevent="onChangeNickName">
            <v-text-field
              label="닉네임"
              v-model="nickname"
              :rules="nicknameRule"
              required
            ></v-text-field>
            <v-btn dark color="blue" type="submit">수정</v-btn>
          </v-form>
        </v-container>
      </v-card>
      <template v-if="me"
        ><v-card style="margin-bottom: 20px">
          <v-container
            ><v-subheader>팔로잉</v-subheader
            ><FollowList
              :users="followList"
              :remove="removeFollowing"
            ></FollowList>
            <v-btn
              @click="loadFollowings"
              v-if="hasMoreFollowing"
              dark
              color="blue"
              style="width: 100%"
              >더보기</v-btn
            ></v-container
          >
        </v-card>
        <v-card style="margin-bottom: 20px">
          <v-container
            ><v-subheader>팔로워</v-subheader
            ><FollowList
              :users="followerList"
              :remove="removeFollower"
            ></FollowList>
            <v-btn
              @click="loadFollowers"
              v-if="hasMoreFollower"
              dark
              color="blue"
              style="width: 100%"
              >더보기</v-btn
            ></v-container
          >
        </v-card></template
      >
    </v-container>
  </div>
</template>

<script>
import FollowList from "../components/FollowList.vue";
export default {
  components: {
    FollowList,
  },
  data() {
    return {
      valid: false,
      nickname: "",
      nicknameRule: [(v) => !!v || "닉네임을 입력하세요"],
    };
  },
  computed: {
    followList() {
      return this.$store.state.users.followList;
    },
    followerList() {
      return this.$store.state.users.followerList;
    },
    me() {
      return this.$store.state.users.me;
    },
    hasMoreFollowing() {
      return this.$store.state.users.hasMoreFollowing;
    },
    hasMoreFollower() {
      return this.$store.state.users.hasMoreFollower;
    },
  },
  fetch({ store }) {
    return Promise.all([
      store.dispatch("users/loadFollowers", { offset: 0 }),
      store.dispatch("users/loadFollowings", { offset: 0 }),
    ]);
  },
  methods: {
    onChangeNickName() {
      this.$store.dispatch("users/changeNickname", {
        nickname: this.nickname,
      });
    },
    removeFollowing(userId) {
      this.$store.dispatch("users/unfollow", {
        userId,
      });
    },
    removeFollower(userId) {
      this.$store.dispatch("users/deleteFollower", {
        userId,
      });
    },
    loadFollowings() {
      this.$store.dispatch("users/loadFollowings");
    },
    loadFollowers() {
      this.$store.dispatch("users/loadFollowers");
    },
  },
  middleware: "authenticated",
};
</script>

<style></style>
