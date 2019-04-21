var XLSX = require('xlsx');


var inputFile;
var letters = /^[0-9a-zA-Z]+$/;
var button = document.getElementById("print");
var trackList = [];
var timeList = [];
button.addEventListener("click",printText);
document.getElementById('file').onchange = function(){

  file = this.files[0];

  var reader = new FileReader();
  reader.onload = function(progressEvent){
    // Entire file
    inputFile = this.result;

    // By lines
    var lines = this.result.split('\n');
    
  };
  reader.readAsText(file);
};

function printText(){
  // console.log(inputFile);
  // var i = inputFile.search("SESSION NAME:");
  // console.log("SESSION NAME = "+inputFile[i+1]);
  getSessionName();
  getTrackInfo();
  // writeXL();
}

function getSessionName(){
  var temp;
  var lineFile = inputFile.split('\n');
  for (var i = 0; i<lineFile.length; i++){
    temp = lineFile[i];
    if (temp.search("SESSION NAME")!=-1){
      // console.log(temp+"\n");
      temp = temp.replace(/SESSION NAME:/g,"");
      temp = temp.replace( /\t/g, '');
      break;
    }
  }
  // console.log("Session name:"+temp);
}

function getTrackInfo(){
  var foundLines = [];
  var lineFile = inputFile.split('\n');
  var j = 0;
  var temp;

  
  


  for (var i = 0; i<lineFile.length; i++){
    var track = {
      name:"",
      clipList:[]
    };
    temp = "";
    if (lineFile[i].search("TRACK NAME:")!=-1){
      track.name = lineFile[i].replace(/TRACK NAME:/g,"");
      track.name = track.name.replace(/\t/g,"");

      i+=6;
      while(lineFile[i].length>0){
        temp = lineFile[i].split("\t");
        i++;
        var newClip = new Clip(temp[2],temp[3],temp[4],temp[5]);
        track.clipList.push(newClip);

        var startTime = {
          timeCode: newClip.startTime,
          frames: newClip.startTimeFrames
        };

        var endTime = {
          timeCode: newClip.endTime,
          frames: newClip.endTimeFrames
        };

        timeList.push(startTime);
        timeList.push(endTime);

      }

      trackList.push(track);

      
    } 

  }
  // console.log(trackList);
  timeList.sort(function(a, b){return a.frames - b.frames});
  console.log(timeList);
}

class Clip{
  constructor(name,startTime,endTime,duration){
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;
    this.startTimeFrames = this.convertToFrames(startTime);
    this.endTimeFrames = this.convertToFrames(endTime);
  }; 

  convertToFrames(time){
    var temp = time.trim();
    temp = temp.split(":");
    var hoursFrames = (parseInt(temp[0]))*60*60*30;
    var minutesFrames =  (parseInt(temp[1]))*60*30;
    var secondsFrames = (parseInt(temp[2]))*30;
    var frames = parseInt(temp[3]);
    var totalFrames = parseInt(hoursFrames)+parseInt(minutesFrames)+parseInt(secondsFrames)+parseInt(frames);
    // console.log(temp+" "+totalFrames);
    return totalFrames;
  }
};



function writeXL(){
  var filename = "write.xlsx";
  var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
  var ws_name = "SheetJS";

  var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);

  /* add worksheet to workbook */
  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  /* write workbook */
  XLSX.writeFile(wb, filename);

}