<template>
	<div>
		<gpa v-bind:data="semesterOne" title="Semester One"/>
		<gpa v-bind:data="semesterTwo" title="Semester Two"/>
		<button v-on:click="logout" type="button">Log Out</button>
	</div>
</template>

<script>
import gpa from "./gpa.vue";

export default {
	name: "gpaDisplay",
	components: {
		gpa
	},
	computed: {
		semesterOne() {
			return this.$store.getters.semesterOne;
		},
		semesterTwo() {
			return this.$store.getters.semesterTwo;
		}
	},
	methods: {
		logout() {
			this.$store.commit("changeMessage", "Please Login");
		}
	}
};
</script>

<style>
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
