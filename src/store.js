import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
let api = "https://dodeascholar.com";
import schools from "./schools.json";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		semester: ["Loading", "Loading"],
		semesterMessages: ["Loading", "Loading"],
		classes: [],
		message: "Please Login",
		schools: schools,
		page: "login",
		username: "",
		password: "",
		schoolID: "",
		currentClass: {
			overview: [],
			breakdown: []
		},
		cookie: ""
	},
	getters: {
		message(state) {
			return state.message;
		},
		loggedIn(state) {
			if (state.username) {
				return true;
			} else {
				return false;
			}
		},
		page(state) {
			return state.page;
		},
		classes(state) {
			return state.classes.filter(function (sClass) {
				return sClass[2][0] != "Seminar";
			});
		},
		currentClass(state) {
			return state.currentClass;
		},
		semesterOne(state) {
			return {
				gpa: state.semester[0],
				message: state.semesterMessages[0]
			};
		},
		semesterTwo(state) {
			return {
				gpa: state.semester[1],
				message: state.semesterMessages[1]
			};
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
		changePage(state, page) {
			state.page = page;
		},
		changeMessage(state, message) {
			state.message = message;
		},
		changeGrade(state, data) {
			state.currentClass.breakdown[data[0]][data[1] + 2][3] = data[2];
		},
		changeClass(state, cClass) {
			state.currentClass = cClass;
		},
		setCookie(state, data) {
			state.cookie = data;
		},
		changeAccount(state, data) {
			state.username = data[0];
			state.password = data[1];
			state.schoolID = data[2];
		},
		logout(state) {
			state.username = false;
			state.password = false;
			state.schoolID = false;
		}
	},
	actions: {
		logout(context, router) {
			context.commit("logout");
			context.commit("changeMessage", "Please Login");
			localStorage.removeItem("password");
			router.push("/");
		},
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

			axios
				.get(api + "/v2/login/" + login[2] + "/" + login[0] + "/" + login[1])
				.then(function (response) {
					context.commit("setCookie", response.data);
					return axios.get(api + "/v2/getClasses/" + response.data);
				})
				.then(function (response) {
					var classes = response.data;

					if (classes[0] != "Error, Username/Password/SchoolID incorrect") {
						classes.pop();
						classes = classes.filter(course => course[2][0] != "Virtual School Course");
						context.commit("changeGrades", classes);

						for (let i in classes) {
							classes[i][2][0] = renameClasses(classes[i][2][0]);
							if (classes[i].length == 10) {
								classes[i].splice(7, 0, " ");
								let semester1 = [letterToValue(classes[i][4][1] || " "), letterToValue(classes[i][5][1] || " "), letterToValue(classes[i][6][0] || " ")];
								semester1 = average(
									semester1.filter(function (el) {
										return !isNaN(parseFloat(el)) && isFinite(el);
									}))
								classes[i][7] = [valueToLetter(semester1), "?"];

								classes[i].splice(11, 0, " ");

								let semester2 = [letterToValue(classes[i][8][1] || " "), letterToValue(classes[i][9][1] || " "), letterToValue(classes[i][10][0] || " ")];
								semester2 = average(
									semester2.filter(function (el) {
										return !isNaN(parseFloat(el)) && isFinite(el);
									}))
								classes[i][11] = [valueToLetter(semester2), "?"];

							}
						}

						var gpa1 = [];
						var gpa2 = [];
						for (var i in classes) {
							if (classes[i][7]) {
								gpa1.push(
									letterToPoints(
										classes[i][7][0],
										classes[i][2][0].includes("AP")
									)
								);
							}
							if (classes[i][11]) {
								gpa2.push(
									letterToPoints(
										classes[i][11][0],
										classes[i][2][0].includes("AP")
									)
								);
							}
						}

						//console.log(gpa1);

						gpa1 = average(
							gpa1.filter(function (el) {
								return !isNaN(parseFloat(el)) && isFinite(el);
							})
						).toFixed(2);
						gpa2 = average(
							gpa2.filter(function (el) {
								return !isNaN(parseFloat(el)) && isFinite(el);
							})
						).toFixed(2);

						context.commit("semesterGPA", [gpa1, gpa2]);
						context.commit("semesterMessages", [
							gpaToMessage(gpa1),
							gpaToMessage(gpa2)
						]);
						context.commit("changeMessage", "");
						context.commit("changePage", "overview");
						context.commit("changeAccount", [login[0], login[1], login[2]]);
						login[4].push("overview");
						//this.$router.push("/overview");
					} else {
						context.commit(
							"changeMessage",
							"Username, Password, Or School Is Incorrect :("
						);
					}
				});
		},
		changePage(context, page) {
			context.commit("changePage", page);
		},
		changeGrade(context, data) {
			context.commit("changeGrade", data);
		},
		loadClass(context, data) {
			context.commit("changeMessage", "Loading...");
			axios
				.get(
					`${api}/v2/getClass/${data.classID}/${context.state.cookie}`
				)
				.then(function (response) {
					context.commit("changeMessage", "");
					context.commit("changeClass", {
						overview: data.cClass,
						breakdown: response.data
					});
					context.commit("changePage", "classbreakdown");
					data.router.push("break");
				});
		}
	}
});

