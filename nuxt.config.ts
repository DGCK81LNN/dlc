export default defineNuxtConfig({
  modules: ["@bootstrap-vue-next/nuxt"],
  app: {
    baseURL: "/dlc/",
    head: {
      htmlAttrs: {
        lang: "zh-cmn-Hans",
      },
      meta: [{ name: "format-detection", content: "telephone=no" }],
      link: [
        { rel: "icon", href: "https://dgck81lnn.github.io/favicon.ico" },
        { rel: "stylesheet", href: "https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-lnn.min.css" },
        { rel: "stylesheet", href: "https://dgck81lnn.github.io/bootstrap-lnn/dist/bootstrap-vue-3-lnn.min.css" },
      ],
    },
  },
  //devtools: { enabled: true },
})
