<template>
    <div>
        <div :class="{'post postFormSize_xs':  $vuetify.breakpoint.xs,
                      'post postFormSize_sm':  $vuetify.breakpoint.sm,
                      'post postFormSize_md':  $vuetify.breakpoint.md,
                      'post postFormSize_lg':  $vuetify.breakpoint.lg}">
            <div class="pl-16">
                <v-form ref="form"
                        v-model="form"
                        class="m_form white--text">
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
        <Post class="pr-4" v-for="post in this.posts" :key="post.name" v-bind:name="post.name"
                                                              v-bind:text="post.text"></Post>
    </div>
</template>

<style>
.postFormSize_xs {
  width: 30rem;
  height: 15rem;
}
.postFormSize_sm {
  width: 35rem;
  height: 15rem;
}
.postFormSize_md {
  width: 40rem;
  height: 15rem;
}
.postFormSize_lg {
  width: 50rem;
  height: 15rem;
}
.postForm {
  border-right:1px solid grey !important;
  border-bottom:1px solid grey;
}

.m_form {
  width: 90%;
}
</style>

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
    if (!this.loaded) {
      this.loadComponents();
      this.laoded = true;
    }
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
