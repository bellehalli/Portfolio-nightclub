/* =========================================
   VANTA SOCIAL
   EVENT CALENDAR + PROMOTION ENGINE
========================================= */


/* =========================================
   PAGE ELEMENTS
========================================= */

const filterButtons =
  document.querySelectorAll(".filter-button");

const genreFilter =
  document.getElementById("genre-filter");

const eventRows =
  [...document.querySelectorAll(".event-row")];

const calendarPanel =
  document.getElementById("calendar-panel");

const calendarGrid =
  document.getElementById("calendar-grid");

const calendarMonthLabel =
  document.getElementById("calendar-month");

const calendarPrev =
  document.getElementById("calendar-prev");

const calendarNext =
  document.getElementById("calendar-next");

const noEventsMessage =
  document.getElementById("no-events");


/* EVENT DETAIL PANEL */

const eventDetailPanel =
  document.getElementById("event-detail-panel");

const detailEventName =
  document.getElementById("detail-event-name");

const detailOffers =
  document.getElementById("detail-offers");

const detailRegularPrice =
  document.getElementById("detail-regular-price");

const closeEventDetail =
  document.getElementById("close-event-detail");

const detailTicketButton =
  document.querySelector(".detail-ticket-button");

const eventDetailButtons =
  document.querySelectorAll(".event-detail-button");


/* =========================================
   PROTOTYPE DATE

   For this portfolio prototype,
   today = Friday September 4, 2026.

   For real clients we will switch this
   to the actual current date automatically.
========================================= */

const prototypeToday =
  new Date(2026, 8, 4);


/* =========================================
   FILTER STATE
========================================= */

let activeDateFilter = "tonight";

let selectedCalendarDate = null;

let calendarYear = 2026;

let calendarMonth = 8;


/* =========================================
   EVENT PROMOTION DATABASE

   THIS is where the club can choose
   different offers for each event.
========================================= */

