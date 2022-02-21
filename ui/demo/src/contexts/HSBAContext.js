import { createContext } from "react";

const HSBAContext = createContext({});

export const HSBAProvider = HSBAContext.Provider;
export const HSBAConsumer = HSBAContext.Consumer;

export default HSBAContext;