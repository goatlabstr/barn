import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {store} from './store'
import './polyfill';
import Common from "./services/axios/common";

(function () {
    if (sessionStorage.getItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration") === undefined)
        Common.getConfig().then(res => {
            sessionStorage.setItem(window.location.hostname.split(".goatlabs.zone")[0] + "-barn-configuration",
                JSON.stringify(res.data));
        })
})()

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