const eventDetails = {

  velvet: {

    name: "Velvet Fridays",

    regularPrice: "From $20",

    offers: [

      {
        type: "insider",
        eyebrow: "VANTA INSIDERS",
        title: "$10 Insider Tickets",
        description:
          "Limited subscriber pricing for guests on the Vanta email or text list.",
        availability:
          "23 insider tickets remaining",
        button:
          "Unlock $10 Ticket"
      },

      {
        type: "ladies",
        eyebrow: "EARLY ENTRY",
        title: "Ladies Free Before 11",
        description:
          "Complimentary admission for eligible guests who RSVP and arrive before 11 PM.",
        availability:
          "RSVP required",
        button:
          "Join Guest List"
      },

      {
        type: "birthday",
        eyebrow: "CELEBRATING?",
        title: "Birthday Month Perk",
        description:
          "Birthday guests can unlock complimentary admission and special group offers.",
        availability:
          "Valid during your birthday month",
        button:
          "Claim Birthday Perk"
      },

      {
        type: "table",
        eyebrow: "TABLE OFFER",
        title: "$125 Table Credit",
        description:
          "Place a $100 table deposit and receive $125 applied toward your table minimum.",
        availability:
          "$25 bonus table value",
        button:
          "Reserve With Credit"
      }

    ]

  },


  afterhours: {

    name: "After Hours",

    regularPrice: "From $25",

    offers: [

      {
        type: "insider",
        eyebrow: "VANTA INSIDERS",
        title: "$10 Insider Tickets",
        description:
          "Subscriber-only admission released in limited quantities.",
        availability:
          "40 insider tickets available",
        button:
          "Unlock $10 Ticket"
      },

      {
        type: "table",
        eyebrow: "SATURDAY TABLES",
        title: "$300 Table Credit",
        description:
          "Place a $250 table deposit and receive $300 toward your table minimum.",
        availability:
          "$50 bonus table value",
        button:
          "Reserve With Credit"
      }

    ]

  },


  sunday: {

    name: "Sunday Service",

    regularPrice: "Free before 5",

    offers: [

      {
        type: "ladies",
        eyebrow: "DAY PARTY RSVP",
        title: "Ladies Free Before 5",
        description:
          "RSVP for complimentary entry when you arrive before 5 PM.",
        availability:
          "Limited RSVP capacity",
        button:
          "Join Guest List"
      },

      {
        type: "birthday",
        eyebrow: "BIRTHDAY SUNDAY",
        title: "Birthday Guest Free",
        description:
          "Celebrate your birthday month with complimentary host admission.",
        availability:
          "Birthday verification required",
        button:
          "Claim Birthday Perk"
      }

    ]

  },


  midnight: {

    name: "Midnight Social",

    regularPrice: "From $25",

    offers: [

      {
        type: "drop",
        eyebrow: "LIMITED DROP",
        title: "First 50 Free",
        description:
          "Vanta is releasing 50 complimentary admissions for this special event.",
        availability:
          "17 of 50 remaining",
        button:
          "Claim Free Ticket"
      },

      {
        type: "insider",
        eyebrow: "VANTA INSIDERS",
        title: "$10 Insider Tickets",
        description:
          "Missed the free drop? Subscribers can still unlock special $10 admission.",
        availability:
          "Limited quantity",
        button:
          "Unlock $10 Ticket"
      },

      {
        type: "vip",
        eyebrow: "SKIP THE WAIT",
        title: "VIP Express Entry",
        description:
          "Priority entrance through the expedited VIP line.",
        availability:
          "Limited passes available",
        button:
          "Get VIP Express"
      }

    ]

  },


  global: {

    name: "Global Frequency",

    regularPrice: "From $20",

    offers: [

      {
        type: "early",
        eyebrow: "EARLY BIRD",
        title: "$12 Early Bird",
        description:
          "Discounted admission available before standard ticket pricing begins.",
        availability:
          "Available while allocation lasts",
        button:
          "Get Early Bird"
      },

      {
        type: "birthday",
        eyebrow: "BIRTHDAY MONTH",
        title: "Birthday Perk",
        description:
          "Birthday guests can unlock special admission and group celebration offers.",
        availability:
          "Birthday verification required",
        button:
          "Claim Birthday Perk"
      }

    ]

  }

};


/* =========================================
   EVENT DATE HELPERS
========================================= */

function getEventDate(eventRow) {

  const dateString =
    eventRow.dataset.date;

  const [year, month, day] =
    dateString
      .split("-")
      .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );

}


function sameDay(date1, date2) {

  return (
    date1.getFullYear() ===
      date2.getFullYear() &&

    date1.getMonth() ===
      date2.getMonth() &&

    date1.getDate() ===
      date2.getDate()
  );

}


/* =========================================
   FILTER DATE RANGES
========================================= */

function endOfWeekend() {

  const result =
    new Date(prototypeToday);

  const currentDay =
    prototypeToday.getDay();

  const daysUntilSunday =
    currentDay === 0
      ? 0
      : 7 - currentDay;

  result.setDate(
    prototypeToday.getDate() +
      daysUntilSunday
  );

  result.setHours(
    23,
    59,
    59,
    999
  );

  return result;

}


