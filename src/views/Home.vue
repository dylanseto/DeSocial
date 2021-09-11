<template class="grey">
    <div>
      <div v-if="!isLoaded" class="pt-16">
        <v-layout>
          <v-flex xs12 md4>
            <v-spacer></v-spacer>
          </v-flex>
          <v-flex xs12 md4>
            <div>
              <h1 class="white--text">Welcome to VANISH</h1>
            </div>
            <div class="pl-16 pt-4">
              <div class="pl-10">
                <v-btn
                    class="rounded-xl white" 
                    width="100"
                    @click="handleClick()">Load App</v-btn>
                <p class="text--red">Error</p>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </div>
      <div v-else>
        <v-layout column>
          <v-flex md4>
            <v-spacer></v-spacer>
          </v-flex>
          <v-flex xs12 md4 v-if="isLoaded" >
            <div class="pl-4">
              <div class="pl-16">
                <div class="pl-16 white--text" style="width: 700px;">
                  <v-textarea
                  label="What's on your mind?"
                  counter="400"
                  auto-grow
                  dark
                ></v-textarea>
                <div class="pt-5">
                  <v-btn @click="onPost()">POST</v-btn>
                </div>
               </div>
              </div>
            </div>
            <Post v-for="index in 10" :key="index"></Post>
          </v-flex>
          <v-flex xs12 md4 v-else>
                  <v-container class="mt-1 rounded-xl black" >
          <v-banner elevation="24" 
                    width="500" 
                    height="170" 
                    class="rounded-xl white" 
                    flat 
                    outlined>
                  <span outlined>Algosigner Chrome Extension is required to run this application.</span>
                  <p></p>
                  <p></p>
                  <p></p>
                  <p>It can be installed 
                    <a href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm">
                    here
                    </a>
                  </p>
          </v-banner>
          </v-container>
          </v-flex>
          <Sidebar></Sidebar>
        </v-layout>
      </div>
    </div>
</template>

<script>

import Post from "@/components/Post"
import Sidebar from "@/components/Sidebar"
import algoSocial from "@/js/AlgoSocial.js"

export default {
  components: {
    Post,
    Sidebar
  },
  mixins: [ algoSocial ],
  data: () => ({
    isLoaded: false,
    isInstalled: false,
  }),
  methods: {
    handleClick: async function()
    {
      this.isLoaded = false;
      this.isLoaded = await this.initializeClient();
    },
    onPost: function()
    {
      this.createPost();
    }
  }
};
</script>