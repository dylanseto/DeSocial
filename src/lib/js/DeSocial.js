/* eslint-disable new-parens */
import * as algosdk from 'algosdk';
import * as IPFS from 'ipfs';
import axios from 'axios';
import * as Identities from 'orbit-db-identity-provider';
import OrbitDB from 'orbit-db';
import * as config from './config/algoConfig';
import SocialPost from './SocialTypes/SocialPosts';
import SocialAccount from './SocialTypes/SocialAccount';
import AccountList from './SocialTypes/AccountList';
import { createAccountAppID } from '../contracts/lib/contracts_account_config';

const Keystore = require('orbit-db-keystore');
const algoIdentityProvider = require('./Identity/algo-identity-provider');

require('../../wasm/wasm_exec');

export default {
  data: {
    algodClient: null,
    algoIndexer: null,
    ipfsClient: null,
    selectedAddresss: null,
    selectedAccountInfo: null,
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

      return res;
    },
    async createAccount(name, email) {
      const ks = await new Keystore();
      const key = await ks.getKey(this.selectedAddresss)
      || await ks.createKey(this.selectedAddresss);
      const idSignature = await ks.sign(key, this.selectedAddresss);

      const txnParams = await this.algodClient.getTransactionParams().do();

      const identityTxn = await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.selectedAddresss,
        to: this.selectedAddresss,
        amount: 0,
        note: algosdk.encodeObj(idSignature.toString()),
        suggestedParams: txnParams,
      });

      await Identities.addIdentityProvider(algoIdentityProvider);
      const id = await Identities.createIdentity({
        type: 'algorand',
        keystore: ks,
        algoAccount: this.selectedAddresss,
        algoTxn: identityTxn,
      });

      const orbitdb = await OrbitDB.createInstance(this.ipfsClient, { identity: id });
      const postsDb = await orbitdb.feed('posts');

      const postsDatabase = postsDb.address.toString();

      this.selectedAccountInfo = new SocialAccount(name, email, postsDatabase);
      if (this.selectedAccountInfo instanceof SocialAccount && this.selectedAddresss) {
        const results = await this.ipfsClient.addAll(JSON.stringify(this.selectedAccountInfo));

        const next = await results.next();
        const cid = next.value.path;
        const url = `https://ipfs.io/ipfs/${cid.toString()}`;

        const createAccountAppTxnParams = await this.algodClient.getTransactionParams().do();

        const createAccountAppTxnargs = [];
        createAccountAppTxnargs.push(new Uint8Array(Buffer.from('create_account')));
        createAccountAppTxnargs.push(new Uint8Array(Buffer.from(url)));
        const createAccountAppTxn = await algosdk.makeApplicationOptInTxn(
          this.selectedAddresss,
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
          signedCreateAccountTx[0].blob,
        );

        await this.algodClient.sendRawTransaction([
          signedCreateAccountTxConverted]).do();
      }
    },
    /**
      * Uplaods a post to OrbitDB
      */
    async createPost(name, text) {
      if (!this.selectedAccountInfo) {
        this.selectedAccountInfo = await this.getAccountInfo(this.selectedAddresss);
      }

      const post = new SocialPost(name, text);

      if (post instanceof SocialPost && this.selectedAddresss) {
        const orbitdb = await OrbitDB.createInstance(this.ipfsClient);
        // TODO: Each User will have their own OrbitDB database.
        const addr = await OrbitDB.parseAddress(this.selectedAccountInfo.postDb);
        const postsDb = await orbitdb.feed(addr);

        await postsDb.load();
        await postsDb.add(post);
        return true;
      }

      return false;
    },
    async getPosts() {
      if (!this.selectedAccountInfo) {
        this.selectedAccountInfo = await this.getAccountInfo(this.selectedAddresss);
      }
      const orbitdb = await OrbitDB.createInstance(this.ipfsClient);
      const addr = await OrbitDB.parseAddress(this.selectedAccountInfo.postDb);

      const postsDb = await orbitdb.feed(addr);
      await postsDb.load();
      const result = postsDb.iterator({
        limit: 10,
        reverse: true,
      })
        .collect();
      const mappedValues = result.map((e) => e.payload.value);
      return mappedValues;
    },
    async getAccountsInfo() {
      try {
        const addressBook = await window.AlgoSigner.accounts({ ledger: 'TestNet' });
        const accounts = [];
        for (let i = 0, len = addressBook.length; i < len; i += 1) {
          if (addressBook[i].address) {
            const accountItem = this.getAccountListInfo(addressBook[i].address);
            accounts.push(accountItem);
          }
        }
        const accountsInfo = await Promise.all(accounts);

        return accountsInfo;
      } catch {
        await this.sleep(1000);
        return this.getAccountListInfo();
      }
    },
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async getAccountListInfo(address) {
      try {
        const accInfoString = await this.isAccountRegistered(address);
        const accInfo = JSON.parse(accInfoString);
        let name = 'N/A';
        if (accInfo.Registered) {
          const accInfoJson = await this.fetchIPFS(accInfo.Url);
          try {
            name = accInfoJson.name;
          } catch {
            // fetching the JSON data from IPFS failed,
            // meaning it was likely garbage collected, use N/A
            name = 'N/A';
          }
        }
        const accountListInfo = new AccountList(name, address, accInfo.Registered);
        return accountListInfo;
      } catch {
        return undefined;
      }
    },
    async getAccountInfo(address) {
      try {
        const accInfoString = await this.isAccountRegistered(address);
        const accInfo = JSON.parse(accInfoString);
        if (accInfo.Registered) {
          const accInfoJson = await this.fetchIPFS(accInfo.Url);
          return accInfoJson;
        }
        return undefined;
      } catch {
        return undefined;
      }
    },
    async fetchIPFS(url) {
      let data = null;
      try {
        await axios.get(url, { timeout: 100 })
          .then((res) => {
            data = res.data;
          })
          .catch(() => {
            data = null;
          });
        return data;
      } catch (error) {
        return data;
      }
    },
    async isAccountRegistered(accountId) {
      try {
        const go = new window.Go();
        await WebAssembly.instantiateStreaming(fetch('desocial.wasm'), go.importObject)
          .then((result) => {
            go.run(result.instance);
          });
        const res = await window.getAccountInfo(accountId);

        return res;
      } catch {
        await this.sleep(1000);
        return this.isAccountRegistered(accountId);
      }
    },
    selectAccount(address) {
      this.selectedAddresss = address;
    },
  },
};
