import * as algosdk from "algosdk"
import * as config from "./config/algoConfig.js"

export default {
    data: {
        algodClient: null
    },
    methods: {
        /**
         * Checks if AlgoSigner Extension is installed.
         * @returns True if installed. False otherwise.
         */
        isAlgoSignerInstalled: function() {
            if (typeof AlgoSigner !== 'undefined') {
                return true;
            } 
            return false;
        },
        /**
         * Attempts to connect to the Algorand Network.
         * @returns True if successful. False Otherwise.
         */
        connectToAlgo: async function()
        {
            var res = false;
            if(!this.isAlgoSignerInstalled())
            {
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
                })

            //Connect to Algorand Network using the Algorand SDK
            this.algodClient = new algosdk.Algodv2(config.token, config.server, config.port);
                
            await this.algodClient.healthCheck().do()
                .then(d => { 
                    console.log(JSON.stringify(d));
                    res = (res && true);
                })
                .catch(e => { 
                  console.error(e);
                  res = false; 
                });
            return res;
        },
        /**
         * Uplaods a post to IPFS and submits the link 
         * to the Algorand Blockchain as an NFT
         */
        createPost: async function()
        {
        }
    }
};
