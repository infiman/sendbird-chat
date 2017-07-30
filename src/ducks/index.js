import { combineReducers } from 'redux';
import app from './app';
import chat from './chat';

export default combineReducers({
  app,
  chat,
});
