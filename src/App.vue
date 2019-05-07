<template>
	<div id="app">
		<h1 id="header">DodeaScholar</h1>

		<router-view></router-view>

		<br>
		<br>
		<br>
		<a href="https://hampton.pw" id="by">
			Made with
			<span id="heart">❤</span> by Hampton Moore
		</a>
	</div>
</template>

<script>
export default {
	name: "app",
	computed: {
		page() {
			return this.$store.getters.page;
		},
		message() {
			return this.$store.getters.message;
		}
	}
};
</script>

<style>
#app {
	text-align: center;

	background-color: #1e232b;
	color: #f5f5f5;
}

#message {
	margin-top: 40px;
	font-size: 1.4rem;
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
	background-color: #4183c4;
	color: #f5f5f5;
	border: none;
	font-size: 1.4rem;
	border-radius: 10px;
	transition: background-color 0.3s;
}

button:hover {
	background-color: #004a85;
	cursor: pointer;
}
</style>
