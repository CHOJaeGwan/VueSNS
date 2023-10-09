module.exports = {
  head: {
    title: "jjgsSNS",
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover",
      },
      {
        "http-equiv": "X-UA-Compatible",
        content: "IE=edge",
      },
      {
        hid: "desc",
        name: "description",
        content: "jjgs의 SNS",
      },
      {
        hid: "ogtitle",
        name: "og:title",
        content: "jjgsSNS",
      },
      {
        hid: "ogdesc",
        name: "og:description",
        content: "jjgs SNS",
      },
      {
        hid: "ogtype",
        property: "og:type",
        content: "website",
      },
      {
        hid: "ogimage",
        property: "og:image",
        content:
          "http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg",
      },
      {
        hid: "ogurl",
        property: "og:url",
        content: "http://jjgssns.com",
      },
    ],
    link: [
      {
        rel: "shortcut icon",
        href: "/vue-nodebird.png",
      },
    ],
  },
  modules: ["@nuxtjs/axios"],
  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/moment"],
  moment: {
    locales: ["ko"],
  },
  build: {
    analyze: false,
    extend(config, { isClient, isServer, isDev }) {
      if (isServer && !isDev) {
        config.devtool = "hidden-source-map";
      }
      console.log("webpack", config, isServer, isDev);
    },
  },
  vuetify: {},
  axios: {
    browserBaseURL:
      process.env.NODE_ENV === "production"
        ? "http://api.jjgssns.com"
        : "http://localhost:3085",
    baseURL:
      process.env.NODE_ENV === "production"
        ? "http://api.jjgssns.com"
        : "http://localhost:3085",
    https: false,
  },
  server: {
    port: process.env.PORT || 3080,
  },
};
