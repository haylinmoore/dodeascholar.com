<template>
	<div>
		<gpaDisplay/>
		<classes/>
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
	}
};
</script>