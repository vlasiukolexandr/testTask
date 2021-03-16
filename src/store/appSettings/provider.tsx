import React, { createContext, useContext } from "react";
import ReactDataSheet from "react-datasheet";
import { ContextStateAction } from './actions';
import { contextReducer } from './reducer';

export type ContextState = {
  data: any;
  isCrop: boolean;
}

interface ContextProps {
  context: ContextState;
  contextDispatch: React.Dispatch<ContextStateAction>;
}

const createDefaultState = (): ContextState => ({
  data: null,
  isCrop: false,
});

const Context = createContext<ContextProps>({
  context: {...createDefaultState()},
  contextDispatch: (action: ContextStateAction) => {
    throw new Error('Using AppSettings Context without the provider');
  },
});

const AppSettingsProvider: React.FC = (props) => {
  const [context, contextDispatch] = React.useReducer(contextReducer, {...createDefaultState()});

  return <Context.Provider value={{ context, contextDispatch }}>{props.children}</Context.Provider>;
};

const useAppSettingsState = () => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error("appSettingsState must be used within a AppSettingsProvider");
  }
  return context;
};

export {
  AppSettingsProvider,
  useAppSettingsState,
};