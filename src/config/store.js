import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import appReducer from '../ducks';

const store = createStore(
  appReducer,
  applyMiddleware(
    thunkMiddleware,
  ),
);

export const getState = store.getState;
export default store;
