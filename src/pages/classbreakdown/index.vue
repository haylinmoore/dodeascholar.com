<template>
	<div>
		<h2>{{ currentClass.overview[2][0] }} by {{ currentClass.overview[0][0] }}</h2>
		<h3>Your current average in the class is: {{ currentClass.grade }}%</h3>
		<hr>
		<div v-for="category in currentClass.breakdown" v-bind:key="category" class="category">
			<h4>{{ category.value }}</h4>
			<table>
				<tr>
					<th>Assignment</th>
					<th>Assigned</th>
					<th>Due Date</th>
					<th>Grade</th>
					<th>Possible</th>
					<th>Notes</th>
				</tr>
				<tr>
					<td>Average</td>
					<td>{{category.average}}%</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr v-for="assignment in category.data" :key="assignment">
					<td>{{ assignment[0] }}</td>
					<td>{{ assignment[1] }}</td>
					<td>{{ assignment[2] }}</td>
					<td>{{ assignment[3] }}</td>
					<td>{{ assignment[4] }}</td>
					<td>{{ assignment[5] }}</td>
				</tr>
			</table>
		</div>
		<button v-on:click="back" type="button">Back</button>
	</div>
</template>

<script>
export default {
	name: "classbreakdown",
	computed: {
		currentClass() {
			let data = this.$store.getters.currentClass;
			let n = /\d+/;
			data.percent = 0;
			data.total = 0;

			for (let i in data.breakdown) {
				let length = data.breakdown[i].length;
				data.breakdown[i] = {
					value: data.breakdown[i][0][0],
					total: 0,
					average: 0,
					max: 0,
					percent: Number(data.breakdown[i][0][0].match(n)[0]),
					data: data.breakdown[i].splice(2, length).splice(0, length - 3)
				};

				for (let assignmentID in data.breakdown[i].data) {
					let assignment = data.breakdown[i].data[assignmentID];

					if (
						isNaN(Number(assignment[4])) ||
						assignment[4] == undefined ||
						assignment[4] == ""
					) {
						assignment[5] = assignment[4];
						assignment[4] = 100;
					}

					if (
						!isNaN(Number(assignment[3])) &&
						!assignment[5].includes("(Dropped)") &&
						assignment[3] != ""
					) {
						data.breakdown[i].total += Number(assignment[3]);
						data.breakdown[i].max += Number(assignment[4]);
					}
				}

				data.breakdown[i].average = (
					(data.breakdown[i].total / data.breakdown[i].max) *
					100
				).toFixed(2);

				if (
					!isNaN(data.breakdown[i].average) &&
					!isNaN(data.breakdown[i].percent)
				) {
					data.total += data.breakdown[i].average * data.breakdown[i].percent;
					data.percent += data.breakdown[i].percent;
				}
			}

			data.grade = (data.total / data.percent).toFixed(2);
			return data;
		}
	},
	methods: {
		back() {
			this.$router.push("overview");
		},
		edit(cIndex, aIndex) {
			this.$store.dispatch("changeGrade", [
				cIndex,
				aIndex,
				Number(prompt("New Grade?"))
			]);
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
	max-width: 100px;
	width: 100%;
}

.category {
	margin: auto;
	margin-top: 30px;
	max-width: 650px;
}

table {
	border-collapse: collapse;
	width: 100%;
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

a {
	color: #f5f5f5;
}
</style>
