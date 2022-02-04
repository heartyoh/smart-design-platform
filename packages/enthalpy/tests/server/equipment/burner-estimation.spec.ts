import { EnthalpyOutputFlow } from '../../../server/controllers/'
import { KELVIN_CONSTANT, ROOM_TEMPERATURE } from '../../../server/controllers/enthalpy'
import { Burner } from '../../../server/controllers/equipment/burner'
import { EnthalpyInputFlow } from '../../../server/controllers/flow/input-flow'

describe('heater estimation', () => {
  var burner
  var preheatedAir
  var lng
  var flueGas

  beforeAll(async () => {
    /* equipment */
    burner = new Burner('연소기', {
      heatlossRate: 0.05,
      outTemperature: 1950
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

    flueGas = new EnthalpyOutputFlow('Flue Gas')

    burner.input(lng, 0)
    burner.input(preheatedAir, 1)
    burner.output(flueGas)
  })

  afterAll(async () => {})

  beforeEach(async () => {})

  it('burner의 계산된 LNG의 몰유량은 1.1480 이어야 한다.', async () => {
    expect((await burner.calcDemandLNGMolFlow()).toFixed(4)).toBe('1.1480')
  })

  it('burner의 계산된 burner의 당량비는 0.5720 이어야 한다.', async () => {
    expect((await burner.calcEquivalentRatio()).toFixed(4)).toBe('0.5720')
  })
})
