export const state = () => ({
  me: null,
  followerList: [],
  followList: [],
  hasMoreFollowing: true,
  hasMoreFollower: true,
  other: null,
});

const limit = 3;

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
  setOther(state, payload) {
    state.other = payload;
  },
  changeNickname(state, payload) {
    state.me.nickname = payload.nickname;
  },
  deleteFollowing(state, payload) {
    let index = state.me.Followings.findIndex((v) => v.id === payload.userId);
    state.me.Followings.splice(index, 1);
    index = state.followList.findIndex((v) => v.id === payload.userId);
    state.followList.splice(index, 1);
  },
  addFollowing(state, payload) {
    state.followList.push(payload);
  },
  deleteFollower(state, payload) {
    let index = state.me.Followers.findIndex((v) => v.id === payload.userId);
    state.me.Followers.splice(index, 1);
    index = state.followerList.findIndex((v) => v.id === payload.userId);
    state.followerList.splice(index, 1);
  },
  addFollower(state, payload) {
    state.followerList.push(payload);
  },
  loadFollowings(state, payload) {
    // const differ = totalFollowing - state.followList.length;
    // const fakeFollowing = Array(differ > limit ? limit : differ)
    //   .fill()
    //   .map((v) => ({
    //     id: Math.random(),
    //     nickname: Math.floor(Math.random() * 100),
    //   }));
    if (payload.offset === 0) {
      state.followList = payload.data;
    } else {
      state.followList = state.followList.concat(payload.data);
    }
    state.hasMoreFollowing = payload.data.length === limit;
  },
  loadFollowers(state, payload) {
    // const differ = totalFollower - state.followerList.length;
    // const fakeFollower = Array(differ > limit ? limit : differ)
    //   .fill()
    //   .map((v) => ({
    //     id: Math.random(),
    //     nickname: Math.floor(Math.random() * 100),
    //   }));
    if (payload.offset === 0) {
      state.followerList = payload.data;
    } else {
      state.followerList = state.followerList.concat(payload.data);
    }
    state.hasMoreFollower = payload.data.length === limit;
  },
  following(state, payload) {
    state.me.Followings.push({ id: payload.userId });
  },
};

export const actions = {
  async loadUser({ commit }, payload) {
    try {
      const res = await this.$axios.get("/user", {
        withCredentials: true,
      });
      commit("setMe", res.data);
    } catch (err) {
      console.error(err);
    }
  },
  async loadOther({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/user/${payload.userId}`, {
        withCredentials: true,
      });
      commit("setOther", res.data);
    } catch (err) {
      console.error(err);
    }
  },
  signUp({ commit }, payload) {
    this.$axios
      .post(
        "/user",
        {
          email: payload.email,
          nickname: payload.nickname,
          password: payload.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("setMe", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  logIn({ commit }, payload) {
    this.$axios
      .post(
        "/user/login",
        {
          email: payload.email,
          password: payload.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("setMe", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  logOut({ commit }) {
    this.$axios
      .post("/user/logout", {}, { withCredentials: true })
      .then(() => {
        commit("setMe", null);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  changeNickname({ commit }, payload) {
    this.$axios
      .patch(
        "/user/nickname",
        { nickname: payload.nickname },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        commit("changeNickname", payload);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  addFollowing({ commit }, payload) {
    commit("addFollowing", payload);
  },
  addFollower({ commit }, payload) {
    commit("addFollower", payload);
  },
  loadFollowers({ commit, state }, payload) {
    if (!(payload && payload.offset === 0) && !state.hasMoreFollower) {
      return;
    }
    let offset = state.followerList.length;
    if (payload && payload.offset === 0) {
      offset = 0;
    }
    return this.$axios
      .get(`/user/${state.me.id}/followers?limit=3&&offset=${offset}`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("loadFollowers", {
          data: res.data,
          offset,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  loadFollowings({ commit, state }, payload) {
    if (!(payload && payload.offset === 0) && !state.hasMoreFollower) {
      return;
    }
    let offset = state.followerList.length;
    if (payload && payload.offset === 0) {
      offset = 0;
    }
    return this.$axios
      .get(`/user/${state.me.id}/followings?limit=3&&offset=${offset}`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("loadFollowings", {
          data: res.data,
          offset,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  follow({ commit }, payload) {
    this.$axios
      .post(
        `/user/${payload.userId}/follow`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        commit("following", { userId: payload.userId });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  unfollow({ commit }, payload) {
    this.$axios
      .delete(`/user/${payload.userId}/follow`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("deleteFollowing", { userId: payload.userId });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  deleteFollower({ commit }, payload) {
    return this.$axios
      .delete(`/user/${payload.userId}/follower`, {
        withCredentials: true,
      })
      .then((res) => {
        commit("deleteFollower", { userId: payload.userId });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
