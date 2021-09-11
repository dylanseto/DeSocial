import * as algosdk from "algosdk"
import * as config from "./config/algoConfig.js"
import * as IPFS from "ipfs"
import {Social_Post} from "./SocialTypes.js"

export default {
    data: {
        algodClient: null,
        ipfsClient: null
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
         * Attempts to connect to the Algorand and IPFS Networks.
         * @returns True if successful. False Otherwise.
         */
        initializeClient: async function()
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

            // Creae an IPFS node
            this.ipfsClient = await IPFS.create();

            return res;
        },
        /**
         * Uplaods a post to IPFS and submits the link 
         * to the Algorand Blockchain as an NFT
         */
        createPost: async function(name, text)
        {
            var post = new Social_Post(name, text);
            
            if(post instanceof Social_Post)
            {
                //const data = 'Dylan test data'

                // add your data to to IPFS - this can be a string, a Buffer,
                // a stream of Buffers, etc
                const results = this.ipfsClient.addAll(JSON.stringify(post))

            
                // we loop over the results because 'add' supports multiple 
                // additions, but we only added one entry here so we only see
                // one log line in the output
                for await (const { cid } of results) {
                    // CID (Content IDentifier) uniquely addresses the data
                    // and can be used to get it again.
                    console.log(cid.toString())

                    //TODO: Store on algorand
                }
                return true;
            }
            return false;
        }
    }
};
