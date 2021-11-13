<template>
  <v-app class="black">
    <v-main class="black">
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>

// import NavBar from './components/App-Bar.vue';

export default {
  name: 'App',

  components: {
    // NavBar,
  },

  data: () => ({
    //
  }),
};
</script>
