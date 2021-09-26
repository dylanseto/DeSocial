import * as algosdk from 'algosdk';
import { LogicSigAccount } from 'algosdk';
import * as IPFS from 'ipfs';
import * as config from './config/algoConfig';
import SocialPost from './SocialTypes';
import { escrowTealAddress, createPostAppID } from '../../contracts/lib/contracts';

export default {
  data: {
    algodClient: null,
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
        .then((d) => {
          console.log(JSON.stringify(d));
          res = (res && true);
        })
        .catch((e) => {
          console.error(e);
          res = false;
        });

      // Creae an IPFS node
      this.ipfsClient = await IPFS.create();

      return res;
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
        const params = await this.algodClient.getTransactionParams().do();
        console.log(JSON.stringify(params));

        // we loop over the results because 'add' supports multiple
        // additions, but we only added one entry here so we only see
        // one log line in the output

        // CID (Content Identifier) uniquely addresses the data
        // and can be used to get it again.
        const cid = next.value.path;
        console.log(cid);

        // TODO: Store on algorand

        // The Create Post Smart Contract has three transactions
        // In a single atomic transfer:
        // 1. Create Post
        const createPostAppTxnargs = [];
        createPostAppTxnargs.push(new Uint8Array(Buffer.from('create_post')));
        const addressBook = await window.AlgoSigner.accounts({ ledger: 'TestNet' });
        const createPostAppTxn = await algosdk.makeApplicationNoOpTxn(
          addressBook[0].address,
          params,
          createPostAppID,
          createPostAppTxnargs,
        );

        const escrowAccountArgs = [];
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        escrowAccountArgs.push(algosdk.encodeUint64(1));
        const escrowAccount = new Uint8Array(Buffer.from(escrowTealAddress, 'base64')); // Get Lsign Address
        const lsigAddress = new LogicSigAccount(
          escrowAccount,
          escrowAccountArgs,
        );

        console.log(JSON.stringify(JSON.stringify(escrowAccountArgs)));

        const url = `https://ipfs.io/ipfs/, ${cid.toString()}`;
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
          'Post', // Unit Name
          'Post', // Asset Name
          url, // Asset URL
          metadata, // Metadata
          params, // Parameters
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
  },
};
