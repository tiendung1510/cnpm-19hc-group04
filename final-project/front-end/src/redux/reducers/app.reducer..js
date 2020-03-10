import { APP_LOADING } from '../actions/types.action';

export default (previousState = { isLoading: false }, action => {
  switch (action.type) {
    case APP_LOADING:
      return {
        ...previousState,
        isLoading: action.isLoading
      }

    default:
      return previousState
  }
});