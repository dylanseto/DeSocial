<template>
  <v-app class="black">
    <NavBar></NavBar>
    <v-main class="black">
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>

import NavBar from "@/components/App-Bar"

export default {
  name: 'App',

  components: {
    NavBar
  },

  data: () => ({
    //
  }),
};
</script>
