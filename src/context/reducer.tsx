import { ReactNode, createContext, useContext, useReducer } from "react";

import { State, Action, AppContextType, ActionType } from "@/types/reducer";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const reducer = (state: State, action: Action<ActionType>): State => {
  switch (action.type) {
    case "SET_MODAL":
      return {
        ...state,
        modal: { ...state.modal, ...(action.payload as object) },
      };

    case "LOGGED_MENU":
      return {
        ...state,
        loggedMenu: {
          ...state.loggedMenu,
          ...(action.payload as object),
        },
      };

    default:
      return state;
  }
};

export const initialState: State = {
  loggedMenu: {
    isOpen: true,
  },
  modal: null,
};

const getInitialState = () => {
  return {
    ...initialState,
  };
};

// eslint-disable-next-line no-undef
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
