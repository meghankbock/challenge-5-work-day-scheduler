// global variables
var containerEl = $(".container");
var timeBlockArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
var eventObj = {
  row8: [],
  row9: [],
  row10: [],
  row11: [],
  row12: [],
  row13: [],
  row14: [],
  row15: [],
  row16: [],
  row17: [],
};
//var eventArr = [];

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

  var currentDay = moment().format("dddd MMMM DD, YYYY");
  var spanEl = $("#date");
  spanEl.text(currentDay);
};

var blurTextHandler = function (event) {
  var targetEl = $(event.target);
  var parentId = targetEl.closest(".time-block").attr("id");
  var textBoxId = parentId.replace("row", "box");
  var eventText = $("#" + textBoxId + "").val();
  var closestBtn = targetEl.closest('.time-block').children('.saveBtn');
  var unsavedSpanEl = targetEl.closest('.time-block').children('.unsaved-text');
  console.log("unsavedSpanEl: " + unsavedSpanEl);
  var parentListId = targetEl
    .closest(".time-block")
    .attr("id")
    .replace("-", "");
  setTimeout(function () {
    var activeEl = document.activeElement;
    var activeParentId = activeEl.closest(".time-block").getAttribute("id");
    
    /*if (targetEl.is("button")) {
        textBoxEl.removeClass("unsaved");
        console.log("class removed");
    }*/
    if (parentId != activeParentId && eventObj[parentListId].length !== 0) {
      if (eventText !== eventObj[parentListId][0].text) {
        targetEl.addClass("unsaved");
        console.log("class added");
      } else {
        targetEl.removeClass("unsaved");
        console.log("class removed");
      }
    } 
    else if (parentId != activeParentId && eventObj[parentListId].length === 0 && eventText !== "") { 
        targetEl.addClass("unsaved");
        unsavedSpanEl.text("Unsaved Changes");
        console.log("class added");
    }
    else {
        targetEl.removeClass("unsaved");
        console.log("class removed");
    }
  }, 1);
};

var saveButtonHandler = function (event) {
  var targetEl = $(event.target);
  var parentId = targetEl.closest(".time-block").attr("id");
  var parentListId = targetEl
    .closest(".time-block")
    .attr("id")
    .replace("-", "");
  var textBoxId = parentId.replace("row", "box");
  var eventText = $("#" + textBoxId + "").val();
  var textBoxEl = $("#" + textBoxId + "");

  if (!eventText) {
    if (eventObj[parentListId].length === 0 || !eventObj[parentListId]) {
      alert("You have not entered an event description.");
      return;
    } else eventObj[parentListId] = [];
    textBoxEl.removeClass("unsaved");
    saveEvents();
    return;
  } else if (eventText) {
    if (eventObj[parentListId].length === 0 || !eventObj[parentListId]) {
      eventObj[parentListId] = [];
      eventObj[parentListId].push({
        text: eventText,
        id: textBoxId,
        status: "saved",
      });
    } else {
      eventObj[parentListId][0].text = eventText;
    }
  }
  saveEvents();
  textBoxEl.removeClass("unsaved");
};

//
var createEvent = function (eventText, textBoxId) {
  var textBoxEl = $("#" + textBoxId + "");
  textBoxEl.text(eventText);
};

var loadEvent = function () {
  eventObj = JSON.parse(localStorage.getItem("events"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!eventObj) {
    eventObj = {
      row8: [],
      row9: [],
      row10: [],
      row11: [],
      row12: [],
      row13: [],
      row14: [],
      row15: [],
      row16: [],
      row17: [],
    };
    console.log("no events in local storage");
    return false;
  }

  // loop over object properties
  $.each(eventObj, function (list, arr) {
    arr.forEach(function (event) {
      createEvent(event.text, event.id);
      //eventArr.push(event);
    });
  });
};

var saveEvents = function () {
  localStorage.setItem("events", JSON.stringify(eventObj));
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
$(".saveBtn").click(saveButtonHandler);

$("textarea").blur(blurTextHandler);
