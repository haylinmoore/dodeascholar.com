var schools = [];

var selector = document.getElementsByTagName("select")[0]

for (var i in selector.options){
  schools.push([selector.options[i].value, selector.options[i].label])
}

schools.sort(function (a, b) {
  if (a[1] > b[1]) {
    return 1;
  }
  if (a[1] < b[1]) {
    return -1;
  }
  // a must be equal to b
  return 0;
});