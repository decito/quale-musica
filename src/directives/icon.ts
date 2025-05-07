export default {
  beforeMount(element: HTMLElement, binding) {
    let iconClass = `fas fa-${binding.value.icon} text-xl`

    if (binding.arg === 'full') {
      iconClass = binding.value
    }

    if (binding.value.right) {
      iconClass += ' float-right'
    }

    if (binding.value.color) {
      iconClass += ` text-${binding.value.color}`
    }

    element.innerHTML += `<i class='${iconClass}' />`
  }
}
