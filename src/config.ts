export const ELO_INITIAL_RATING =
  Number(process.env.REACT_APP_ELO_INITIAL_RATING) || 1000
export const ELO_K_FACTOR = Number(process.env.REACT_APP_ELO_K_FACTOR) || 20

console.log('ELO_INITIAL_RATING', ELO_INITIAL_RATING)
console.log('ELO_K_FACTOR', ELO_K_FACTOR)
