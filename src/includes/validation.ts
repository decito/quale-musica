import {
  configure,
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm
} from 'vee-validate'

import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  not_one_of as excluded,
  max,
  max_value as maxVal,
  min,
  min_value as minVal,
  required
} from '@vee-validate/rules'

export default {
  //@ts-expect-error type
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('alphaSpaces', alphaSpaces)
    defineRule('minValue', minVal)
    defineRule('maxValue', maxVal)
    defineRule('passwordsMismatch', confirmed)
    defineRule('excluded', excluded)
    defineRule('countryExcluded', excluded)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field ${ctx.field} is too short.`,
          max: `This field ${ctx.field} is too long.`,
          alphaSpaces: `This field ${ctx.field} may only contain alphabetic characters and spaces.`,
          email: `This field ${ctx.field} must be a valid email.`,
          minValue: `This field ${ctx.field} is too low.`,
          maxValue: `This field ${ctx.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          countryExcluded:
            'Due to restrictions in your country, we do not accept users from this location.',
          passwordsMismatch: 'The passwords you entered do not match.',
          tos: 'You must agree to the terms of service.'
        }

        //@ts-expect-error type
        const message = messages[ctx.rule.name]
          ? //@ts-expect-error type
            messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  }
}
