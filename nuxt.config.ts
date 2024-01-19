export default defineNuxtConfig({
  app: {
    baseURL: "/dlc/",
    head: {
      htmlAttrs: {
        lang: "zh-cmn-Hans",
      },
      meta: [{ name: "format-detection", content: "telephone=no" }],
      link: [{ rel: "icon", href: "https://dgck81lnn.github.io/favicon.ico" }],
    },
  },
  //devtools: { enabled: true },
})
