/* eslint-disable */
import React, {Dispatch, FunctionComponent, useCallback} from "react";

type AppState = {
    language: string,
    currentPrice: number
};

const initialState: AppState = {
    language: localStorage.getItem("lang")?.split("_")[0] || "en",
    currentPrice: 0
};

export const AppStateContext = React.createContext<{
    appState: AppState;
    dispatch: Dispatch<any>;
    setLanguage: (data: string) => void;
    setCurrentPrice: (data: number) => void;
}>({
    appState: initialState,
    dispatch: () => {
        console.log("not implemented");
    },
    setLanguage: (lang: string) => {
        console.log("not implemented");
    },
    setCurrentPrice: (data: number) => {
        console.log("not implemented");
    }
});

const reducer = (appState: AppState, action: any) => {
    switch (action.type) {
        case "SET_LANGUAGE":
            return {
                ...appState,
                language: action.payload,
            };
        case "HANDLE_CURRENT_PRICE":
            return {
                ...appState,
                currentPrice: action.payload,
            };
        default:
            return appState;
    }
};

const AppStateProvider: FunctionComponent = ({children}) => {
    const [appState, dispatch] = React.useReducer(reducer, initialState);

    const setLanguage = useCallback((lang: string) => {
        dispatch({type: "SET_LANGUAGE", payload: lang || "en"});
    }, [appState]);

    const setCurrentPrice = useCallback((data: number) => {
        dispatch({type: "HANDLE_CURRENT_PRICE", payload: data || 0});
    }, [appState]);


    return (
        <AppStateContext.Provider
            value={{
                appState,
                dispatch,
                setLanguage,
                setCurrentPrice
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
};

const useAppState = () => {
    const context = React.useContext(AppStateContext);
    if (context === undefined) {
        throw new Error("useAppState must be used within a AppStateProvider");
    }

    return context;
};

export {AppStateProvider, useAppState};