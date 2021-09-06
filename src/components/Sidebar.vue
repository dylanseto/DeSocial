<template>
<v-navigation-drawer width="70" class ="ml-5 black navigationColor" v-model="drawer" app>
        <div class="mt-5 ml-5">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            width="50"
            transition="scale-transition"
          />
        </div>

        <v-btn class="mt-10" color="black" elevation="24">
          <v-icon size="50" :class="{'white--text': !hover_over_home, 'grey--text': hover_over_home}"
                            @mouseover="hover_over_home = true"
                            @mouseleave="hover_over_home = false">mdi-home-circle</v-icon>
        </v-btn>
        <v-btn class="mt-8" color="black">
          <v-icon size="50" :class="{'white--text': !hover_over_account, 'grey--text': hover_over_account}"
                            @mouseover="hover_over_account = true"
                            @mouseleave="hover_over_account = false">mdi-account-circle</v-icon>
        </v-btn>

          <v-btn class="mt-10" color="black">
            <v-icon size="50" :class="{'white--text': !hover_over_bell, 'grey--text': hover_over_bell}"
                            @mouseover="hover_over_bell = true"
                            @mouseleave="hover_over_bell = false">mdi-bell-circle</v-icon>
          </v-btn>
          <v-btn class="mt-10" color="black">
            <v-icon size="50" :class="{'white--text': !hover_over_email, 'grey--text': hover_over_email}"
                            @mouseover="hover_over_email = true"
                            @mouseleave="hover_over_email = false">mdi-email</v-icon>
          </v-btn>
          <v-btn class="mt-10" color="black">
            <v-icon size="50" :class="{'white--text': !hover_over_more, 'grey--text': hover_over_more}"
                            @mouseover="hover_over_more = true"
                            @mouseleave="hover_over_more = false">mdi-more</v-icon>
          </v-btn>
      </v-navigation-drawer>
</template>

<style>
  .navigationColor {
    border-color: grey !important;
  }
</style>

<script>

export default {
  components: {
  },

  data: () => ({
    hover_over_home: false,
    hover_over_account: false,
    hover_over_bell: false,
    hover_over_email: false,
    hover_over_more: false
  }),
};
</script>