import { KELVIN_CONSTANT, ROOM_TEMPERATURE } from '../../../server/controllers/enthalpy'
import { Burner } from '../../../server/controllers/equipment/burner'
import { Furnace } from '../../../server/controllers/equipment/furnace'
import { Preheater } from '../../../server/controllers/equipment/preheater'
import { Recycler } from '../../../server/controllers/equipment/recycler'
import { EnthalpyInoutFlow } from '../../../server/controllers/flow/inout-flow'
import { EnthalpyInputFlow } from '../../../server/controllers/flow/input-flow'
import { EnthalpyOutputFlow } from '../../../server/controllers/flow/output-flow'

describe('burner estimation', () => {
  var burner
  var furnace
  var preheater
  var recycler

  var air
  var disposed
  var preheatedAirA
  var preheatedAirB
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

    recycler = new Recycler('리사이클', {})
    preheater = new Preheater('예열기', {
      heatloss: 500
    })

    /* flows */

    air = new EnthalpyInputFlow('공기', {
      temperature: KELVIN_CONSTANT + ROOM_TEMPERATURE,
      pressure: 1,
      molFraction: {
        N2: 0.79,
        O2: 0.21
      }
    })

    disposed = new EnthalpyOutputFlow('배출', {
      temperature: 927.587080342644,
      pressure: 1
    })

    preheatedAirA = new EnthalpyInoutFlow('예열공기A', {
      temperature: 750.243,
      pressure: 1,
      molFraction: {
        N2: 0.79,
        O2: 0.21
      }
    })

    preheatedAirB = new EnthalpyInoutFlow('예열공기B', {
      pressure: 1
    })

    lng = new EnthalpyInputFlow('LNG', {
      temperature: KELVIN_CONSTANT + ROOM_TEMPERATURE,
      pressure: 1,
      molFraction: {
        CH4: 1
      }
    })

    flueGas = new EnthalpyInoutFlow('Flue Gas', {
      temperature: 1950,
      pressure: 1
    })

    wastedGas = new EnthalpyInoutFlow('Waste Gas', {
      // temperature: 1250.24323194903,
      pressure: 1
    })

    burner.input(lng, 0)
    burner.input(preheatedAirA, 1)
    burner.output(flueGas, 0)

    furnace.input(flueGas, 0)
    furnace.output(wastedGas, 0)

    preheater.input(air, 0)
    preheater.input(wastedGas, 1)
    preheater.output(disposed, 0)
    preheater.output(preheatedAirB, 1)

    recycler.input(preheatedAirB, 0)
    recycler.output(preheatedAirA, 0)
  })

  afterAll(async () => {})

  beforeEach(async () => {})

  it('equipment의 최종 계산된 preheated flow의 enthalpy는 260526 이어야 한다.', async () => {
    await burner.calculate()
    await furnace.calculate()
    await recycler.calculate()
    await preheater.calculate()

    flueGas.print()

    console.log(
      'Enthalpy GAP between preheatedAirs',
      preheatedAirA.enthalpy,
      preheatedAirB.enthalpy,
      preheatedAirA.enthalpy - preheatedAirB.enthalpy
    )

    console.log(
      'Temperature GAP between preheatedAirs',
      preheatedAirA.temperature,
      preheatedAirB.temperature,
      preheatedAirA.temperature - preheatedAirB.temperature
    )

    expect(Math.abs(260526 - preheatedAirA.enthalpy)).toBeLessThan(10)
    expect(Math.abs(260526 - preheatedAirB.enthalpy)).toBeLessThan(10)
  })
})
