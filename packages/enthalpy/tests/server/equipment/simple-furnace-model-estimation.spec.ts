import { EnthalpyOutputFlow } from '../../../server/controllers/'
import { KELVIN_CONSTANT, ROOM_TEMPERATURE } from '../../../server/controllers/enthalpy'
import { Burner } from '../../../server/controllers/equipment/burner'
import { Furnace } from '../../../server/controllers/equipment/furnace'
import { EnthalpyInputFlow } from '../../../server/controllers/flow/input-flow'

describe('heater estimation', () => {
  var burner
  var furnace

  var preheatedAir
  var lng
  var flueGas
  var wastedGas

  beforeAll(async () => {
    /* equipment */
    burner = new Burner('연소기', {
      heatlossRate: 0.05,
      outTemperature: 1950
    })

    furnace = new Furnace('공업로', {
      energeEfficiency: 0.5,
      power: 300 /* kW */
    })

    /* flows */
    preheatedAir = new EnthalpyInputFlow('예열공기', {
      temperature: 750.243,
      pressure: 1,
      molFraction: {
        N2: 0.79,
        O2: 0.21
      }
    })

    lng = new EnthalpyInputFlow('LNG', {
      temperature: KELVIN_CONSTANT + ROOM_TEMPERATURE,
      pressure: 1,
      molFraction: {
        CH4: 1
      }
    })

    flueGas = new EnthalpyOutputFlow('Flue Gas', {
      temperature: 1950,
      pressure: 1
    })

    wastedGas = new EnthalpyOutputFlow('Waste Gas', {
      temperature: 1250.24323194903,
      pressure: 1
    })

    burner.input(lng, 0)
    burner.input(preheatedAir, 1)
    burner.output(flueGas, 0)

    furnace.input(flueGas, 0)
    furnace.output(wastedGas, 0)
  })

  afterAll(async () => {})

  beforeEach(async () => {})

  it('equipment의 최종 계산된 wastedGas flow의 CH4는 0 이어야 한다.', async () => {
    await burner.calculate()
    await furnace.calculate()

    wastedGas.print()

    const molFlow = wastedGas.molFlow
    expect(molFlow['CH4']).toBe(0)
  })
})
