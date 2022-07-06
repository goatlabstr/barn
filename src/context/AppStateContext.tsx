/* eslint-disable */
import React, {Dispatch, FunctionComponent, useCallback} from "react";

type AppState = {
    language: string,
    currentPrice: number,
    chains: Object,
    activeValidators: Array<any>,
    inactiveValidators: Array<any>
};

const initialState: AppState = {
    language: localStorage.getItem("lang")?.split("_")[0] || "en",
    currentPrice: 0,
    chains: {},
    activeValidators: [],
    inactiveValidators: [],
};

export const AppStateContext = React.createContext<{
    appState: AppState;
    dispatch: Dispatch<any>;
    setLanguage: (data: string) => void;
    setCurrentPrice: (data: number) => void;
    setChains: (data: Object) => void;
    setActiveValidators: (data: Array<any>) => void;
    setInactiveValidators: (data: Array<any>) => void;
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
    },
    setChains: (data: Object) => {
        console.log("not implemented");
    },
    setActiveValidators: (data: Array<any>) => {
        console.log("not implemented");
    },
    setInactiveValidators: (data: Array<any>) => {
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
        case "HANDLE_CHAINS_CONFIG":
            return {
                ...appState,
                chains: action.payload,
            };
        case "HANDLE_ACTIVE_VALIDATOR_LIST":
            return {
                ...appState,
                activeValidators: action.payload,
            };
        case "HANDLE_INACTIVE_VALIDATOR_LIST":
            return {
                ...appState,
                inactiveValidators: action.payload,
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

    const setChains = useCallback((data: Object) => {
        dispatch({type: "HANDLE_CHAINS_CONFIG", payload: data || {}});
    }, [appState]);

    const setActiveValidators = useCallback((data: Array<any>) => {
        dispatch({type: "HANDLE_ACTIVE_VALIDATOR_LIST", payload: data || []});
    }, [appState]);

    const setInactiveValidators = useCallback((data: Array<any>) => {
        dispatch({type: "HANDLE_INACTIVE_VALIDATOR_LIST", payload: data || []});
    }, [appState]);

    return (
        <AppStateContext.Provider
            value={{
                appState,
                dispatch,
                setLanguage,
                setCurrentPrice,
                setChains,
                setActiveValidators,
                setInactiveValidators
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