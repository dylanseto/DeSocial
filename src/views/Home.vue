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
                <v-dialog
                transition="dialog-top-transition"
                max-width="500"
                >
                  <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      class="rounded-xl white"
                      width="150"
                      v-bind="attrs"
                      @click="connect()"
                      v-on="on">Login</v-btn>
                  </template>
                  <template v-slot:default="dialog">
                    <v-card height="auto">
                      <v-card-actions class="justify-bottom">
                        <h2 class="align-left">Select An Account</h2>
                        <v-btn
                          class="dialog_btn justify-right"
                          text
                          @click="dialog.value = false"
                        ><v-icon>mdi-close</v-icon></v-btn>
                     </v-card-actions>
                     <div>
                       <v-card class="accountCard text-center"
                               height="50px"
                               flat
                               v-if="!accountsLoaded">
                       <v-progress-circular
                        indeterminate
                        color="blue"
                      ></v-progress-circular>
                      </v-card>
                      <div v-else>
                        <v-card class="accountCard" height="70px" v-for="account in accounts"
                                                                  :key="account.Address" flat>
                          <v-layout>
                              <v-flex md6>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <div class="avatar" v-bind="attrs"
                                                        v-on="on">
                                      <v-avatar>
                                        <img
                                          src="https://cdn.vuetifyjs.com/images/john.jpg"
                                        >
                                      </v-avatar>
                                      <span class="accoutName">{{account.Name}}</span>
                                            <span
                                              class="address"
                                            > ({{account.Address.substring(0, 11)}}...)</span>
                                    </div>
                                  </template>
                                  <span>{{account.Address}}</span>
                                </v-tooltip>
                              </v-flex>
                              <v-flex md6>
                                <v-btn :class="{'selectButton':  account.Registered,
                                                'registerButton':  !account.Registered}"
                                                @click="selectAccountBtn(account.Address,
                                                                      account.Registered)"
                                                rounded>
                                  <span v-if="account.Registered">Select Account</span>
                                  <span v-else>Register</span>
                                </v-btn>
                              </v-flex>
                          </v-layout>
                        </v-card>
                      </div>
                     </div>
                    </v-card>
                  </template>
                </v-dialog>
                <p v-if="error" class="red--text">Error: Connecting to wallet.</p>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </div>
      <div v-else>
        <v-layout column>
          <v-flex xs12 md4 v-if="!isRegistered">
            <Register></Register>
          </v-flex>
          <v-flex md4 v-else-if="isLoaded && isRegistered">
            <Feed></Feed>
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
  .dialog_btn {
    margin-left: 12rem;
  }
  .accountCard {
    padding-bottom: 3.5rem;
    border-bottom: 1px solid grey;
  }
  .cardLayout {
    margin-top: 1rem;
  }
  .avatar {
    margin-left: 1rem;
    margin-top: 0.8rem;
  }
  .accoutName {
    margin-left: 0.5rem;
  }
  .address {
    margin-left: 0rem;
    color: grey;
  }
  .selectButton {
    background-color: green !important;
    margin-top: 1rem;
    color: white;
  }
  .registerButton {
    background-color: red !important;
    margin-top: 1rem;
    color: white;
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
    isConnect: false,
    error: false,
    accountsLoaded: false,
    accounts: [],
  }),
  methods: {
    async connect() {
      try {
        if (!this.isConnect) {
          await this.initializeClient();
        }
        this.accounts = await this.getAccountsInfo();

        if (this.accounts.length) {
          this.accountsLoaded = true;
          this.isConnect = true;
        }
      } catch {
        this.error = true;
      }
    },
    async goToFeed() {
      this.isLoaded = false;
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
    selectAccountBtn(address, isRegistered) {
      if (isRegistered) {
        this.isRegistered = true;
        this.selectAccount(address);
        this.goToFeed();
      } else {
        this.isLoaded = true;
        this.isRegistered = false;
        this.selectAccount(address);
      }
    },
  },
};
</script>
