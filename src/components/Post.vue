<template>
      <v-container class="postClass" >
      <v-banner
                height="auto"
                width="100%"
                flat
                outlined>
                <v-layout row>
                    <v-flex xs1 sm1 md1 lg1>
                      <v-avatar class="ml-3 mt-4">
                          <img
                              src="https://cdn.vuetifyjs.com/images/john.jpg"
                              alt="John"
                          >
                      </v-avatar>
                    </v-flex>
                    <v-flex xs1 sm11 md11 lg11 :class="{'nameTag_xs': $vuetify.breakpoint.xs,
                                                  'nameTag_sm': $vuetify.breakpoint.sm,
                                                  'nameTag_md mt-2 3': $vuetify.breakpoint.md,
                                                  'mt-7': $vuetify.breakpoint.lg}">
                      <a :class="{'nameText_xs white--text 1': $vuetify.breakpoint.xs,
                                  'nameText_sm white--text 2': $vuetify.breakpoint.sm,
                                  'nameText_md white--text 3': $vuetify.breakpoint.md,
                                  'ml-1 white--text 4': $vuetify.breakpoint.lg,
                                  'ml-1 white--text 5': $vuetify.breakpoint.xl}">
                                  {{ name }}</a>
                    </v-flex>
                    <v-flex xs12 sm12 md12 class="ml-16">
                      <span class="postText white--text" outlined>{{text}}</span>
                    </v-flex>
                </v-layout>
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

.content {
  justify-content: left;
  height: 100%;
  width: 100%;
}

.avatar {
  height: 100px;
  width: 50px;
  margin-right: 0px;
  padding-right: 0px;
}

.nameText_xs {
  margin-left: 250%;
}

.nameText_sm {
  margin-left: 6%;
}

.nameText_md {
  margin-left: 100%;
}

.nameTag_xs {
  padding-top:12%;
  margin-right: 0%;
  justify-content: left;
}

.nameTag_sm {
  padding-top:5%;
}

.nameTag_md {
  padding-top:3%;
}
.postText {
  padding-left: 0%;
  margin-left: 1.5%;
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
