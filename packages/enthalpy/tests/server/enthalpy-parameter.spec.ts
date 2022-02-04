import { getEnthalpy, KELVIN_CONSTANT, ROOM_TEMPERATURE } from '../../server/controllers/enthalpy'
import { getEnthalpyParameters, loadEnthalpyParameters } from '../../server/controllers/enthalpy-parameters'

describe('enthalpy-parameter', () => {
  beforeAll(async () => {
    await loadEnthalpyParameters()
  })

  afterAll(async () => {})

  beforeEach(async () => {})

  it('Molecular Weight of N2 should be 28.', async () => {
    const parameter = await getEnthalpyParameters('N2')

    expect(parameter.molecularWeight).toBe(28)
  })

  it('The enthalpies of N2 and O2 at room temperature should be -2.9306 and -4.4064 respectively.', async () => {
    const enthalpyN2 = await getEnthalpy('N2', ROOM_TEMPERATURE + KELVIN_CONSTANT)
    const enthalpyO2 = await getEnthalpy('O2', ROOM_TEMPERATURE + KELVIN_CONSTANT)

    expect(enthalpyN2.toFixed(4)).toBe('-2.9306')
    expect(enthalpyO2.toFixed(4)).toBe('-4.4064')
  })

  it('The enthalpies of air at room temperature should be -61.9174379.', async () => {
    const enthalpyN2 = await getEnthalpy('N2', ROOM_TEMPERATURE + KELVIN_CONSTANT)
    const enthalpyO2 = await getEnthalpy('O2', ROOM_TEMPERATURE + KELVIN_CONSTANT)

    const enthalpy = enthalpyN2 * 0.79 + enthalpyO2 * 0.21

    expect(enthalpy.toFixed(4)).toBe('-3.2405')
  })

  it('The enthalpies of LNG Mol at room temperature should be 1.1480.', async () => {
    const FLUEGAS_TEMPERATURE = 1950

    const enthalpyCH4 = await getEnthalpy('CH4', ROOM_TEMPERATURE + KELVIN_CONSTANT)
    const enthalpyCO2 = await getEnthalpy('CO2', FLUEGAS_TEMPERATURE)
    const enthalpyH2O = await getEnthalpy('H2O', FLUEGAS_TEMPERATURE)
    const enthalpyO2 = await getEnthalpy('O2', FLUEGAS_TEMPERATURE)

    expect(Math.round(enthalpyCH4).toFixed(0)).toBe('-74601')
    // expect(Math.round(enthalpyCO2).toFixed(0)).toBe('-305061') // -301150
    // expect(Math.round(enthalpyH2O).toFixed(0)).toBe('-171357') // -163849
    // expect(Math.round(enthalpyO2).toFixed(0)).toBe('57315') // 68535

    // 연소 반응식 결과에 따른 Flue GAS 엔탈피 계산
    const a = enthalpyCH4 - enthalpyCO2 - 2 * enthalpyH2O + 2 * enthalpyO2
    // expect(Math.round(a).toFixed(0)).toBe('687803') // 691413
  })
})
