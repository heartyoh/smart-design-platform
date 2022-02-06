import { KELVIN_CONSTANT, ROOM_TEMPERATURE } from '../enthalpy'
import { Burner } from '../equipment/burner'
import { Furnace } from '../equipment/furnace'
import { Preheater } from '../equipment/preheater'
import { Recycler } from '../equipment/recycler'
import { EnthalpyInoutFlow } from '../flow/inout-flow'
import { EnthalpyInputFlow } from '../flow/input-flow'
import { EnthalpyOutputFlow } from '../flow/output-flow'
import { Registry } from '../models'

const registry = new Registry()

/* flows */

const air = new EnthalpyInputFlow('공기', {
  temperature: KELVIN_CONSTANT + ROOM_TEMPERATURE,
  pressure: 1,
  molFraction: {
    N2: 0.79,
    O2: 0.21
  }
})

const wastedGas = new EnthalpyInoutFlow('Wasted Gas', {
  // temperature: 1250.24323194903, -- 해찾기로 계산되어야 한다.
  pressure: 1
})

const dispose = new EnthalpyOutputFlow('배출', {
  temperature: 927.587080342644,
  pressure: 1
})

const preheatedAirB = new EnthalpyInoutFlow('예열공기B', {
  pressure: 1
})

const preheatedAirA = new EnthalpyInoutFlow('예열공기A', {
  temperature: 750.243,
  pressure: 1,
  molFraction: {
    // 이 값은 Air 로부터 유도할 수 있어야 한다. 왜냐면, Input타입이 아니니까.
    N2: 0.79,
    O2: 0.21
  }
})

const lng = new EnthalpyInputFlow('LNG', {
  temperature: KELVIN_CONSTANT + ROOM_TEMPERATURE,
  pressure: 1,
  molFraction: {
    CH4: 1
  }
})
const flueGas = new EnthalpyInoutFlow('Flue Gas', {
  temperature: 1950,
  pressure: 1
})

/* equipment */
const burner = new Burner('연소기', {
  heatlossRate: 0.05,
  outTemperature: 1950
})
const furnace = new Furnace('공업로', {
  energeEfficiency: 0.5,
  power: 300 /* kW */
})
const recycler = new Recycler('리사이클', {})
const preheater = new Preheater('예열기', {
  heatloss: 500
})

/* connecting */
preheater.input(air, 0)
preheater.input(wastedGas, 1)
preheater.output(dispose, 0)
preheater.output(preheatedAirB, 1)

recycler.input(preheatedAirB, 0)
recycler.output(preheatedAirA, 0)

burner.input(lng, 0)
burner.input(preheatedAirA, 1)
burner.output(flueGas, 0)

furnace.input(flueGas, 0)
furnace.output(wastedGas, 0)

/* flow constraints */
registry.substances = ['O2', 'N2', 'CO2', 'CH4', 'H2O']

registry.addEquipment([burner, furnace, recycler])
registry.addFlow([air, wastedGas, dispose, preheatedAirA, preheatedAirB, lng, flueGas])

export async function evaluate(init: number) {
  preheatedAirA.constraints = {
    temperature: init || 750.243,
    pressure: 1,
    molFraction: {
      N2: 0.79,
      O2: 0.21
    }
  }

  await burner.calculate()
  await furnace.calculate()
  await recycler.calculate()
  await preheater.calculate()

  return [air, dispose, preheatedAirB, preheatedAirA, flueGas, wastedGas]
}
