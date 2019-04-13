<template>
    <div id="app">
      <div>
        <h1 id="header">
          Dodea GPA Calculator
        </h1>
      </div>
      
      <login v-if="message != ''" id="login"/>
      <gpaDisplay v-if="message === ''"/>
      
      <br><br><br>
      <a href="https://hampton.pw" id="by">Made with <span id="heart">❤</span> by Hampton Moore</a>
    </div>
</template>

<script>
	import login from './components/login.vue'
	import gpaDisplay from './components/gpaDisplay.vue'

	export default {
		name: 'app',
		components: {
			login,
			gpaDisplay
		},
		computed: {
			message() {
				return this.$store.getters.message
			}
		}
	}
</script>

<style>
	#app {
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

	#by:hover #heart {
		color: red;
	}

	button {
		margin-top: 25px;
		width: 100%;
		max-width: 200px;
		height: 75px;
		background-color: #4183C4;
		color: #f5f5f5;
		border: none;
		font-size: 1.4rem;
		border-radius: 10px;
		transition: background-color 0.3s;
	}


	button:hover {
		background-color: #004A85;
		cursor: pointer;
	}
</style>
