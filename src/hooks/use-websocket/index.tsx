import React, {Dispatch, FunctionComponent, useEffect} from "react";
import {CompatClient, IFrame, IMessage, Stomp, StompSocketState} from "@stomp/stompjs";
import {useSnackbar} from "notistack";

export interface Topics {
    name: string,
    callback: (event: IMessage) => any
}

interface WebSocketProvider {
    URL: string
}

let instance: CompatClient;

type WebsocketState = {
    status: StompSocketState
};

const initialState: WebsocketState = {
    status: StompSocketState.CLOSED
};

export const Index = React.createContext<{
    websocketState: WebsocketState;
    dispatch: Dispatch<any>;
    subscribe: (topics: Array<Topics>) => void;
}>({
    websocketState: initialState,
    dispatch: () => {
        console.log("not implemented");
    },
    subscribe: ([]) => {
        console.log("not implemented");
    }
});

const reducer = (state: WebsocketState, action: any) => {
    switch (action.type) {
        case "SET_STATUS": {
            return {
                ...state,
                status: action.payload
            };
        }
        default:
            return state;
    }
};

const WebsocketStateProvider: FunctionComponent<WebSocketProvider> = ({children, URL}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [websocketState, dispatch] = React.useReducer(reducer, initialState);

    const createInstance = () => {
        if (!instance) {
            instance = Stomp.over(() => new WebSocket((URL)));
            instance.reconnect_delay = 5000;

            instance.connect(
                {},
                (frame: IFrame) => {
                    enqueueSnackbar('Connected Websocket', {variant: "info"});
                    dispatch({type: "SET_STATUS", payload: instance.state});
                },
                (err: IFrame) => {
                    enqueueSnackbar('Cannot Connect Websocket', {variant: "warning"})
                    dispatch({type: "SET_STATUS", payload: instance.state});
                },
                (frame: IFrame) => {
                    enqueueSnackbar('Disconnected Websocket', {variant: "info"})
                    dispatch({type: "SET_STATUS", payload: instance.state});
                }
            );
        }
    };

    const subscribe = (topics: Array<Topics>) => {
        if (instance) {
            topics.forEach((topic: Topics) => {
                instance.subscribe(topic.name, topic.callback);
            })
        } else {
            createInstance();
        }
    };

    useEffect(() => {
        createInstance();
    }, []);

    return (
        <Index.Provider
            value={{
                websocketState,
                dispatch,
                subscribe
            }}
        >
            {children}
        </Index.Provider>
    );
};

const useWebsocket = () => {
    const context = React.useContext(Index);
    if (context === undefined) {
        throw new Error(
            "useWebsocketState must be used within a WebsocketStateProvider"
        );
    }

    return context;
};

export {WebsocketStateProvider, useWebsocket};
