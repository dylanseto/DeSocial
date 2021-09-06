<template>
      <v-container class="mt-1 rounded-xl black" >
      <v-banner elevation="24" 
                width="700" 
                height="200" 
                class="rounded-xl white" 
                flat 
                outlined>
                <div>
                    <v-avatar>
                        <img
                            src="https://cdn.vuetifyjs.com/images/john.jpg"
                            alt="John"
                        >
                    </v-avatar>
                    <a class="ml-3 black--text">John</a>
                </div>
                <v-spacer class="mt-5"></v-spacer>
              <span outlined>This is an example post.</span>
            <v-bottom-navigation class="elevation-0 mt-8" color="primary">
                <span class="mt-5 red--text">
                  10h 10m 50s Left 
                </span> 
                <v-btn elevation="0">
                  <span flat>Add Time</span>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn elevation="0">
                  <span flat>Subtract Time</span>
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-btn elevation="0">
                  <span flat>React</span>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-bottom-navigation>
      </v-banner>
      </v-container>
</template>
