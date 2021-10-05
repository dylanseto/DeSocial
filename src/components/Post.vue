<template>
      <v-banner :class="{'post postSize_xs':  $vuetify.breakpoint.xs,
                      'post postSize_sm':  $vuetify.breakpoint.sm,
                      'post postSize_md':  $vuetify.breakpoint.md,
                      'post postSize_lg':  $vuetify.breakpoint.lg}">
        <div class="topOfPost">
          <v-layout row wrap>
            <v-flex xs1 lg1>
              <v-avatar>
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  alt="John"
                >
              </v-avatar>
            </v-flex>
            <v-flex xs1 lg11>
              <div :class="{'content_xs':  $vuetify.breakpoint.xs,
                      'content_sm':  $vuetify.breakpoint.sm,
                      'content_md':  $vuetify.breakpoint.md,
                      'content_lg':  $vuetify.breakpoint.lg}">
                <v-layout row wrap>
                  <v-flex xs12>
                    <a class="white--text nameText"> {{ name }}</a>
                  </v-flex>
                  <v-flex xs12>
                    <span class="white--text"> {{ text }} </span>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </div>
          <v-bottom-navigation class="bottomPost elevation-0 black">
            <div :class="{'postInfo_xs':  $vuetify.breakpoint.xs,
                          'postInfo_sm':  $vuetify.breakpoint.sm,
                          'postInfo_md':  $vuetify.breakpoint.md,
                          'postInfo_lg':  $vuetify.breakpoint.lg}">
              <v-btn elevation="0">
              <span flat>Add Time</span>
                <v-icon class="white--text">mdi-plus</v-icon>
              </v-btn>
              <v-btn elevation="0">
                <span flat>Subtract Time</span>
                <v-icon class="white--text subtractButton">mdi-minus</v-icon>
              </v-btn>
              <v-btn elevation="0">
                <span flat>React</span>
                <v-icon class="white--text reactButton">mdi-heart</v-icon>
              </v-btn>
            </div>
          </v-bottom-navigation>
      </v-banner>
</template>

<style>
.postSize_xs {
  width: 30rem;
}
.postSize_sm {
  width: 35rem;
}
.postSize_md {
  width: 40rem;
}
.postSize_lg {
  width: 50rem;
}
.post {
  border-right:1px solid grey !important;
  border-bottom:1px solid grey;
}
.topOfPost {
  margin-left:2rem;
  margin-top:2rem;
}
.content_xs {
  margin-left: 2rem;
  margin-top: 1rem;
}
.content_sm {
  margin-left: 1.6rem;
  margin-top: 1rem;
}
.content_md {
  margin-left: 1.2rem;
  margin-top: 1rem;
}
.content_lg {
  margin-left: 0.5rem;
  margin-top: 1rem;
}
.nameText {
  font-size:1.2rem;
  font-weight: bold;
}

.bottomPost {
  margin-top: 2rem;
  margin-left: 2.1rem;
}

.postInfo_xs {
  margin-right: 0rem;
  margin-top: 1rem;
}

.postInfo_sm {
  margin-right: 5rem;
  margin-top: 1rem;
}

.postInfo_md {
  margin-right: 10rem;
  margin-top: 1rem;
}

.postInfo_lg {
  margin-right: 20rem;
  margin-top: 1rem;
}

.subtractButton {
  margin-right: 10rem;
}
.reactButton {
  margin-right: 25rem;
}
</style>

<script>
export default {
  props: ['name', 'text'],
};
</script>
