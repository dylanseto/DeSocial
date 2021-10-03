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
          <v-flex xs12 md4 v-if="isLoaded">
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
          <Sidebar></Sidebar>
        </v-layout>
      </div>
    </div>
</template>

<script>

import Sidebar from '../components/Sidebar.vue';
import Feed from '../components/Feed.vue';
import deSocial from '../js/DeSocial';

export default {
  components: {
    Sidebar,
    Feed,
  },
  mixins: [deSocial],
  data: () => ({
    isLoaded: false,
    isInstalled: false,
    posts: null,
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
    onPost() {
      const result = this.createPost('John', this.social_post_textarea);

      if (!result) {
        // show error
      }
      // Clear Text area.
      this.$refs.form.reset();
    },
    async loadPosts() {
      this.posts = await this.getPosts();
      await Promise.all(this.posts);
      return this.posts;
    },
  },
};
</script>
