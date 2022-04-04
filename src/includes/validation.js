import {
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
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
    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('min_value', minVal)
    defineRule('max_value', maxVal)
    defineRule('confirmed', confirmed)
    defineRule('excluded', excluded)
  },
};
