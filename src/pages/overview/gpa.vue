<template>
	<div class="gpa">
		{{title}} - {{data.gpa}}
		<br>
		{{data.message}}
	</div>
</template>

<script>
export default {
	name: "gpa",
	props: {
		data: Object,
		title: String
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gpa {
	font-size: 1.2rem;
	margin-top: 40px;
}
</style>
