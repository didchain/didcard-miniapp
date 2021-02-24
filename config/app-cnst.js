const STORAGE_KEYS = {
  INITIALIZED_BKEY: 'InitializedBKey',
  HAS_BACKED_UP_BKEY: 'HasBakedUpBKey',
  WALLET_ADDR_SKEY: 'WalletAddressKey',
  WALLET_V3_OKEY: 'WalletKeystoreKey',
  SHORT_SECRET_OKEY: 'ShortSecretKey',
};
const weaccConfig = { idPrefix: 'Did', remembered: true, useSigned: true };

module.exports = {
  APP_NAME: '易ID', //腰牌
  storeCnsts: STORAGE_KEYS,
};
