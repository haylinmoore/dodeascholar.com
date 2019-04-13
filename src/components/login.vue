<template>
	<div v-on:keyup.enter="login">
		<div id="message">{{ message }}</div>
		<input type="text" placeholder="Username" v-model="username"><br>
		<input type="password" placeholder="Password" v-model="password"><br>
		<select v-model="school">
			<option value="unselected" disabled>Select School</option>
			<option v-for="school in schools" v-bind:value="school[0]" :key="school[0]">
				{{ school[1] }}
			</option>
		</select>
		<br>
		<div id="tos"><a href="/tos.html">By using this service I give gpa.hampton.pw permission to scrape my grades in order to calculate GPA. Click for more details</a></div>
		<br>
		<button v-on:click="login" type="button">Login</button>
	</div>
</template>

<script>
	export default {
		name: 'gpa',
		props: {
			data: Object
		},
		data: function() {
			return {
				school: localStorage.getItem("school") || "unselected",
				username: localStorage.getItem("username") || "",
				password: "",
				approved: false
			}
		},
		computed: {
			schools() {
				return this.$store.state.schools.filter(word => (!word[1].includes('Elementary')));
			},
			message() {
				return this.$store.getters.message
			}
		},
		methods: {
			login: function() {
				var login = [this.username, this.password, this.school];
				localStorage.setItem('school', this.school);
				localStorage.setItem('username', this.username);
				this.$store.dispatch("getGrades", login);
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	input[type="text"],
	input[type="password"] {
		margin-top: 25px;
		width: 100%;
		max-width: 300px;
		height: 35px;
		border-radius: 5px;
		text-indent: 10px;
	}

	#tos {
		margin: 0 auto;
		margin-top: 30px;
		color: #f5f5f5;
		width: 100%;
		max-width: 300px;
	}

	#tos a {
		color: #f5f5f5;
	}

	select {
		margin-top: 25px;
		width: 100%;
		max-width: 300px;
		height: 45px;
		border-radius: 5px;
		text-indent: 10px;
	}
</style>
