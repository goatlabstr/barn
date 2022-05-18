/* eslint-disable */
import React, {Dispatch, FunctionComponent, useCallback} from "react";

type AppState = {
    language: string,
    drawerOpen: boolean,
    user: {} | null
};

const initialState: AppState = {
    language: localStorage.getItem("lang")?.split("_")[0] || "en",
    drawerOpen: false,
    user: null
};

export const AppStateContext = React.createContext<{
    appState: AppState;
    dispatch: Dispatch<any>;
    setLanguage: (data: string) => void;
    setDrawerOpenStatus: (open: boolean) => void;
    setUser: (data: {}) => void;
}>({
    appState: initialState,
    dispatch: () => {
        console.log("not implemented");
    },
    setLanguage: (lang: string) => {
        console.log("not implemented");
    },
    setDrawerOpenStatus: (open: boolean) => {
        console.log("not implemented");
    },
    setUser: (user: {}) => {
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
        case "HANDLE_DRAWER_OPEN":
            return {
                ...appState,
                drawerOpen: action.payload,
            };
        case "SET_USER":
            return {
                ...appState,
                user: action.payload,
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

    const setDrawerOpenStatus = useCallback((open: boolean) => {
        dispatch({type: "HANDLE_DRAWER_OPEN", payload: open || false});
    }, [appState]);

    const setUser = useCallback((user: {}) => {
        dispatch({type: "SET_USER", payload: user || null});
    }, [appState]);


    return (
        <AppStateContext.Provider
            value={{
                appState,
                dispatch,
                setLanguage,
                setDrawerOpenStatus,
                setUser
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