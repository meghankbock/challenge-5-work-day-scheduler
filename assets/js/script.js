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

// check current time and update timeblocks to present/past/future + current date
var updateTimeBlocks = function () {
  currentTime = moment().format("H");

  // assign classes based on past, current, and future
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

  // render current date at top
  var currentDay = moment().format("dddd MMMM DD, YYYY");
  var spanEl = $("#date");
  spanEl.text(currentDay);
};

// blur event handler
var blurTextHandler = function (event) {
  var targetEl = $(event.target);
  var parentId = targetEl.closest(".time-block").attr("id");
  var textBoxId = parentId.replace("row", "box");
  var eventText = $("#" + textBoxId + "").val();
  var parentListId = targetEl
    .closest(".time-block")
    .attr("id")
    .replace("-", "");

  // enable delay before identifying active element
  setTimeout(function () {
    var activeEl = document.activeElement;

    // active element is html body
    if (activeEl.matches("body")) {
      targetEl.addClass("unsaved");
      return;
    }

    // active element is not html body
    var activeParentId = activeEl.closest(".time-block").getAttribute("id");

    // check it prior element and active element parents match and existing event text saved
    if (parentId != activeParentId && eventObj[parentListId].length !== 0) {
      // different parents and text has changed > add unsaved class
      if (eventText !== eventObj[parentListId][0].text) {
        targetEl.addClass("unsaved");
      }
      // remove unsaved class
      else {
        targetEl.removeClass("unsaved");
      }
    }
    // different parents, no existing event text, and event text not blank
    else if (
      parentId != activeParentId &&
      eventObj[parentListId].length === 0 &&
      eventText !== ""
    ) {
      // add unsaved class
      targetEl.addClass("unsaved");
    }
    // remove unsaved class
    else {
      targetEl.removeClass("unsaved");
    }
  }, 1);
};

// save button handler
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

  // event text empty
  if (!eventText) {
    if (eventObj[parentListId].length === 0 || !eventObj[parentListId]) {
      alert("You have not entered an event description.");
      return;
    } else eventObj[parentListId] = [];
    textBoxEl.removeClass("unsaved");
    saveEvents();
    return;
  }
  // create new event description
  else if (eventText) {
    if (eventObj[parentListId].length === 0 || !eventObj[parentListId]) {
      eventObj[parentListId] = [];
      eventObj[parentListId].push({
        text: eventText,
        id: textBoxId,
      });
    }
    // update existing event description
    else {
      eventObj[parentListId][0].text = eventText;
    }
  }
  // save events to local storage
  saveEvents();
  // remove unsaved class
  textBoxEl.removeClass("unsaved");
};

// create event
var createEvent = function (eventText, textBoxId) {
  var textBoxEl = $("#" + textBoxId + "");

  // add event text to corresponding time block row
  textBoxEl.text(eventText);
};

// load events from local storage
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
    return false;
  }

  // loop over object properties and add event text to page
  $.each(eventObj, function (list, arr) {
    arr.forEach(function (event) {
      createEvent(event.text, event.id);
    });
  });
};

// save events to local storage
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

// event on save button click
$(".saveBtn").click(saveButtonHandler);

// blur event on textarea
$("textarea").blur(blurTextHandler);
