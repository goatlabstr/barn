const getWebsocketUrl = () =>{
    let _url = window.location.hostname;
    let _protocol = window.location.protocol.split(":")[0];

    if (_protocol === "https") {
        _url = "wss://" + _url;
    }
    else if (_protocol === "http") {
        _url = "ws://" + _url;
    }


    return _url + "/websocket";
}

export {getWebsocketUrl}