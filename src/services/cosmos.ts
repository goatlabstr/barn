import {REST_URL, RPC_URL} from '../constants/endpoints';
import {SigningStargateClient} from '@cosmjs/stargate';
import {makeSignDoc} from '@cosmjs/amino';
import {config} from '../constants/networkConfig';

const chainId = config.CHAIN_ID;
const chainName = config.CHAIN_NAME;
const coinDenom = config.COIN_DENOM;
const coinMinimalDenom = config.COIN_MINIMAL_DENOM;
const coinDecimals = config.COIN_DECIMALS;
const prefix = config.PREFIX;
const coinGeckoId = config.COINGECKO_ID;

const chainConfig = {
    chainId: chainId,
    chainName,
    rpc: RPC_URL,
    rest: REST_URL,
    stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
        coinGeckoId,
    },
    bip44: {
        coinType: 118,
    },
    bech32Config: {
        bech32PrefixAccAddr: `${prefix}`,
        bech32PrefixAccPub: `${prefix}pub`,
        bech32PrefixValAddr: `${prefix}valoper`,
        bech32PrefixValPub: `${prefix}valoperpub`,
        bech32PrefixConsAddr: `${prefix}valcons`,
        bech32PrefixConsPub: `${prefix}valconspub`,
    },
    currencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
        },
    ],
    feeCurrencies: [
        {
            coinDenom,
            coinMinimalDenom,
            coinDecimals,
            coinGeckoId,
        },
    ],
    coinType: config.COIN_TYPE,
    gasPriceStep: {
        low: config.GAS_PRICE_STEP_LOW,
        average: config.GAS_PRICE_STEP_AVERAGE,
        high: config.GAS_PRICE_STEP_HIGH,
    },
    features: config.FEATURES,
    walletUrlForStaking: config.STAKING_URL,
};

const getSignStargateClient = async () => {
    //@ts-ignore
    await window.keplr && window.keplr.enable(chainId);
    //@ts-ignore
    const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
    return await SigningStargateClient.connectWithSigner(
        RPC_URL,
        offlineSigner,
    );
}

export const initializeChain = (cb) => {
    (async () => {
        //@ts-ignore
        if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
            const error = 'Please install keplr extension';
            cb(error);
        } else {
            //@ts-ignore
            if (window.keplr.experimentalSuggestChain) {
                try {
                    //@ts-ignore
                    await window.keplr.experimentalSuggestChain(chainConfig);
                } catch (error) {
                    const chainError = 'Failed to suggest the chain';
                    cb(chainError);
                }
            } else {
                const versionError = 'Please use the recent version of keplr extension';
                cb(versionError);
            }
        }

        //@ts-ignore
        if (window.keplr) {
            //@ts-ignore
            await window.keplr.enable(chainId);

            //@ts-ignore
            const offlineSigner = window.getOfflineSignerOnlyAmino(chainId);
            const accounts = await offlineSigner.getAccounts();
            cb(null, accounts);
        } else {
            return null;
        }
    })();
};


export const signTxAndBroadcast = (tx, address, cb) => {
    (async () => {
        const client = await getSignStargateClient();
        client.signAndBroadcast(
            address,
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            tx.memo,
        ).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                //@ts-ignore
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};

export const getStakedBalance = (address, cb) => {
    (async () => {
        const client = await getSignStargateClient();
        client.getBalanceStaked(address).then((result) => {
            cb(null, result);
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
}

export const getAllBalances = (address, cb) => {
    (async () => {
        const client = await getSignStargateClient();
        client.getAllBalances(address).then((result) => {
            cb(null, result);
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
}

export const aminoSignTx = (tx, address, cb) => {
    (async () => {
        //@ts-ignore
        const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
        const client = await getSignStargateClient();

        const account = {};
        try {
            const {
                accountNumber,
                sequence,
            } = await client.getSequence(address);
            //@ts-ignore
            account.accountNumber = accountNumber;
            //@ts-ignore
            account.sequence = sequence;
        } catch (e) {
            //@ts-ignore
            account.accountNumber = 0;
            //@ts-ignore
            account.sequence = 0;
        }
        const signDoc = makeSignDoc(
            tx.msgs ? tx.msgs : [tx.msg],
            tx.fee,
            chainId,
            tx.memo,
            //@ts-ignore
            account.accountNumber,
            //@ts-ignore
            account.sequence,
        );

        offlineSigner.signAmino(address, signDoc).then((result) => {
            if (result && result.code !== undefined && result.code !== 0) {
                cb(result.log || result.rawLog);
            } else {
                cb(null, result);
            }
        }).catch((error) => {
            cb(error && error.message);
        });
    })();
};
