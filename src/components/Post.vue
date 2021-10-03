<template>
      <v-container class="postClass" >
      <v-banner
                height="auto"
                width="100%"
                flat
                outlined>
                <div>
                    <v-avatar>
                        <img
                            src="https://cdn.vuetifyjs.com/images/john.jpg"
                            alt="John"
                        >
                    </v-avatar>
                    <a class="ml-3 white--text">{{name}}</a>
                </div>
                <v-spacer class="mt-5"></v-spacer>
              <span class="white--text" outlined>{{text}}</span>
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
