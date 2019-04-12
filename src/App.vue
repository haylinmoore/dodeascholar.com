<template>
  <div id="app">
    <div>
      <h1 id="header">
        Dodea GPA Calculator
      </h1>
    </div>
    
    <div id="message" v-if="message != ''">{{ message }}</div>
    <login v-if="message != ''" id="login"/>
    
    <div v-if="message == ''">
      <gpa v-bind:data="semesterOne" title="Semester One"/>
      <gpa v-bind:data="semesterTwo" title="Semester Two"/>
    </div>
    <br><br><br>
    <a href="https://hampton.pw" id="by">Made with <span id="heart">❤</span> by Hampton Moore</a>
  </div>
</template>

<script>
import gpa from './components/gpa.vue'
import login from './components/login.vue'

export default {
  name: 'app',
  components: {
    gpa,
    login
  },
  computed: {
    semesterOne(){
      return this.$store.getters.semesterOne
    },
    semesterTwo(){
      return this.$store.getters.semesterTwo
    },
    message(){
      return this.$store.getters.message
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  background-color: #1E232B;
  color: #f5f5f5;
}

#message {
  margin-top: 40px;
  font-size: 2.2rem;
}

#header {
  font-size: 3rem;
}

#by {
  color: #f5f5f5;
}

#heart {
  transition: color 0.3s;
}

#by:hover #heart{
  color: red;
}
</style>
