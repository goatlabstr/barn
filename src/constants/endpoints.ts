import {config} from "./networkConfig";

const REST_URL = config.REST_URL;

const STAKING_PATH = "/cosmos/staking/v1beta1";
const BANK_PATH = "/cosmos/bank/v1beta1";
const GOV_PATH = "/cosmos/gov/v1beta1";
const DISTRIBUTION_PATH = "/cosmos/distribution/v1beta1";

export const urlFetchDelegations = (address) => `${REST_URL}${STAKING_PATH}/delegations/${address}`;
export const urlFetchBalance = (address) => `${REST_URL}${BANK_PATH}/balances/${address}`;
export const urlFetchVestingBalance = (address) => `${REST_URL}/auth/accounts/${address}`;
export const urlFetchUnBondingDelegations = (address) => `${REST_URL}${STAKING_PATH}/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (address) => `${REST_URL}${DISTRIBUTION_PATH}/delegators/${address}/rewards`;
export const urlFetchVoteDetails = (proposalId, address) => `${REST_URL}${GOV_PATH}/proposals/${proposalId}/votes/${address}`;

export const getValidatorURL = (address) => `${REST_URL}${STAKING_PATH}/validators/${address}`;
export const PROPOSALS_LIST_URL = () => `${REST_URL}${GOV_PATH}/proposals`;
export const getDelegatedValidatorsURL = (address) => `${REST_URL}${STAKING_PATH}/delegators/${address}/validators`;
export const urlFetchProposalVotes = (id) => `${REST_URL}${GOV_PATH}/proposals/${id}/votes`;
export const urlFetchTallyDetails = (id) => `${REST_URL}${GOV_PATH}/proposals/${id}/tally`;
export const urlFetchProposalDetails = (id) => `${REST_URL}/txs?message.module=governance&submit_proposal.proposal_id=${id}`;

export const validatorImageURL = (id) => `https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${id}`;
