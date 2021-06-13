// global variables
var containerEl = document.querySelector(".container");
var timeBlockArray = [8,9,10,11,12,13,14,15,16,17];

// check current time and update timeblocks to present/past/future
var updateTimeBlocks = function() {
    console.log("time blocks updated");
    currentTime = moment().format("H");
    
    for (var i = 0; i < timeBlockArray.length; i++) {
        var timeBlockItem = document.querySelector("#box-" + timeBlockArray[i] +"");
        timeBlockItem.classList = "description col-sm-10";
        if(timeBlockArray[i] < currentTime) {
            timeBlockItem.classList.add("past");
        }
        else if (timeBlockArray[i] == currentTime){
            timeBlockItem.classList.add("present");
        }
        else if (timeBlockArray[i] > currentTime) {
            timeBlockItem.classList.add("future");
        }
    }
}

// initialize time blocks
updateTimeBlocks();

// update time blocks every 5 minutes
setInterval(function() {
    updateTimeBlocks();
}, (1000*60)*5);