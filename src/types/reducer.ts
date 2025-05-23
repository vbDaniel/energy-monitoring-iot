import { Dispatch, ReactNode } from "react";

// Adicionar os States do reducer
export type State = {
  modal: {
    isOpen?: boolean;
    title?: string | null;
    content?: ReactNode | null;
    buttonText?: string;
    onClick?: () => void;
    onClose?: () => void;
    location?: "right" | "center" | "centerCustomIcon";
    variant?: "primary" | "secondary" | "noBorder";
    size?: "small" | "medium";
    customIcon?: ReactNode;
    header?: string;
    subheader?: string;
  } | null;

  loggedMenu: {
    isOpen: boolean;
  };
};

// Adicionar as Actions
export type ActionType = "SET_MODAL" | "LOGGED_MENU";

// Adicionar os Payloads que refenciam os States
interface ActionPayloads {
  SET_MODAL: Partial<State["modal"]>;
  LOGGED_MENU: Partial<State["loggedMenu"]>;
}

export type Action<T extends ActionType> = {
  type: T;
  payload: ActionPayloads[T];
};

export type AppContextType = {
  state: State;
  dispatch: Dispatch<Action<ActionType>>;
};
