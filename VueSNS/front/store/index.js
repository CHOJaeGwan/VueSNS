export const state = () => ({});

export const actions = {
  nuxtServerInit({ commit, dispatch, state }, { req }) {
    return dispatch("users/loadUser");
  },
};

export const mutations = {};
