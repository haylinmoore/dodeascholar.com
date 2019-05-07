<template>
	<div>
		<h1>What is happening?</h1>
		<p>
			The website is made of two parts, the frontend and the backend. When you login on the frontend it sends your
			username and password to the backend server. This then logins into gradespeed using those credentials, and grabs
			your semester average for each class. This is then sent back to the client, which displays it to you, the user,
			and does maths on it to calculate GPA and percentage. During this process all data is stored in memory and never
			written to disk or any long term storage medium. All data is deleted after the server responds to the client.
		</p>
		<h1>Logging?</h1>
		<p>
			This service is completly log free with no plans of ever implementing logging as we believe in complete privacy.
			All data is deleted the minute the server is done using it
		</p>
		<h1>Open Source</h1>
		<p>
			Every part of this project is open source!
			<br>The Frontend
			<a
				href="https://github.com/herohamp/DodeaGPACalculator"
			>https://github.com/herohamp/DodeaGPACalculator</a>
			<br>powered by The backend server
			<a
				href="https://github.com/herohamp/gradespeed.hampton.pw"
			>https://github.com/herohamp/gradespeed.hampton.pw</a>
			<br>which uses the node module
			<a
				href="https://github.com/herohamp/gradespeed-api-dodea"
			>https://github.com/herohamp/gradespeed-api-dodea</a>
		</p>
		<button v-on:click="back" type="button">Back</button>
	</div>
</template>

<script>
export default {
	name: "classbreakdown",
	computed: {},
	methods: {
		back() {
			this.$router.push("/");
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
	color: #f5f5f5;
}
div {
	width: 100%;
	max-width: 400px;
	margin: auto;
}
</style>