function sevenDaysFromToday() {

  const result =
    new Date(prototypeToday);

  result.setDate(
    prototypeToday.getDate() + 6
  );

  result.setHours(
    23,
    59,
    59,
    999
  );

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


/* =========================================
   EVENT FILTERING
========================================= */

function eventMatchesDate(eventDate) {

  if (selectedCalendarDate) {

    return sameDay(
      eventDate,
      selectedCalendarDate
    );

  }


  if (
    activeDateFilter === "tonight"
  ) {

    return sameDay(
      eventDate,
      prototypeToday
    );

  }


  if (
    activeDateFilter === "weekend"
  ) {

    return (

      eventDate >=
        prototypeToday &&

      eventDate <=
        endOfWeekend()

    );

  }


  if (
    activeDateFilter === "seven"
  ) {

    return (

      eventDate >=
        prototypeToday &&

      eventDate <=
        sevenDaysFromToday()

    );

  }


  if (
    activeDateFilter === "month"
  ) {

    return (

      eventDate >=
        prototypeToday &&

      eventDate <=
        endOfMonth()

    );

  }


  if (
    activeDateFilter === "calendar"
  ) {

    return true;

  }


  return true;

}


function eventMatchesGenre(eventRow) {

  if (!genreFilter) {
    return true;
  }

  const selectedGenre =
    genreFilter.value;

  if (
    selectedGenre === "all"
  ) {

    return true;

  }

  const genres =
    eventRow.dataset.genre
      .split(" ");

  return genres.includes(
    selectedGenre
  );

}


/* =========================================
   APPLY FILTERS
========================================= */

function filterEvents() {

  let visibleCount = 0;

  eventRows.forEach(
    (eventRow) => {

      const eventDate =
        getEventDate(
          eventRow
        );

      const matchesDate =
        eventMatchesDate(
          eventDate
        );

      const matchesGenre =
        eventMatchesGenre(
          eventRow
        );


      if (
        matchesDate &&
        matchesGenre
      ) {

        eventRow.style.display =
          "grid";

        visibleCount++;

      } else {

        eventRow.style.display =
          "none";

      }

    }
  );


  if (!noEventsMessage) {
    return;
  }


  if (
    visibleCount === 0
  ) {

    noEventsMessage
      .classList
      .remove("hidden");

  } else {

    noEventsMessage
      .classList
      .add("hidden");

  }

}


/* =========================================
   DATE FILTER BUTTONS
========================================= */

filterButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        filterButtons.forEach(
          (btn) => {

            btn.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        activeDateFilter =
          button.dataset.filter;


        selectedCalendarDate =
          null;


        if (
          activeDateFilter ===
          "calendar"
        ) {

          calendarPanel
            .classList
            .remove("hidden");

          renderCalendar();

          filterEvents();

          return;

        }


        calendarPanel
          .classList
          .add("hidden");


        filterEvents();

      }
    );

  }
);


/* =========================================
   VIBE FILTER
========================================= */

if (genreFilter) {

  genreFilter.addEventListener(
    "change",
    filterEvents
  );

}


/* =========================================
   CALENDAR
========================================= */

function renderCalendar() {

  if (!calendarGrid) {
    return;
  }


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


  /* EMPTY CELLS */

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    const emptyCell =
      document.createElement(
        "div"
      );

    emptyCell.classList.add(
      "calendar-empty"
    );

    calendarGrid.appendChild(
      emptyCell
    );

  }


  /* DATE BUTTONS */

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.textContent =
      day;


    const buttonDate =
      new Date(

        calendarYear,

        calendarMonth,

        day

      );


    const hasEvent =
      eventRows.some(
        (eventRow) => {

          return sameDay(

            getEventDate(
              eventRow
            ),

            buttonDate

          );

        }
      );


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


/* =========================================
   CALENDAR NAVIGATION
========================================= */

if (calendarPrev) {

  calendarPrev.addEventListener(
    "click",
    () => {

      calendarMonth--;

      if (
        calendarMonth < 0
      ) {

        calendarMonth = 11;

        calendarYear--;

      }


      selectedCalendarDate =
        null;


      renderCalendar();

      filterEvents();

    }
  );

}


if (calendarNext) {

  calendarNext.addEventListener(
    "click",
    () => {

      calendarMonth++;

      if (
        calendarMonth > 11
      ) {

        calendarMonth = 0;

        calendarYear++;

      }


      selectedCalendarDate =
        null;


      renderCalendar();

      filterEvents();

    }
  );

}


/* =========================================
   PROMOTION CARDS
========================================= */