function gpaToMessage(gpa) {
	if (gpa == null) {
		return "Loading";
	} else if (gpa > 4) {
		return "Principal’s Honors with distinction";
	} else if (gpa == 4) {
		return "Principal’s Honors";
	} else if (gpa < 4 && gpa >= 3.5) {
		return "High Honors";
	} else if (gpa < 3.5 && gpa >= 3) {
		return "Honors";
	}
	return "No Awards";
}

function letterToValue(letter) {
	let val = NaN;
	switch (letter) {
		case "A+":
			val = 98;
			break;
		case "A":
			val = 95;
			break;
		case "A-":
			val = 91;
			break;
		case "B+":
			val = 88;
			break;
		case "B":
			val = 85;
			break;
		case "B-":
			val = 81;
			break;
		case "C+":
			val = 78;
			break;
		case "C":
			val = 75;
			break;
		case "C-":
			val = 71;
			break;
		case "D+":
			val = 68;
			break;
		case "D":
			val = 65;
			break;
		case "D-":
			val = 61;
			break;
		case "F":
			val = 50;
			break;
	}

	return val;

}

function valueToLetter(val) {
	let letter = "";
	let tensPlace = Math.floor(val/10);
	let onesPlace = val%10;

	if (tensPlace == 9) {
		letter += "A"
	} else if (tensPlace == 8) {
		letter += "B"
	} else if (tensPlace == 7) {
		letter += "C"
	} else if (tensPlace == 6) {
		letter += "D"
	} else if (tensPlace == 5) {
		letter += "F"
	}

	if (onesPlace >= 7) {
		letter += "+"
	}

	if (onesPlace <= 2) {
		letter += "+"
	}

	return letter;
}

function letterToPoints(letter, AP) {
	var points = undefined;
	//console.log(letter);
	if (letter.includes("A") || letter >= 90) {
		points = 4;
	} else if (letter.includes("B") || letter >= 80) {
		points = 3;
	} else if (letter.includes("C") || letter >= 70) {
		points = 2;
	} else if (letter.includes("D") || letter >= 60) {
		points = 1;
	} else if (
		letter.includes("F") ||
		(letter < 60 && letter.trim().length != 0)
	) {
		points = 0;
	}

	if (AP && points != 0 && points != undefined) {
		points += 1;
	}

	//console.log(letter, AP, points);

	return points;
}

function renameClasses(name) {
	name = name.replace("Honors", "H");
	name = name.replace("Computer Science", "CS");
	name = name.replace("Computer Sci", "CS");
	name = name.replace("Literature", "Lit");

	return name;
}

var average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;