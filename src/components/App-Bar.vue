<template>
<v-app-bar
      app
      color = "black"
      flat
      class="topBar"
    >
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <div>
        <v-btn color = "black">
            <router-link to="/" flat class="white--text">Home</router-link>
        </v-btn>
        <v-btn color = "black">
            <router-link to="/About" class="white--text">About</router-link>
        </v-btn>
      </div>
    </v-app-bar>
</template>

<style>
.topBar {
  border-bottom: 1px solid grey !important;
}
</style>
