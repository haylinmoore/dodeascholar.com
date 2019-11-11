<template>
	<div>
		<div id="message">{{ message }}</div>
		<gpaDisplay/>
		<center>
			<classes/>
		</center>
		<logout/>
	</div>
</template>

<script>
import classes from "./classes.vue";
import gpaDisplay from "./gpaDisplay.vue";
import logout from "./logout.vue";

export default {
	name: "overview",
	components: {
		classes,
		gpaDisplay,
		logout
	},
	computed: {
		message() {
			return this.$store.getters.message;
		}
	}
};
</script>