<template>
      <v-container class="postClass" >
      <v-banner
                height="auto"
                flat
                outlined>
                <div class="myLayout">
                <v-layout row>
                    <v-flex xs1 sm1 md1 lg1 class="avatar">
                      <v-avatar>
                          <img
                              src="https://cdn.vuetifyjs.com/images/john.jpg"
                              alt="John"
                          >
                      </v-avatar>
                    </v-flex>
                    <v-flex xs1 sm11 md11 lg11 :class="{'nameTag_xs': $vuetify.breakpoint.xs,
                                                  'nameTag_sm': $vuetify.breakpoint.sm,
                                                  'nameTag_md': $vuetify.breakpoint.md,
                                                  'nameTag_lg': $vuetify.breakpoint.lg}">
                      <v-layout row>
                        <v-flex xs12 sm12 md12 lg12>
                          <a class="white--text"> {{ name }}</a>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                          <span class="postText white--text" outlined>{{text}}</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                </v-layout>
                </div>
            <v-bottom-navigation justify="left" class="bottomPost elevation-0 mt-8 black">
                <span class="mt-5 red--text">
                  10h 10m 50s Left
                </span>
                <v-btn elevation="0">
                  <span flat>Add Time</span>
                  <v-icon class="white--text">mdi-plus</v-icon>
                </v-btn>
                <v-btn elevation="0">
                  <span flat>Subtract Time</span>
                  <v-icon class="white--text">mdi-minus</v-icon>
                </v-btn>
                <v-btn elevation="0">
                  <span flat>React</span>
                  <v-icon class="white--text">mdi-heart</v-icon>
                </v-btn>
              </v-bottom-navigation>
      </v-banner>
      </v-container>
</template>

<style>

.myLayout {
  margin-left: 1em;
  margin-top: 1em;
}
.content {
  justify-content: left;
  height: 200px;
  width: 100%;
}

.avatar {
  height: 100px !important;
}

.nameText_xs {
  margin-left: 100em;
}

.nameText_sm {
  margin-left: 13em;
}

.nameText_md {
  margin-left: 5%;
}

.nameTag_xs {
  padding-top: 1em;
  margin-left: 3.5em;
  justify-content: left;
}

.nameTag_sm {
  padding-top:1em;
  padding-left:3em;
}

.nameTag_md {
  padding-top:1em;
  padding-left:2em;
}
.nameTag_lg {
  padding-top:1em;
  padding-left:1.5em;
}
.postText {
  padding-left: 0%;
  padding-top: 15% !important;
}
.postClass {
  border-bottom:1px solid grey !important;
  border-right:1px solid grey !important;
  margin-left: 0px !important;
  padding-left: 40px !important;
  width: 65%;
  height: auto;
}

.m_form {
  width: 90%;
  height: auto;
}

.bottomPost {
  padding-left: 0px !important;
  justify-content: left !important;
  width: 100% !important;
  height: auto;
}

</style>

<script>
export default {
  props: ['name', 'text'],
};
</script>
