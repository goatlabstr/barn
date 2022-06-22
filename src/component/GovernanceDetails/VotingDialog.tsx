import React, {useEffect, useState} from "react";

import {Theme} from "@mui/material/styles";

import {
    Button,
    Divider,
    DialogContent,
    DialogActions, Stack, FormControl, RadioGroup, FormControlLabel, Radio
}
    from "@mui/material";
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@mui/styles";
import {useDialog} from "../../context/DialogContext/DialogContext";
import {useAppDispatch, useAppSelector} from "../../customHooks/hook";
import {useGlobalPreloader} from "../../context/GlobalPreloaderProvider";
import {getAllBalances, signTxAndBroadcast} from "../../services/cosmos";
import {gas} from "../../constants/defaultGasFees";
import {config} from "../../constants/networkConfig";
import allActions from "../../action";

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        marginLeft: theme.spacing(2)
    },
    content: {
        margin: theme.spacing(1)
    },
    progress: {
        marginRight: theme.spacing(1)
    }
}));

export default function VotingDialog({proposal}) {
    const classes = useStyles();
    const {closeDialog} = useDialog();
    const {enqueueSnackbar} = useSnackbar();
    const {activate, passivate} = useGlobalPreloader();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const [voteValue, setVoteValue] = useState(null);

    const address = useAppSelector(state => state.accounts.address.value);

    const updateBalance = (id) => {
        getAllBalances(address,(err, data) => dispatch(allActions.getBalance(err,data)));
        dispatch(allActions.fetchVestingBalance(id));
        dispatch(allActions.fetchVoteDetails(id, address));
        dispatch(allActions.fetchProposalTally(address));
    }

    const handleChange = (event) => {
        setVoteValue(event.target.value);
    };

    const handleApplyButton = () => {
        activate();

        const option = voteValue === 'Yes' ? 1
            : voteValue === 'Abstain' ? 2
                : voteValue === 'No' ? 3
                    : voteValue === 'NoWithVeto' ? 4 : null;

        const tx = {
            msgs: [{
                typeUrl: '/cosmos.gov.v1beta1.MsgVote',
                value: {
                    option: option,
                    proposalId: proposal?.id,
                    voter: address,
                },
            }],
            fee: {
                amount: [{
                    amount: String(gas.vote * config.GAS_PRICE_STEP_AVERAGE),
                    denom: config.COIN_MINIMAL_DENOM,
                }],
                gas: String(gas.vote),
            },
            memo: '',
        };

        signTxAndBroadcast(tx, address, (error, result) => {
            passivate();
            if (error) {
                enqueueSnackbar(error, {variant: "error"});
                return;
            }
            if (result) {
                enqueueSnackbar(result?.transactionHash, {variant: "success"});
                updateBalance(proposal?.id);
            }
        });
        closeDialog();
    };

    return (
        <>
            <Divider/>
            <DialogContent className={classes.content}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="voting-proposal-label"
                        defaultValue="vote"
                        name="voting-proposal-button-group"
                        value={voteValue}
                        onChange={handleChange}
                    >
                        <FormControlLabel control={<Radio/>} label="Yes" value="Yes"/>
                        <FormControlLabel control={<Radio/>} label="No" value="No"/>
                        <FormControlLabel control={<Radio/>} label="NoWithVeto" value="NoWithVeto"/>
                        <FormControlLabel control={<Radio/>} label="Abstain" value="Abstain"/>
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <Divider/>
            <DialogActions>
                <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    onClick={closeDialog}
                >
                    {t("cancel")}
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={voteValue == null}
                    onClick={handleApplyButton}
                >
                    {t("vote")}
                </Button>
            </DialogActions>
        </>
    );

}
