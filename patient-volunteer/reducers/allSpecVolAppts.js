// Reducer used for all appointments looking for a specific volunteer type

import { FETCH_ALL_SPEC_VOL_APPOINTMENTS } from '../actions/types';

export default function(state = null, action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_ALL_SPEC_VOL_APPOINTMENTS:
      return action.payload || false;
    default:
      return state;
  }
}
