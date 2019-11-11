<template>
	<table>
		<tr>
			<th>Class Name</th>
			<th>Quarter 1</th>
			<th>Quarter 2</th>
			<th>Semester 1 Exam</th>
			<th>Semester 1</th>
			<th>Quarter 3</th>
			<th>Quarter 4</th>
			<th>Semester 2 Exam</th>
			<th>Semester 2</th>
		</tr>
		<tr v-for="sClass in classes" :key="sClass">
			<td>{{ sClass[2][0] }}</td>
			<td>
				<a href="javascript:;" v-on:click="classBreakdown(sClass,sClass[4][0])">{{ sClass[4][1] }}</a>
			</td>
			<td>
				<a href="javascript:;" v-on:click="classBreakdown(sClass,sClass[5][0])">{{ sClass[5][1] }}</a>
			</td>
			<td>{{ sClass[6][0] }}</td>
			<td>{{ sClass[7][0] }}<a href="javascript:;" v-on:click="guess()" class="guess" title="Due to an issue with gradespeed your semester grade for this class is not know and must be guessed" v-if="sClass[7][1] == '?'">?</a></td>
			<td>
				<a href="javascript:;" v-on:click="classBreakdown(sClass,sClass[8][0])">{{ sClass[8][1] }}</a>
			</td>
			<td>
				<a href="javascript:;" v-on:click="classBreakdown(sClass,sClass[9][0])">{{ sClass[9][1] }}</a>
			</td>
			<td>{{ sClass[10][0] }}</td>
			<td>{{ sClass[11][0] }}</td>
		</tr>
	</table>
</template>

<script>
export default {
	name: "classes",
	computed: {
		classes() {
			return this.$store.getters.classes;
		}
	},
	methods: {
		classBreakdown(cClass, classID) {
			classID = classID.substr(6);
			this.$store.dispatch("loadClass", {
				cClass,
				classID,
				username: this.$store.state.username,
				password: this.$store.state.password,
				schoolID: this.$store.state.schoolID,
				router: this.$router
			});
		},
		guess(){
			alert("Due to an issue with gradespeed your semester grade for this class is not know and must be guessed")
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
	margin: auto;
	margin-top: 30px;
	border-collapse: collapse;
	max-width: 850px;
	overflow: auto;
	display: block;
	overflow-x: auto;
	white-space: nowrap;
}

th,
td {
	text-align: left;
	padding: 8px;
	text-align: center;
}
tr:nth-child(even) {
	background-color: #4183c4;
}

.guess {
	text-decoration: underline;
}

a {
	color: #f5f5f5;
}
</style>
