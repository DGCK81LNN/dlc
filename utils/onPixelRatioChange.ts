export default function (
  window: Window,
  callback: (devicePixelRatio: number) => void
) {
  if (!process.browser || typeof window.devicePixelRatio !== "number")
    return () => {}

  let query: MediaQueryList
  const handler = function () {
    callback(window.devicePixelRatio)
    query.removeEventListener("change", handler)
    listen()
  }
  const listen = function () {
    query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    query.addEventListener("change", handler)
  }

  listen()

  return function () {
    query.removeEventListener("change", handler)
  }
}
