import NProgress from 'nprogress'

//@ts-expect-error type
export default (router) => {
  //@ts-expect-error type
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })

  router.afterEach(NProgress.done)
}
