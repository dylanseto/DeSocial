<template>
  <div>
  <v-layout>
    <v-flex xs12 md4>
      <v-spacer></v-spacer>
    </v-flex>
    <v-flex xs12 md4>
    <v-form ref="form"
      v-model="form"
      class="pl-16 white--text"
      style="align: center width: 700px;">
          <div v-if="page === 1" class="mt-16">
            <h1>What's your name?</h1>
            <v-text-field
              v-model="name"
              dark
              width=100
              ></v-text-field>
            </div>
        <div v-if="page === 2" class="mt-16" transition="fade-transition">
          <h1>What's your email?</h1>
          <v-text-field
          v-model="name"
          dark
          width=100
          ></v-text-field>
        </div>
        <div class="pt-5">
          <v-btn @click="next()" v-if="this.page != 2">OK <v-icon>mdi-check</v-icon></v-btn>
          <v-btn @click="submit()" v-else>Submit</v-btn>
          <v-pagination
          v-model="page"
          :length="2"
          total-visible="0"
          class="mt-16"
        ></v-pagination>
         </div>
    </v-form>
  </v-flex>
  </v-layout>
    </div>
</template>

<script>

export default {
  created() {
    this.$parent.isRegister = true;
  },
  components: {
  },

  data: () => ({
    page: 1,
  }),
  methods: {
    next() {
      this.page = ((this.page + 1) % 7);
      if (this.page === 0) {
        this.page += 1;
      }
    },
    submit() {
      // TODO - Registration
    },
  },
};
</script>
