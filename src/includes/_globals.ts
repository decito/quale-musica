//@ts-expect-error type
import camelCase from 'lodash/camelCase'
//@ts-expect-error type
import upperFirst from 'lodash/upperFirst'

export default {
  //@ts-expect-error type
  install(app) {
    const baseComponents = import.meta.glob('../components/base/*.vue', {
      eager: true
    })

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          //@ts-expect-error type
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      )

      //@ts-expect-error type
      app.component(`QM${componentName}`, module.default)
    })
  }
}
