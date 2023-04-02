import {SigningStargateClient} from '@cosmjs/stargate';
import {makeSignDoc} from '@cosmjs/amino';
import {config} from "../constants/networkConfig";

const restUrl = config.REST_URL;
const rpcUrl = config.RPC_URL;
const stakingUrl = config.STAKING_URL;
const features = config.FEATURES;

export enum BroadcastMode {
    /** Return after tx commit */
    Block = "block",
    /** Return afer CheckTx */
    Sync = "sync",
    /** Return right away */
    Async = "async",
}

const chainConfig = (chainId,
                     chainName,
                     coinDenom,
                     coinMinimalDenom,
                     coinDecimals,
                     coinType,
                     prefix,
                     coinGeckoId,
                     fee) => ({
    chainId: chainId,
    chainName,
    rpc: rpcUrl,
    rest: restUrl,
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
    coinType: coinType,
    gasPriceStep: {
        low: fee.low_gas_price,
        average: fee.average_gas_price,
        high: fee.high_gas_price,
    },
    features: features,
    walletUrlForStaking: stakingUrl,
});

const getSignStargateClient = async (chainId, keplr) => {
    //@ts-ignore
    // await keplr && keplr.enable(chainId);
    //@ts-ignore
    const offlineSigner = await keplr.getOfflineSignerOnlyAmino(chainId);
    return await SigningStargateClient.connectWithSigner(
        rpcUrl,
        offlineSigner,
    );
}

export const initializeChain = (chain, keplr, connectionType, cb) => {
    (async () => {
            const {
                chain_id,
                chain_name,
                symbol,
                denom,
                decimals,
                slip44,
                bech32_prefix,
                coingecko_id,
                fees
            } = chain;

            const filteredFee = fees?.fee_tokens?.filter(ft => ft?.denom === denom);
            let fee;
            if(filteredFee.length === 1)
                fee = filteredFee[0];
            else
                fee = {
                    "denom": denom,
                    "fixed_min_gas_price": config.DEFAULT_GAS,
                    "low_gas_price": config.GAS_PRICE_STEP_LOW,
                    "average_gas_price": config.GAS_PRICE_STEP_AVERAGE,
                    "high_gas_price": config.GAS_PRICE_STEP_HIGH
                }

            //@ts-ignore
            if (!keplr) {
                const error = 'Please install keplr extension';
                cb(error);
                //@ts-ignore
            } else if (connectionType === "extension") {
                if (keplr.experimentalSuggestChain) {
                    try {
                        //@ts-ignore
                        await keplr.experimentalSuggestChain(chainConfig(
                            chain_id,
                            chain_name,
                            symbol,
                            denom,
                            decimals,
                            slip44,
                            bech32_prefix,
                            coingecko_id,
                            fee));
                    } catch (error) {
                        const chainError = 'Failed to suggest the chain';
                        cb(chainError);
                    }
                } else {
                    const versionError = 'Please use the recent version of keplr extension';
                    cb(versionError);
                }
            }

            if (keplr) {
                //@ts-ignore
                await keplr.enable(chain_id);
                //@ts-ignore
                const offlineSigner = await keplr.getOfflineSignerOnlyAmino(chain_id);
                const accounts = await offlineSigner.getAccounts();
                cb(null, accounts);
            }
        }
    )();
};


export const signTxAndBroadcast = (keplr, chainId, tx, address, cb) => {
    (async () => {
        const client = await getSignStargateClient(chainId, keplr);
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

export const getStakedBalance = (keplr, chainId, address, cb) => {
    (async () => {
        const client = await getSignStargateClient(chainId, keplr);
        client.getBalanceStaked(address).then((result) => {
            cb(null, result);
        }).catch((error) => {
            cb(error && error.message);
        });
    })();

}

export const getAllBalances = (keplr, chainId, address, cb) => {
    if(localStorage.getItem("auto_connect_active") === "true" && keplr && chainId)
        (async () => {
            const client = await getSignStargateClient(chainId, keplr);
            client.getAllBalances(address).then((result) => {
                cb(null, result);
            }).catch((error) => {
                cb(error && error.message);
            });
        })();
}

export const getKeplrFromWindow: () => Promise<any> = async () => {
    if (typeof window === "undefined") {
        return undefined;
    }

    //@ts-ignore
    if (window.keplr) {
        //@ts-ignore
        return window.keplr;
    }

    if (document.readyState === "complete") {
        //@ts-ignore
        return window.keplr;
    }

    return new Promise((resolve) => {
        const documentStateChange = (event: Event) => {
            if (
                event.target &&
                (event.target as Document).readyState === "complete"
            ) {
                //@ts-ignore
                resolve(window.keplr);
                document.removeEventListener("readystatechange", documentStateChange);
            }
        };

        document.addEventListener("readystatechange", documentStateChange);
    });
};

export const aminoSignTx = (keplr, chainId, tx, address, cb) => {
    (async () => {
        //@ts-ignore
        const offlineSigner = keplr.getOfflineSignerOnlyAmino && await keplr.getOfflineSignerOnlyAmino(chainId);
        const client = await getSignStargateClient(chainId, keplr);

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
