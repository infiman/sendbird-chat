import { getState } from '../config/store';

export const getConverstations = () => {
  return getState().chat.conversations;
}

export const getConverstationByUrl = url => {
  return getConverstations()[url] || {};
}
