import { getEnthalpyParameters } from './enthalpy-parameters'

export const IDEAL_GAS_RAW = 8.314 /* kJ/(kmol*K) */
export const KELVIN_CONSTANT = 273
export const ROOM_TEMPERATURE = 25

export async function getEnthalpy(substance: string, temperature: number) {
  const {
    parameter: { a, b, c, d, e, f, g, h, i, j, k, l }
  } = await getEnthalpyParameters(substance)

  if (temperature <= 200) {
    return 0
  } else if (temperature > 200 || temperature <= 1000) {
    return (
      IDEAL_GAS_RAW *
      (a +
        b * temperature +
        (c / 2) * Math.pow(temperature, 2) +
        (d / 3) * Math.pow(temperature, 3) +
        (e / 4) * Math.pow(temperature, 4) +
        (f / 5) * Math.pow(temperature, 5))
    )
  } else {
    return (
      IDEAL_GAS_RAW *
      (g +
        h * temperature +
        (i / 2) * Math.pow(temperature, 2) +
        (j / 3) * Math.pow(temperature, 3) +
        (k / 4) * Math.pow(temperature, 4) +
        (l / 5) * Math.pow(temperature, 5))
    )
  }
}
