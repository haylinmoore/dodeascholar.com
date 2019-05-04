<template>
	<button v-on:click="logout" type="button">Log Out</button>
</template>

<script>
export default {
	name: "logout",
	methods: {
		logout() {
			this.$store.commit("changePage", "login");
		}
	}
};
</script>