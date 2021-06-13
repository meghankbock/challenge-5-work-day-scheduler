// global variables
var containerEl = $(".container");
var timeBlockArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
var eventObj = {};
var eventArr = [];

// check current time and update timeblocks to present/past/future
var updateTimeBlocks = function () {
  console.log("time blocks updated");
  currentTime = moment().format("H");

  for (var i = 0; i < timeBlockArray.length; i++) {
    var timeBlockItem = $("#box-" + timeBlockArray[i] + "");
    timeBlockItem.classList = "description col-sm-10";
    if (timeBlockArray[i] < currentTime) {
      timeBlockItem.addClass("past");
    } else if (timeBlockArray[i] == currentTime) {
      timeBlockItem.addClass("present");
    } else if (timeBlockArray[i] > currentTime) {
      timeBlockItem.addClass("future");
    }
  }
};

//
var createEvent = function (eventText, textBoxId) {
  console.log("text: " + eventText + "/ id: " + textBoxId);
  var textBoxEl = $("#" + textBoxId + "");
  textBoxEl.text(eventText);
};

var loadEvent = function () {
  events = JSON.parse(localStorage.getItem("events"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!eventObj) {
    eventObj = {};
    console.log("no events in local storage");
    return false;
  }

  // loop over object properties
  $.each(events, function (index, event) {
    createEvent(event.text, event.id);
    eventArr.push(event);
  });
};

var saveEvents = function () {
  localStorage.setItem("events", JSON.stringify(eventArr));
};

// initialize time blocks
updateTimeBlocks();

// load events from local storage
loadEvent();

// update time blocks every 5 minutes
setInterval(function () {
  updateTimeBlocks();
}, 1000 * 60 * 5);

// event on save
$(".saveBtn").click(function (event) {
  var targetEl = $(event.target);
  var parentId = targetEl.closest(".time-block").attr("id");
  var textBoxId = parentId.replace("row", "box");
  var eventText = $("#" + textBoxId + "").val();
  console.log("event text: " + eventText);

  if (!eventText) {
    alert("You have not entered an event description");
    return;
    
  } else if (eventText) {
    createEvent(eventText, textBoxId);

    eventObj = {
      text: eventText,
      id: textBoxId,
    };

    eventArr.push(eventObj);

    saveEvents();
  }
});
