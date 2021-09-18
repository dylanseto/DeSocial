import * as algosdk from 'algosdk';
import { Byte, Int } from 'algosdk';
import * as IPFS from 'ipfs';
import * as config from './config/algoConfig';
import * as SocialPost from './SocialTypes';
import { escrowTealAddress, createPostTealAddress } from '../../contracts/lib/contracts';

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

        // we loop over the results because 'add' supports multiple
        // additions, but we only added one entry here so we only see
        // one log line in the output
        results.forEach((cid) => {
          // CID (Content IDentifier) uniquely addresses the data
          // and can be used to get it again.
          console.log(cid.toString());

          // TODO: Store on algorand

          // The Create Post Smart Contract has three transactions
          // In a single atomic transfer:
          // 1. Create Post
          const params = this.algodclient.getTransactionParams().do();

          const createPostTxn = this.algodclient.makeAssetCreateTxnWithSuggestedParams(
            escrowTealAddress, // Sender
            Byte(''), // Note
            Int(1), // total
            Int(0), // Decimal
            Int(0), // Default Frozen
            createPostTealAddress, // Manager
            escrowTealAddress, // Reserve
            escrowTealAddress, // Freeze
            escrowTealAddress, // Clawback
            Byte(''), // Unit Name
            Byte('Post'), // Asset Name
            Byte(''), // Asset URL
            Byte(cid.toString()), // Metadata
            params, // Parameters
          );
          // this.algodClient.AssetConfigTxn()
          // 2. Transfer Post
          // 3. Freeze Post
          createPostTxn.toString();
        });
        return true;
      }
      return false;
    },
  },
};