function createOfferCard(
  offer,
  eventKey
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "offer-card";


  card.dataset.offerType =
    offer.type;


  card.innerHTML = `

    <div class="offer-card-top">

      <span class="offer-eyebrow">
        ${offer.eyebrow}
      </span>

      <span class="offer-icon">
        ✦
      </span>

    </div>

    <h4>
      ${offer.title}
    </h4>

    <p>
      ${offer.description}
    </p>

    <div class="offer-availability">
      ${offer.availability}
    </div>

    <button
      type="button"
      class="offer-action"
      data-event="${eventKey}"
      data-offer="${offer.type}"
    >
      ${offer.button}
    </button>

  `;


  const actionButton =
    card.querySelector(
      ".offer-action"
    );


  actionButton.addEventListener(
    "click",
    () => {

      handleOfferAction(
        card,
        actionButton,
        offer
      );

    }
  );


  return card;

}


/* =========================================
   OFFER ACTIONS

   Prototype interactions only.
   Real clients will connect these
   to email/SMS/ticket/table systems.
========================================= */

function handleOfferAction(
  card,
  button,
  offer
) {

  if (
    offer.type === "insider" ||
    offer.type === "drop"
  ) {

    showSubscriberUnlock(
      card,
      button,
      offer
    );

    return;

  }


  if (
    offer.type === "birthday"
  ) {

    showBirthdayUnlock(
      card,
      button
    );

    return;

  }


  if (
    offer.type === "ladies"
  ) {

    button.textContent =
      "RSVP Added ✓";

    button.disabled =
      true;

    return;

  }


  if (
    offer.type === "table"
  ) {

    button.textContent =
      "Table Request Started ✓";

    button.disabled =
      true;

    return;

  }


  if (
    offer.type === "vip"
  ) {

    button.textContent =
      "VIP Pass Selected ✓";

    button.disabled =
      true;

    return;

  }


  if (
    offer.type === "early"
  ) {

    button.textContent =
      "Early Bird Selected ✓";

    button.disabled =
      true;

    return;

  }


  button.textContent =
    "Selected ✓";

  button.disabled =
    true;

}


/* =========================================
   EMAIL / SMS UNLOCK
========================================= */

function showSubscriberUnlock(
  card,
  button,
  offer
) {

  if (
    card.querySelector(
      ".offer-unlock-form"
    )
  ) {

    return;

  }


  button.style.display =
    "none";


  const form =
    document.createElement(
      "form"
    );


  form.className =
    "offer-unlock-form";


  form.innerHTML = `

    <label>
      Email
      <input
        type="email"
        required
        placeholder="you@email.com"
      >
    </label>

    <label>
      Mobile
      <input
        type="tel"
        required
        placeholder="(313) 555-0000"
      >
    </label>

    <button
      type="submit"
      class="offer-submit"
    >
      Join & Unlock
    </button>

    <small>
      Prototype signup only.
      No information is being stored.
    </small>

  `;


  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      form.innerHTML = `

        <div class="offer-success">

          ✓ Unlocked

          <strong>
            ${offer.title}
          </strong>

          <span>
            Your prototype ticket offer
            is ready.
          </span>

        </div>

      `;

    }
  );


  card.appendChild(
    form
  );

}


/* =========================================
   BIRTHDAY UNLOCK
========================================= */

function showBirthdayUnlock(
  card,
  button
) {

  if (
    card.querySelector(
      ".birthday-unlock-form"
    )
  ) {

    return;

  }


  button.style.display =
    "none";


  const form =
    document.createElement(
      "form"
    );


  form.className =
    "offer-unlock-form birthday-unlock-form";


  form.innerHTML = `

    <label>
      Birthday

      <input
        type="date"
        required
      >
    </label>

    <label>
      Email

      <input
        type="email"
        required
        placeholder="you@email.com"
      >
    </label>

    <button
      type="submit"
      class="offer-submit"
    >
      Check Birthday Perk
    </button>

    <small>
      Prototype only.
      Birthday eligibility is not
      being verified or stored.
    </small>

  `;


  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      form.innerHTML = `

        <div class="offer-success">

          🎂 Birthday perk unlocked

          <span>
            Complimentary birthday
            admission selected.
          </span>

        </div>

      `;

    }
  );


  card.appendChild(
    form
  );

}


