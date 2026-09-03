const filterButtons = document.querySelectorAll(".filter-button");
const genreFilter = document.getElementById("genre-filter");

const eventRows = [...document.querySelectorAll(".event-row")];

const calendarPanel = document.getElementById("calendar-panel");
const calendarGrid = document.getElementById("calendar-grid");
const calendarMonthLabel = document.getElementById("calendar-month");

const calendarPrev = document.getElementById("calendar-prev");
const calendarNext = document.getElementById("calendar-next");

const noEventsMessage = document.getElementById("no-events");

let activeDateFilter = "tonight";
let selectedCalendarDate = null;

let calendarYear = 2026;
let calendarMonth = 8;


/* =====================================
   PROTOTYPE DATE

   We are pretending today's date is
   Friday, September 4, 2026.

   Later this will use the real date.
===================================== */

const prototypeToday = new Date(2026, 8, 4);


/* =====================================
   EVENT DATES
===================================== */

function getEventDate(eventRow) {
  const dateString = eventRow.dataset.date;

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}


/* =====================================
   DATE HELPERS
===================================== */

function sameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}


function endOfWeekend() {
  const result = new Date(prototypeToday);

  const currentDay = prototypeToday.getDay();

  const daysUntilSunday =
    currentDay === 0 ? 0 : 7 - currentDay;

  result.setDate(
    prototypeToday.getDate() + daysUntilSunday
  );

  result.setHours(23, 59, 59, 999);

  return result;
}


function sevenDaysFromToday() {
  const result = new Date(prototypeToday);

  result.setDate(
    prototypeToday.getDate() + 6
  );

  result.setHours(23, 59, 59, 999);

  return result;
}


function endOfMonth() {
  return new Date(
    prototypeToday.getFullYear(),
    prototypeToday.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
}


/* =====================================
   FILTER EVENTS
===================================== */

function eventMatchesDate(eventDate) {

  if (selectedCalendarDate) {
    return sameDay(
      eventDate,
      selectedCalendarDate
    );
  }


  if (activeDateFilter === "tonight") {
    return sameDay(
      eventDate,
      prototypeToday
    );
  }


  if (activeDateFilter === "weekend") {

    return (
      eventDate >= prototypeToday &&
      eventDate <= endOfWeekend()
    );
  }


  if (activeDateFilter === "seven") {

    return (
      eventDate >= prototypeToday &&
      eventDate <= sevenDaysFromToday()
    );
  }


  if (activeDateFilter === "month") {

    return (
      eventDate >= prototypeToday &&
      eventDate <= endOfMonth()
    );
  }


  return true;
}


function eventMatchesGenre(eventRow) {

  const selectedGenre =
    genreFilter.value;

  if (selectedGenre === "all") {
    return true;
  }

  const genres =
    eventRow.dataset.genre.split(" ");

  return genres.includes(selectedGenre);
}


function filterEvents() {

  let visibleCount = 0;

  eventRows.forEach((eventRow) => {

    const eventDate =
      getEventDate(eventRow);

    const matchesDate =
      eventMatchesDate(eventDate);

    const matchesGenre =
      eventMatchesGenre(eventRow);

    if (matchesDate && matchesGenre) {

      eventRow.style.display = "grid";
      visibleCount++;

    } else {

      eventRow.style.display = "none";

    }

  });


  if (visibleCount === 0) {

    noEventsMessage.classList.remove(
      "hidden"
    );

  } else {

    noEventsMessage.classList.add(
      "hidden"
    );

  }
}


/* =====================================
   DATE FILTER BUTTONS
===================================== */

filterButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      activeDateFilter =
        button.dataset.filter;

      selectedCalendarDate = null;


      if (
        activeDateFilter === "calendar"
      ) {

        calendarPanel.classList.remove(
          "hidden"
        );

        renderCalendar();

        return;
      }


      calendarPanel.classList.add(
        "hidden"
      );

      filterEvents();

    }
  );

});


/* =====================================
   GENRE FILTER
===================================== */

genreFilter.addEventListener(
  "change",
  filterEvents
);


/* =====================================
   CALENDAR
===================================== */

function renderCalendar() {

  calendarGrid.innerHTML = "";

  const monthName =
    new Date(
      calendarYear,
      calendarMonth,
      1
    ).toLocaleString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

  calendarMonthLabel.textContent =
    monthName;


  const firstDay =
    new Date(
      calendarYear,
      calendarMonth,
      1
    ).getDay();


  const daysInMonth =
    new Date(
      calendarYear,
      calendarMonth + 1,
      0
    ).getDate();


  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    const emptyCell =
      document.createElement("div");

    emptyCell.classList.add(
      "calendar-empty"
    );

    calendarGrid.appendChild(
      emptyCell
    );

  }


  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.textContent = day;


    const buttonDate =
      new Date(
        calendarYear,
        calendarMonth,
        day
      );


    const hasEvent =
      eventRows.some((eventRow) => {

        return sameDay(
          getEventDate(eventRow),
          buttonDate
        );

      });


    if (hasEvent) {

      button.classList.add(
        "has-event"
      );

    }


    if (
      selectedCalendarDate &&
      sameDay(
        selectedCalendarDate,
        buttonDate
      )
    ) {

      button.classList.add(
        "selected"
      );

    }


    button.addEventListener(
      "click",
      () => {

        selectedCalendarDate =
          buttonDate;

        renderCalendar();

        filterEvents();

      }
    );


    calendarGrid.appendChild(
      button
    );

  }

}


/* =====================================
   CALENDAR NAVIGATION
===================================== */

calendarPrev.addEventListener(
  "click",
  () => {

    calendarMonth--;

    if (calendarMonth < 0) {

      calendarMonth = 11;
      calendarYear--;

    }

    selectedCalendarDate = null;

    renderCalendar();

  }
);


calendarNext.addEventListener(
  "click",
  () => {

    calendarMonth++;

    if (calendarMonth > 11) {

      calendarMonth = 0;
      calendarYear++;

    }

    selectedCalendarDate = null;

    renderCalendar();

  }
);


/* =====================================
   START PAGE
===================================== */

filterEvents();
