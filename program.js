"use strict";
var data = {};
var dataNumbers = [];
var dataLabels = [];
var sortedDatalabels = [];
var smallLetters = getAlphabets('a', 'z');

window.onload = function(){
  document.getElementById('fileinput').addEventListener('change', readFile);
  document.getElementById('canvas').innerHTML = drawBar(dataNumbers, smallLetters); //Display empty chart while webpage onload
};

function drawBar (data, labels){
/* This function will get two arrays as parameters, clear the canvase, and draw a bar graph with the parameters using RGraph. */
  RGraph.Reset(document.getElementById('canvas')); //Reset canvas to avoid overlapping
    var bar = new RGraph.Bar({
        id: 'canvas',
        data: data,
        options: {
            textAccessible: true,
            textFont: 'Times',
            labels: labels,
            tooltips: labels,
            tooltipsEvent: 'onmousemove',
            gutterLeft: 90,
            gutterRight: 1,
            gutterTop: 30,
            backgroundGridWidth: 1.2,
            textSize: 13.5,
            labelsAbove: true,
            labelsAboveOffset: 2,
            title: "Frequency Analysis of Alphabetical Character",
            titleSize: 15,
            titleY: -22,
            titleBold: true,
            titleXaxis: "Character",
            titleXaxisY: 510,
            titleYaxis: "Frequency",
            titleYaxisX: 10,
            ylabelsCount: 10,
            labelsAboveSize: 10,
        }
    }).draw()
}

function readFile(file){
  /* This function will first read file and alert user whether file input is loaded successfully. While
   * reader onload after file input successfully, it will count the occurrence of each letter within
   * the file content and store it within a dictionary and arrays, which will be used to display graph.
   */
  var f = file.target.files[0]; //The first of the FileList Object
  var reader = new FileReader();

  if (f){
    reader.onload = function(e){
      RGraph.Reset(document.getElementById('canvas')); //Reset canvas to avoid overlapping
      var content = e.target.result; //Text file content
      dataNumbers = [];  //Reset array
      dataLabels = []; //Reset array

      for (var i = 0; i < smallLetters.length; i++) {
        var occurrence = content.toLowerCase().count(smallLetters[i]); //Count number of occurrence of each letter within content
        data[smallLetters[i]] = occurrence; //Store occurrence of letter according to alphabetical order within dictionary of 'data'
        if(occurrence == 0){
          continue;
        } else {
          dataNumbers.push(occurrence);
          dataLabels.push(smallLetters[i]);
        }
      }
      alert("File loaded successfully");
      drawBar(dataNumbers, dataLabels);
    }
    reader.readAsText(f, "UTF-8");
  } else {
    alert("Failed to load file");
  }
}

function drawButton() {
  /* This function will call drawBar function with arguments passed in. */
  drawBar(dataNumbers, dataLabels);
}

function sortButton() {
  /* This function will store sorted values (value more than zero) within an array and get the
   * correct letter of each number into an array before passing them into 'drawBar' function.
   */
  var sortedDataNumbers = sort(data);
  var sortedDataNumbers1 = [];
  sortedDatalabels = []; //Reset array to clear unncessary data

  for (var i = 0; i < sortedDataNumbers.length; i++) {
    if (sortedDataNumbers[i] == 0){ //Continue if occurrence is zero
      continue;
    } else {
      sortedDataNumbers1.push(sortedDataNumbers[i]); //Store data with value more than zero
      var dataKey = data.getkey(sortedDataNumbers[i]);
      sortedDatalabels.push(dataKey);
    }
  }
  drawBar(sortedDataNumbers1, sortedDatalabels);
}

Object.prototype.getkey = function(value) {
  /* This prototype property receives a value as parameter and return the correct letter (that holds the similar value) from object. */
  for (var i = 0; i < smallLetters.length; i++) {
    if (this[smallLetters[i]] == value) {   //Loop throught object to find the correct key (letter) with the same value
      for (var j = 0; j <= sortedDatalabels.length; j++) {
        if (j == sortedDatalabels.length){
          return smallLetters[i]; //Return letter if only the letter has not been used
        } else if (smallLetters[i] == sortedDatalabels[j]) {
          break; //Break the loop if letter is used
        } else if (smallLetters[i] != sortedDatalabels[j]) { //Condition to ensure no similar letter within array of sortedDatalabels
          continue; //Continue to next letter if letter is not found within sortedDatalabels
        }
      }
    }
  }
};

String.prototype.count = function(letter) {
  /* This prototype property receives a letter as parameter and counts the number of occurence of the letter
   * within a string and return the count.
   */
  var count = 0;
  for(var i = 0; i < this.length; i++) {
    if(this[i] == letter){
      count++;
    }
  }
  return count;
};

function sort(dict) {
  /* This function will receive a dictionary as parameter and store the values of dictionary into an array
   * before sorted out the array in descending order and return it.
   */
  var sortedValues1 = [], sortedValues2 = [];
  for (var i = 0; i < smallLetters.length ; i++){
      sortedValues1.push(dict[smallLetters[i]]); //Store dictionary values into an array
  }
  sortedValues1.sort(function(a, b){return b-a}); //Sort number in descending order
  return sortedValues1;
}

function getAlphabets(charA, charZ) {
  /* This function will get two letters as parameters and return sequence of Unicode values from
   * the first parameter to the second parameter based on the UTF-8 reference.
   */
    var alphabets = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        alphabets.push(String.fromCharCode(i));
    }
    return alphabets;
}
