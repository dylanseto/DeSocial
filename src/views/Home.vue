<template class="grey">
    <div>
      <div v-if="!isLoaded" class="pt-16">
        <v-layout>
          <v-flex xs12 md12 class="welcome">
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
          <v-flex xs12 md4 v-if="isLoaded && !isRegistered">
            <Register></Register>
          </v-flex>
          <v-flex md4 v-else-if="isLoaded && isRegistered">
            <Feed></Feed>
          </v-flex>
          <v-flex xs12 md4 v-else>
            <v-container class="mt-1 rounded-xl black" >
              <v-banner elevation="24"
                        width="500"
                        height="170"
                        class="rounded-xl white"
                        flat
                        outlined>
                      <span outlined>
                        Algosigner Chrome Extension is required to run this application.
                      </span>
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
          <Sidebar v-if="isLoaded && isRegistered"></Sidebar>
        </v-layout>
      </div>
    </div>
</template>

<style scoped>
  .welcome {
    margin-left: 7rem;
  }
  .welcome_sm {
    margin-left: 25%;
  }
  .welcome_lg {
    margin-left: 38%;
  }
</style>

<script>

import Sidebar from '../components/Sidebar.vue';
import Feed from '../components/Feed.vue';
import Register from '../components/Register.vue';
import deSocial from '../lib/js/DeSocial';

export default {
  components: {
    Register,
    Sidebar,
    Feed,
  },
  mixins: [deSocial],
  data: () => ({
    isLoaded: false,
    isInstalled: false,
    isRegistered: false,
    posts: null,
    isRegister: false,
  }),
  methods: {
    async handleClick() {
      this.isLoaded = false;
      await this.initializeClient();
      await this.loadPosts()
        .then(() => {
          this.isLoaded = true;
        });
    },
    async loadPosts() {
      this.posts = await this.getPosts();
      await Promise.all(this.posts);
      return this.posts;
    },
  },
};
</script>