/* =========================================
   OPEN EVENT DETAIL PANEL
========================================= */

function openEventDetail(
  eventKey
) {

  const event =
    eventDetails[eventKey];


  if (!event) {
    return;
  }


  detailEventName.textContent =
    event.name;


  detailRegularPrice.textContent =
    event.regularPrice;


  detailOffers.innerHTML =
    "";


  event.offers.forEach(
    (offer) => {

      detailOffers.appendChild(

        createOfferCard(
          offer,
          eventKey
        )

      );

    }
  );


  eventDetailPanel
    .classList
    .remove("hidden");


  eventDetailPanel
    .scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

}


/* =========================================
   EVENT VIEW BUTTONS
========================================= */

eventDetailButtons.forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        const eventKey =
          button.dataset.event;


        openEventDetail(
          eventKey
        );

      }
    );

  }
);


/* =========================================
   CLOSE EVENT DETAILS
========================================= */

if (closeEventDetail) {

  closeEventDetail.addEventListener(
    "click",
    () => {

      eventDetailPanel
        .classList
        .add("hidden");

    }
  );

}


/* =========================================
   REGULAR TICKET BUTTON
========================================= */

if (detailTicketButton) {

  detailTicketButton.addEventListener(
    "click",
    () => {

      detailTicketButton
        .textContent =
        "Regular Ticket Selected ✓";


      setTimeout(
        () => {

          detailTicketButton
            .textContent =
            "Buy Regular Ticket →";

        },
        1800
      );

    }
  );

}


/* =========================================
   START WEBSITE
========================================= */

renderCalendar();

filterEvents();
/* =========================================
   TABLE SELECTION
========================================= */

const tableButtons =
  document.querySelectorAll(
    ".table-select-button"
  );

tableButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const tableName =
        button.dataset.table;

      const tableSection =
        document.querySelector(
          ".table-request-panel"
        );

      tableSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      button.textContent =
        `${tableName} Selected ✓`;

    }
  );

});


/* =========================================
   PROTOTYPE FORMS
========================================= */

function activatePrototypeForm(
  formId,
  messageId
) {

  const form =
    document.getElementById(
      formId
    );

  const message =
    document.getElementById(
      messageId
    );

  if (!form || !message) {
    return;
  }

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      message.classList.remove(
        "hidden"
      );

    }
  );

}


activatePrototypeForm(
  "table-request-form",
  "table-form-message"
);

activatePrototypeForm(
  "guest-list-form",
  "guest-form-message"
);

activatePrototypeForm(
  "insider-form",
  "insider-message"
);
/* =====================================
   TABLE + BOTTLE SERVICE BUILDER
===================================== */

const sectionButtons = document.querySelectorAll(
  ".section-select-button"
);

const bottleTabs = document.querySelectorAll(
  ".bottle-tab"
);

const bottleItems = document.querySelectorAll(
  ".bottle-item"
);

const addBottleButtons = document.querySelectorAll(
  ".add-bottle"
);

const selectedSectionText = document.getElementById(
  "selected-section-text"
);

const bottleTotalElement = document.getElementById(
  "bottle-total"
);

const minimumProgress = document.getElementById(
  "minimum-progress"
);

const minimumMessage = document.getElementById(
  "minimum-message"
);

const continueReservation = document.getElementById(
  "continue-reservation"
);


let selectedSection = null;

let selectedMinimum = 0;

let selectedDeposit = 0;

let selectedCredit = 0;

let bottleTotal = 0;


/* =====================================
   SECTION DATA
===================================== */

