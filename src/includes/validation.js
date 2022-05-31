import {
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
  configure,
} from 'vee-validate'

import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  max,
  max_value as maxVal,
  min,
  min_value as minVal,
  required,
  not_one_of as excluded,
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('password_mismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field ${ctx.field} is too short.`,
          max: `This field ${ctx.field} is too long.`,
          alpha_spaces: `This field ${ctx.field} may only contain alphabetic characters and spaces.`,
          email: `This field ${ctx.field} must be a valid email.`,
          min_value: `This field ${ctx.field} is too low.`,
          max_value: `This field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: 'Due to restrictions in your country, we do not accept users from this location.',
          password_mismatch: 'The passwords you entered do not match.',
          tos: 'You must agree to the terms of service.',
        }

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    })
  },
}
