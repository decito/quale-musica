import upperFirst from "lodash/upperFirst"
import camelCase from "lodash/camelCase"

export default {
  install(app) {
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true
    })

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      )

      app.component(`QM${componentName}`, module.default)
    })
  }
}
