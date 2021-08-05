import { UPDATE_DESIGNER } from '../actions/main'

const INITIAL_STATE = {
  designer: 'ABC'
}

const designer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_DESIGNER:
      return { ...state }

    default:
      return state
  }
}

export default designer
