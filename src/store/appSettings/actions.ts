import {
  setDataAction,
  setCropAction,

  setDataValue,
  setCropValue,
} from './constants';

export type ContextStateAction = { type: setDataAction; state: Array<string | number> } | { type: setCropAction, state: boolean};

const setData = (state: Array<string | number>): ContextStateAction => ({
  type: setDataValue,
  state,
});

const setIsCrop = (state: boolean): ContextStateAction => ({
  type: setCropValue,
  state,
});

export {
  setData,
  setIsCrop
};
