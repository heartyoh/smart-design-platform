const path = require('path')
const readXlsxFile = require('read-excel-file/node')

const schema = {
  SUBSTANCE: {
    prop: 'substance',
    type: String,
    required: true
  },
  'g/mol': {
    prop: 'molecularWeight',
    type: Number,
    required: true
  },
  'kJ/kmol': {
    prop: 'heatCapacity',
    type: Number,
    required: true
  },
  PARAMETER: {
    prop: 'parameter',
    type: {
      a: {
        prop: 'a',
        type: Number
      },
      b: {
        prop: 'b',
        type: Number
      },
      c: {
        prop: 'c',
        type: Number
      },
      d: {
        prop: 'd',
        type: Number
      },
      e: {
        prop: 'e',
        type: Number
      },
      f: {
        prop: 'f',
        type: Number
      },
      g: {
        prop: 'g',
        type: Number
      },
      h: {
        prop: 'h',
        type: Number
      },
      i: {
        prop: 'i',
        type: Number
      },
      j: {
        prop: 'j',
        type: Number
      },
      k: {
        prop: 'k',
        type: Number
      },
      l: {
        prop: 'l',
        type: Number
      }
    }
  }
}

var enthalpyParameters

export async function loadEnthalpyParameters() {
  if (!enthalpyParameters) {
    try {
      const { rows, errors } = await readXlsxFile(
        path.join(__dirname, '..', '..', 'data', 'enthalpy-parameters.xlsx'),
        {
          schema
        }
      )

      console.log('Done. read enthalpy-parameters.xlsx')
      errors.forEach(error => console.error('could not read row', error))
      rows.forEach((row, idx) => console.log('ROW', idx, row))

      enthalpyParameters = rows
    } catch (err) {
      console.error('could not read enthalpy parameters file', err)
    }
  }

  return enthalpyParameters
}

export async function getAllEnthalpySubstances(): Promise<string[]> {
  const parameters = await loadEnthalpyParameters()

  return Object.keys(parameters)
}

export async function getEnthalpyParameters(substance: string) {
  const parameters = await loadEnthalpyParameters()

  if (parameters) {
    return parameters.find(parameter => parameter.substance === substance)
  }

  throw new Error(`parameter not found '${substance}'`)
}
