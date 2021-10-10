/* eslint-disable new-parens */
import * as algosdk from 'algosdk';
import { LogicSigAccount } from 'algosdk';
import * as IPFS from 'ipfs';
import axios from 'axios';
import * as config from './config/algoConfig';
import SocialPost from './SocialTypes/SocialPosts';
import SocialAccount from './SocialTypes/SocialAccount';
import { escrowTealAddress, createPostAppID } from '../contracts/lib/contracts_post_config';
import { createAccountAppID } from '../contracts/lib/contracts_account_config';

export default {
  data: {
    algodClient: null,
    algoIndexer: null,
    ipfsClient: null,
  },
  methods: {
    /**
     * Checks if AlgoSigner Extension is installed.
     * @returns True if installed. False otherwise.
     */
    isAlgoSignerInstalled() {
      if (typeof AlgoSigner !== 'undefined') {
        return true;
      }
      return false;
    },
    /**
     * Attempts to connect to the Algorand and IPFS Networks.
     * @returns True if successful. False Otherwise.
     */
    async initializeClient() {
      let res = false;
      if (!this.isAlgoSignerInstalled()) {
        return false;
      }

      // Connect to AlgoSigner
      await window.AlgoSigner.connect()
        .then(() => {
          res = true;
        })
        .catch((e) => {
          console.error(e);
          res = false;
        });

      // Connect to Algorand Network using the Algorand SDK
      this.algodClient = new algosdk.Algodv2(config.token, config.server, config.port);

      await this.algodClient.healthCheck().do()
        .then(() => {
          res = (res && true);
        })
        .catch((e) => {
          console.error(e);
          res = false;
        });

      // Creae an IPFS node
      this.ipfsClient = await IPFS.create();

      this.algoIndexer = new algosdk.Indexer(config.token,
        config.indexerServer,
        config.indexerPort);

      this.getPosts();

      return res;
    },
    async createAccount(name, email) {
      const account = new SocialAccount(name, email);
      if (account instanceof SocialAccount) {
        const results = await this.ipfsClient.addAll(JSON.stringify(account));

        const next = await results.next();
        const cid = next.value.path;
        const url = `https://ipfs.io/ipfs/${cid.toString()}`;

        // Eventually have the user choose which account to register with.
        const addressBook = await window.AlgoSigner.accounts({ ledger: 'TestNet' });

        const createAccountAppTxnParams = await this.algodClient.getTransactionParams().do();

        const createAccountAppTxnargs = [];
        createAccountAppTxnargs.push(new Uint8Array(Buffer.from('create_account')));
        createAccountAppTxnargs.push(new Uint8Array(Buffer.from(url)));
        const createAccountAppTxn = await algosdk.makeApplicationOptInTxn(
          addressBook[0].address,
          createAccountAppTxnParams,
          createAccountAppID,
          createAccountAppTxnargs,
        );
        const createAccounttxnB64 = window.AlgoSigner.encoding.msgpackToBase64(
          createAccountAppTxn.toByte(),
        );
        const signedCreateAccountTx = await window.AlgoSigner.signTxn([
          { txn: createAccounttxnB64 },
        ]);
        const signedCreateAccountTxConverted = window.AlgoSigner.encoding.base64ToMsgpack(
          signedCreateAccountTx[1].blob,
        );

        await this.algodClient.sendRawTransaction([
          signedCreateAccountTxConverted]).do();
      }
    },
    /**
         * Uplaods a post to IPFS and submits the link
         * to the Algorand Blockchain as an NFT
         */
    async createPost(name, text) {
      const post = new SocialPost(name, text);

      if (post instanceof SocialPost) {
        // const data = 'Dylan test data'

        // add your data to to IPFS - this can be a string, a Buffer,
        // a stream of Buffers, etc
        const results = await this.ipfsClient.addAll(JSON.stringify(post));

        let next = await results.next();

        // we loop over the results because 'add' supports multiple
        // additions, but we only added one entry here so we only see
        // one log line in the output

        // CID (Content Identifier) uniquely addresses the data
        // and can be used to get it again.
        const cid = next.value.path;

        // The Create Post Smart Contract has three transactions
        // In a single atomic transfer:
        // 1. Create Post
        const createPostAppTxnParams = await this.algodClient.getTransactionParams().do();

        const createPostAppTxnargs = [];
        createPostAppTxnargs.push(new Uint8Array(Buffer.from('create_post')));
        const addressBook = await window.AlgoSigner.accounts({ ledger: 'TestNet' });
        const createPostAppTxn = await algosdk.makeApplicationNoOpTxn(
          addressBook[0].address,
          createPostAppTxnParams,
          createPostAppID,
          createPostAppTxnargs,
        );

        const escrowParams = await this.algodClient.getTransactionParams().do();
        const escrowAccountArgs = [];
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        const escrowAccount = new Uint8Array(Buffer.from(escrowTealAddress, 'base64')); // Get Lsign Address
        const lsigAddress = new LogicSigAccount(
          escrowAccount,
          escrowAccountArgs,
        );

        const url = `https://ipfs.io/ipfs/${cid.toString()}`;
        const metadata = new Uint8Array(cid);
        const createPostTxn = await algosdk.makeAssetCreateTxnWithSuggestedParams(
          lsigAddress.address(), // Sender
          undefined, // Note
          1, // total
          0, // Decimal
          false, // Default Frozen
          lsigAddress.address(), // Manager
          lsigAddress.address(), // Reserve
          lsigAddress.address(), // Freeze
          lsigAddress.address(), // Clawback
          'asa_post', // Unit Name
          'asa_post', // Asset Name
          url, // Asset URL
          metadata, // Metadata
          escrowParams, // Parameters
        );
        // Group both transactions
        const group = [createPostAppTxn, createPostTxn];
        algosdk.assignGroupID(group);

        // Sign Trasactions
        const txnB64 = window.AlgoSigner.encoding.msgpackToBase64(createPostAppTxn.toByte());
        const signedTx1 = await window.AlgoSigner.signTxn([{ txn: txnB64 }]);
        const signedTx1Converted = window.AlgoSigner.encoding.base64ToMsgpack(signedTx1[0].blob);
        const signedTx2 = algosdk.signLogicSigTransactionObject(createPostTxn, lsigAddress);

        await this.algodClient.sendRawTransaction([signedTx1Converted, signedTx2.blob]).do();
        // 2. Transfer Post
        // 3. Freeze Post
        // Group Transactions

        next = results.next();
      }
      return false;
    },
    async getPosts() {
      const escrowAccount = new Uint8Array(Buffer.from(escrowTealAddress, 'base64')); // Get Lsign Address
      const lsigAccount = new LogicSigAccount(
        escrowAccount,
      );
      const address = lsigAccount.address();
      const txnType = 'acfg';
      const response = await this.algoIndexer.searchForTransactions()
        .address(address)
        .txType(txnType).do();

      const results = [];
      for (let i = 0, len = response.transactions.length; i < len; i += 1) {
        const txn = response.transactions[i];
        const file = this.getPost(txn['asset-config-transaction'].params.url);
        results.push(file);
      }
      const posts = await Promise.all(results);
      return posts;
    },
    async getPost(url) {
      let data = null;
      try {
        await axios.get(url)
          .then((res) => {
            data = res.data;
          });
        return data;
      } catch (error) {
        console.log(error);
        return data;
      }
    },
  },
};
