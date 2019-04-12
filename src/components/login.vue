<template>
	<div v-on:keyup.enter="login">
		<input type="text" placeholder="Username" v-model="username"><br>
		<input type="password" placeholder="Password" v-model="password"><br>
		<select v-model="school">
			<option value="unselected" disabled>Select School</option>
			<option v-for="school in schools" v-bind:value="school[0]" v-if="school[1].indexOf('Elementary') < 0">
    		{{ school[1] }}
  		</option>
		</select>
		<br>
		<button v-on:click="login" type="button">Login</button>
	</div>
</template>

<script>
export default {
  name: 'gpa',
  props: {
    data: Object
  },
  data: function () {
    return {
      school: localStorage.getItem("school") || "unselected",
      username: localStorage.getItem("username") || "",
      password: ""
    }
  },
  computed: {
  	schools(){
  		return this.$store.state.schools;
  	}
  },
  methods: {
    login: function (event) {
        var login = [this.username, this.password, this.school];
        localStorage.setItem('school', this.school);
        localStorage.setItem('username', this.username);
        this.$store.dispatch("getGrades", login);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin-top: 25px;
  width: 100%;
  max-width: 200px;
  height: 75px;
  background-color: #4183C4;
  color: #f5f5f5;
  border: none;
  font-size: 1.4rem;
  border-radius: 10px;
  
  transition: background-color 0.3s;
  transition: border-radius 0.3s;
}

input {
  margin-top: 25px;
  width: 100%;
  max-width: 300px;
  height: 35px;
  border-radius: 5px;
  text-indent: 10px;
}

select {
  margin-top: 25px;
  width: 100%;
  max-width: 300px;
  height: 45px;
  border-radius: 5px;
  text-indent: 10px;
}

button:hover {
  background-color: #004A85;
  cursor: pointer;
  border-radius: 15px;
}
</style>
