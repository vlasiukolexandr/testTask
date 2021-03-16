import {
  setDataValue,
  setCropValue,
} from './constants';
import { ContextState } from './provider';
import { ContextStateAction } from './actions';

const contextReducer = (state: ContextState, action: ContextStateAction) => {
  switch (action.type) {
    case setDataValue:
      return {
        ...state,
        data: action.state,
      };

    case setCropValue:
      return {
        ...state,
        isCrop: action.state,
      };

    default:
      throw new Error('appSettingsContextReducer: unknown action');
  }
};

export { contextReducer };
