import { EnthalpyOutputFlow } from '../../../server/controllers/'
import { Furnace } from '../../../server/controllers/equipment/furnace'
import { EnthalpyInputFlow } from '../../../server/controllers/flow/input-flow'

describe('heater estimation', () => {
  var furnace
  var input
  var output

  beforeAll(async () => {
    /* equipment */
    furnace = new Furnace('공업로', {
      energeEfficiency: 0.5,
      power: 300 /* kW */
    })

    /* flows */
    input = new EnthalpyInputFlow('Flue Gas', {
      temperature: 1950,
      pressure: 1,
      totalMassFlow: 569.4263795,
      totalMolFlow: 20.2554,
      enthalpy: 174881,
      molFlow: {
        N2: 15.09487562,
        O2: 1.716576595,
        CH4: 0,
        CO2: 1.147992639,
        H2O: 2.295985278
      },
      molFraction: {
        N2: 0.745226121,
        O2: 0.084746489,
        CH4: 0,
        CO2: 0.056675797,
        H2O: 0.113351593
      },
      massFlow: {
        N2: 422.6565173,
        O2: 54.93045105,
        CH4: 0,
        CO2: 50.51167612,
        H2O: 41.32773501
      },
      massFraction: {
        N2: 0.742249626,
        O2: 0.096466291,
        CH4: 0,
        CO2: 0.088706245,
        H2O: 0.072577837
      }
    })

    output = new EnthalpyOutputFlow('Waste Gas', {
      temperature: 1250.24323194903,
      pressure: 1
    })

    furnace.input(input, 0)
    furnace.output(output, 0)
  })

  afterAll(async () => {})

  beforeEach(async () => {})

  it('furnace의 output 몰유량은 20.2554 이어야 한다.', async () => {
    await furnace.calculate()

    expect(output.totalMolFlow.toFixed(4)).toBe('20.2554')
  })

  it('furnace의 최종 계산된 output flow의 enthalpy는 -365119 이어야 한다.', async () => {
    await furnace.calculate()

    input.print()
    output.print()

    expect(output.enthalpy).toBe(-365119)
  })
})
