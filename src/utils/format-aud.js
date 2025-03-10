function formatAUD (value, roundUp = false) {
  if (value === null || value === undefined) {
    return ''
  }
  let formattedValue = value
  if (roundUp) {
    formattedValue = Math.ceil(value)
  }
  return formattedValue.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
  })
}

export default formatAUD
