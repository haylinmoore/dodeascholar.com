<template>
	<div>
		<gpa v-bind:data="semesterOne" title="Semester One GPA" />
		<gpa v-bind:data="semesterTwo" title="Semester Two GPA" />
		<br />Due to an issue with gradespeed, GPA calculation are currently wrong if you attend virtual classes :(
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
	}
};
</script>