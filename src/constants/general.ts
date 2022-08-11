export const GeneralConstants = {
    mainContent: {
        width: "90%"
    }
}

export const kvStorePrefix = "keplr_wallet_connect"

export const localStorageClearWithPrefix = (prefix) => {
    const arr = []; // Array to hold the keys
    for (let i = 0; i < localStorage.length; i++) {
        // @ts-ignore
        if (localStorage.key(i).startsWith(prefix)) {
            // @ts-ignore
            arr.push(localStorage.key(i));
        }
    }

// Iterate over arr and remove the items by key
    for (let i = 0; i < arr.length; i++) {
        localStorage.removeItem(arr[i]);
    }
}