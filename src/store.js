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
			return state.classes.filter(function(sClass) {
				return sClass[2][0] != "Seminar";
			});
		},
		currentClass(state) {
			return state.currentClass;
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
		setCookie(state, data){
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
				.then(function(response){
					context.commit("setCookie", response.data);
					return axios.get(api + "/v2/getClasses/"+response.data);
				})
				.then(function(response) {
					var classes = response.data;

					if (classes[0] != "Error, Username/Password/SchoolID incorrect") {
						context.commit("changeGrades", classes);

						for (let i in classes) {

							if (classes[i].length == 10) {
								classes[i].splice(7, 0, " ");
								let semester1 = [letterToFGPA(classes[i][4][1] || " "),letterToFGPA(classes[i][5][1] || " "),letterToFGPA(classes[i][6][0] || " ")];
								semester1 = average(
									semester1.filter(function(el) {
									return !isNaN(parseFloat(el)) && isFinite(el);
								}))
								classes[i][7] = [FGPAToLetter(semester1), "?"];

								classes[i].splice(11, 0, " ");
								
								let semester2 = [letterToFGPA(classes[i][8][1] || " "),letterToFGPA(classes[i][9][1] || " "),letterToFGPA(classes[i][10][0] || " ")];
								semester2 = average(
									semester2.filter(function(el) {
									return !isNaN(parseFloat(el)) && isFinite(el);
								}))
								classes[i][11] = [FGPAToLetter(semester2), "?"];
								
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
							gpa1.filter(function(el) {
								return !isNaN(parseFloat(el)) && isFinite(el);
							})
						).toFixed(2);
						gpa2 = average(
							gpa2.filter(function(el) {
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
				.then(function(response) {
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

function letterToFGPA(letter){
	let point = 0;
  
	if (letter.includes("A")){
		point += 4;
	}
  
	if (letter.includes("B")){
		point += 3;
	}
  
	if (letter.includes("C")){
		point += 2;
	}
  
	if (letter.includes("D")){
		point += 1;
	}
  
	if (letter.includes("-")){
		point -= 0.25;
	}
  
	if (letter.includes("+")){
		point += 0.25;
	}

	if (letter.trim() == ""){
		return NaN
	}
  
	return point;
  }
  
  function FGPAToLetter(fGPA){
	let letter = "";
	
	if (fGPA >= 3.75){
		letter += "A"
	} else if (fGPA >= 2.75){
		letter += "B"
	} else if (fGPA >= 1.75){
		letter += "C"
	} else if (fGPA >= 0.75){
		letter += "D"
	}
  
	if (fGPA%1 <= 0.25 && fGPA%1 > 0){
		letter += "+"
	}
  
	if (fGPA%1 >= 0.60){
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

var average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