const sectionData = {
  "main-floor": {
    name: "Main Floor Booth",
    minimum: 500,
    deposit: 100,
    credit: 125
  },

  "vip-wall": {
    name: "VIP Wall Booth",
    minimum: 750,
    deposit: 150,
    credit: 200
  },

  "dj-section": {
    name: "DJ Section",
    minimum: 1200,
    deposit: 250,
    credit: 325
  },

  "center-booth": {
    name: "Premium Center Booth",
    minimum: 1500,
    deposit: 300,
    credit: 400
  }
};


/* =====================================
   SELECT A SECTION
===================================== */

sectionButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const sectionKey =
        button.dataset.section;

      const section =
        sectionData[sectionKey];

      selectedSection =
        sectionKey;

      selectedMinimum =
        section.minimum;

      selectedDeposit =
        section.deposit;

      selectedCredit =
        section.credit;


      sectionButtons.forEach((btn) => {
        btn.classList.remove("selected");
        btn.textContent = "Select Booth →";
      });


      button.classList.add("selected");

      button.textContent =
        "Selected ✓";


      selectedSectionText.textContent =
        `${section.name} · $${section.minimum} minimum · $${section.deposit} deposit`;


      updateBookingBuilder();


      document
        .getElementById("bottle-service")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }
  );

});


/* =====================================
   BOTTLE CATEGORY FILTERS
===================================== */

bottleTabs.forEach((tab) => {

  tab.addEventListener(
    "click",
    () => {

      bottleTabs.forEach((btn) => {
        btn.classList.remove("active");
      });

      tab.classList.add("active");

      const selectedCategory =
        tab.dataset.bottleFilter;


      bottleItems.forEach((item) => {

        const itemCategory =
          item.dataset.category;

        if (
          selectedCategory === "all" ||
          itemCategory === selectedCategory
        ) {

          item.style.display = "flex";

        } else {

          item.style.display = "none";

        }

      });

    }
  );

});


/* =====================================
   ADD BOTTLES / PACKAGES
===================================== */

addBottleButtons.forEach((button) => {

  let quantity = 0;

  button.addEventListener(
    "click",
    () => {

      const price =
        Number(button.dataset.price);

      const name =
        button.dataset.name;


      quantity++;

      bottleTotal += price;


      button.textContent =
        quantity === 1
          ? "Added ✓"
          : `Added ×${quantity}`;


      button.classList.add("selected");


      updateBookingBuilder();


      console.log(
        `${name} added. Quantity: ${quantity}`
      );

    }
  );

});


/* =====================================
   UPDATE TABLE BUILDER
===================================== */

function updateBookingBuilder() {

  bottleTotalElement.textContent =
    `$${bottleTotal.toLocaleString()}`;


  if (!selectedSection) {

    minimumProgress.style.width =
      "0%";

    minimumMessage.textContent =
      "Choose a booth to see your minimum.";

    continueReservation.disabled =
      true;

    return;
  }


  const percentage =
    Math.min(
      (bottleTotal / selectedMinimum) * 100,
      100
    );


  minimumProgress.style.width =
    `${percentage}%`;


  const remaining =
    selectedMinimum - bottleTotal;


  if (remaining > 0) {

    minimumMessage.textContent =
      `$${remaining.toLocaleString()} more to reach your $${selectedMinimum.toLocaleString()} minimum.`;

    continueReservation.disabled =
      true;

  } else {

    minimumMessage.textContent =
      `Minimum reached ✓ Your $${selectedDeposit} deposit receives $${selectedCredit} in table credit.`;

    continueReservation.disabled =
      false;

  }

}


/* =====================================
   CONTINUE RESERVATION
===================================== */

continueReservation.addEventListener(
  "click",
  () => {

    if (!selectedSection) {
      return;
    }


    if (bottleTotal < selectedMinimum) {
      return;
    }


    alert(
      "Reservation builder is ready. Next we’ll connect this button to the guest info + checkout flow."
    );

  }
);
