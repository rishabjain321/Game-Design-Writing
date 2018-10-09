// Reducer used for all accepted patient's unaccepted appointments

import { FETCH_ALL_UNACCEPTED_PAT_APPOINTMENTS } from '../actions/types';

export default function(state = null, action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_ALL_UNACCEPTED_PAT_APPOINTMENTS:
      return action.payload || false;
    default:
      return state;
  }
}
