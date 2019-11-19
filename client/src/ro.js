const WEEKDAYS_LONG = {
  ro: ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"]
};
const WEEKDAYS_SHORT = {
  ro: ["D", "L", "Ma", "Mi", "J", "V", "S"]
};
const MONTHS = {
  ro: [
    "Ianuaria",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie"
  ]
};

const FIRST_DAY = {
  ro: 1
};

function formatDay(d, locale = "ro") {
  return `${WEEKDAYS_LONG[locale][d.getDay()]}, ${d.getDate()} ${
    MONTHS[locale][d.getMonth()]
  } ${d.getFullYear()}`;
}

function formatMonthTitle(d, locale = "ro") {
  return `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`;
}

function formatWeekdayShort(i, locale) {
  return WEEKDAYS_SHORT[locale][i];
}

function formatWeekdayLong(i, locale) {
  return WEEKDAYS_SHORT[locale][i];
}

function getFirstDayOfWeek(locale) {
  return FIRST_DAY[locale];
}

const localeUtils = {
  formatDay,
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek
};

export default localeUtils;
