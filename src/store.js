import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

import schools from './schools.json';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		semester: ["Loading", "Loading"],
		semesterMessages: ["Loading", "Loading"],
		classes: [],
		message: "Please Login",
		schools: schools
	},
	getters: {
		message(state) {
			return state.message;
		},
		semesterOne(state) {
			return { gpa: state.semester[0], message: state.semesterMessages[0] };
		},
		semesterTwo(state) {
			return { gpa: state.semester[1], message: state.semesterMessages[1] };
		}
	},
	mutations: {
		changeGrades(state, classes) {
			state.classes = classes;
		},
		semesterGPA(state, gpas) {
			state.semester = gpas;
		},
		semesterMessages(state, messages) {
			state.semesterMessages = messages;
		},
		changeMessage(state, message) {
			state.message = message;
		}
	},
	actions: {
		getGrades(context, login) {

			if (login[0] == "") {
				context.commit("changeMessage", "Please type a username");
				return;
			}

			if (login[1] == "") {
				context.commit("changeMessage", "Please type a password");
				return;
			}

			if (login[2] == "" || login[2] == "unselected") {
				context.commit("changeMessage", "Please choose your school");
				return;
			}

			context.commit("changeMessage", "Loading...");

			axios.get('https://gradespeed.hampton.pw/' + login[2] + '/' + login[0] + "/" + login[1])
				.then(function(response) {
					var classes = response.data;

					if (classes[0] != "Error, Username/Password/SchoolID incorrect") {
						context.commit("changeGrades", classes);

						var gpa1 = [];
						var gpa2 = [];
						for (var i in classes) {
							gpa1.push(letterToPoints(classes[i][7], classes[i][2].includes("AP")));
							gpa2.push(letterToPoints(classes[i][11], classes[i][2].includes("AP")));
						}

						gpa1 = average(gpa1.filter(function(el) { return !isNaN(parseFloat(el)) && isFinite(el); })).toFixed(2);
						gpa2 = average(gpa2.filter(function(el) { return !isNaN(parseFloat(el)) && isFinite(el); })).toFixed(2);

						context.commit("semesterGPA", [gpa1, gpa2]);
						context.commit("semesterMessages", [gpaToMessage(gpa1), gpaToMessage(gpa2)]);
						context.commit("changeMessage", "");
					}
					else {
						context.commit("changeMessage", "Username, Password, Or School Is Incorrect :(");
					}
				})
		}
	}
})

function gpaToMessage(gpa) {
	if (gpa == null) {
		return "Loading"
	}
	else if (gpa > 4) {
		return "Principal’s Honors with distinction";
	}
	else if (gpa == 4) {
		return "Principal’s Honors";
	}
	else if (gpa < 4 && gpa >= 3.5) {
		return "High Honors";
	}
	else if (gpa < 3.5 && gpa >= 3) {
		return "Honors"
	}
	return "No Awards";
}

function letterToPoints(letter, AP) {
	var points = undefined;

	if (letter.includes("A")) {
		points = 4;
	}
	else if (letter.includes("B")) {
		points = 3;
	}
	else if (letter.includes("C")) {
		points = 2;
	}
	else if (letter.includes("D")) {
		points = 1;
	}
	else if (letter.includes("F")) {
		points = 0;
	}

	if (AP && points != 0 && points != undefined) {
		points += 1;
	}

	return points;

}

var average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
