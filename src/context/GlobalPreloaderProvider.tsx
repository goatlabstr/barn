import React, {FunctionComponent, PropsWithChildren, useCallback, useState} from "react";

import {CircularProgress, LinearProgress} from "@mui/material";

const PreloaderContext = React.createContext<{
    activate: () => void,
    passivate: () => void,
    loading: boolean
}>({
    activate: () => {
        console.log("not implemented");
    },
    passivate: () => {
        console.log("not implemented");
    },
    loading: false
});

interface GlobalPreloaderProps extends PropsWithChildren<any> {
    size?: number,
    color?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined,
    opacity?: number,
    thickness?: number,
    type?: "circular" | "linear"
}

const GlobalPreloaderProvider: FunctionComponent = ({children, size = 41, color = 'warning', opacity = 0.1, thickness = 2.5, type = "linear"}: GlobalPreloaderProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const activate = useCallback(() => {
        setLoading(true);
    }, [loading]);

    const passivate = useCallback(() => {
        setLoading(false);
    }, [loading]);


    return (
        <PreloaderContext.Provider value={{
            loading,
            activate,
            passivate
        }}>
            {loading ?
                <>
                    {type === "circular" ? <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            zIndex: 1202
                        }}>
                            <CircularProgress thickness={thickness} color={color} size={size}/>
                        </div> :
                        <div style={{
                            position: "absolute",
                            width: "100%",
                            top: 0,
                            left: 0,
                            zIndex: 1202
                        }}>
                            <LinearProgress style={{height: thickness}} color={color} />
                        </div>}
                    <div style={{
                        opacity: opacity,
                        top: 0,
                        left: 0,
                        background: "#000",
                        zIndex: 1201,
                        height: "100%",
                        width: "100%",
                        position: "fixed"
                    }}/>
                </> : ""}
            {children}
        </PreloaderContext.Provider>
    )
}
const useGlobalPreloader = () => {
    const context = React.useContext(PreloaderContext);
    if (context === undefined) {
        throw new Error("useGlobalPreloader must be used within a GlobalPreloaderProvider");
    }

    return context;
}

export default GlobalPreloaderProvider;
export {useGlobalPreloader};