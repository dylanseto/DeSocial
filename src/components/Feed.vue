<template>
    <div>
        <div class="pl-4">
            <div class="pl-16">
                <v-form ref="form"
                        v-model="form"
                        class="pl-16 white--text"
                        style="width: 700px;">
                <v-textarea
                        v-model="social_post_textarea"
                        label="What's on your mind?"
                        counter="400"
                        auto-grow
                        dark
                ></v-textarea>
                <div class="pt-5">
                    <v-btn @click="onPost()">POST</v-btn>
                </div>
                </v-form>
            </div>
        </div>
        <Post v-for="post in this.posts" :key="post.name" v-bind:name="post.name"
                                                              v-bind:text="post.text"></Post>
    </div>
</template>

<script>

import Post from './Post.vue';

export default {
  components: {
    Post,
  },
  data: () => ({
    home: null,
    posts: null,
    loaded: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    async loadComponents() {
      this.posts = await this.$parent.loadPosts();
    },
    onPost() {
      const result = this.$parent.createPost('John', this.social_post_textarea);

      if (!result) {
        // show error
      }
      // Clear Text area.
      this.$refs.form.reset();
    },
  },
};
</script>
