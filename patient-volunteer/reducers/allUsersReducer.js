// Reducer used for data of all users in the system

import { FETCH_ALL_USERS } from '../actions/types';

export default function(state = null, action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_ALL_USERS:
      return action.payload || false;
    default:
      return state;
  }
}
