/* eslint-disable no-unused-vars */
const IdentityProvider = require('orbit-db-identity-provider');
const algoSDK = require('algosdk');

const type = 'algorand';

class algoIdentityProvider extends IdentityProvider {
  constructor(options) {
    super(options);
    this.algoAccount = options.algoAccount; // Algorand SDK Account
    this.Txn = options.algoTxn;
  }

  static get type() {
    return type;
  }

  async getId() {
    if (!this.algoAccount) {
      throw new Error('Algorand Wallet is required');
    }

    return this.algoAccount;
  }

  async signIdentity(data, options = {}) {
    if (!this.algoAccount) {
      throw new Error('Algorand Wallet is required');
    }

    const txn64 = await window.AlgoSigner.encoding.msgpackToBase64(this.Txn.toByte());
    const signedTxn = await window.AlgoSigner.signTxn([
      { txn: txn64 },
    ]);

    const binarySignedTx = signedTxn[0].blob;

    return binarySignedTx;
  }

  static async verifyIdentity(identity) {
    algoSDK.verifyBytes(identity, this.algoAccount);
  }
}

module.exports = algoIdentityProvider;
