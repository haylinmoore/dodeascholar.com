<template>
	<div v-on:keyup.enter="login">
		<div id="message">{{ message }}</div>
		<input type="text" placeholder="Username" v-model="username">
		<br>
		<input type="password" placeholder="Password" v-model="password">
		<br>
		<select v-model="school">
			<option value="unselected" disabled>Select School</option>
			<option v-for="school in schools" v-bind:value="school[0]" :key="school[0]">{{ school[1] }}</option>
		</select>
		<br>
		<div id="tos">
			<a
				href="#/tos"
			>By using this service I give https://dodeascholar.com/ permission to access my gradespeed account while grabbing the grades, nothing will ever be stored. Click for more details</a>
		</div>
		<br>
		<button v-on:click="login" type="button">Login</button>
	</div>
</template>

<script>
export default {
	name: "gpa",
	props: {
		data: Object
	},
	data: function() {
		return {
			school: localStorage.getItem("school") || "unselected",
			username: localStorage.getItem("username") || "",
			password: atob(localStorage.getItem("password")) || "",
			debug: false
		};
	},
	computed: {
		schools() {
			return this.$store.state.schools;
		},
		message() {
			return this.$store.getters.message;
		}
	},
	methods: {
		login: function() {
			var login = [
				this.username,
				btoa(this.password),
				this.school,
				this.debug,
				this.$router
			];
			localStorage.setItem("school", this.school);
			localStorage.setItem("username", this.username);
			localStorage.setItem("password", btoa(this.password));
			this.$store.dispatch("getGrades", login);
		}
	}
};
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
