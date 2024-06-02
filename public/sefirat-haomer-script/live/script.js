document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

let today, todayHebrewObj, isAfterSunset, todayHebrew, todayOmer;
const Hebcal = window.Hebcal;
const dayjs = window.dayjs;
dayjs.locale('he');
const params = new URLSearchParams(location.search);
const urlOptions = Object.fromEntries(params.entries());
const options = {
  nusach: urlOptions.nusach || 'sf',
  fontSize: urlOptions.fontSize,
  hideDate: urlOptions.hideDate === 'true',
  hideSefira: urlOptions.hideSefira === 'true'
};

const omerLink = document.querySelector('.omer');
if (options.fontSize) {
  omerLink.style.fontSize = options.fontSize + 'px';
}
omerLink.setAttribute('href', `https://sefirat-haomer.vercel.app/?source=iframe&nusach=${options.nusach}`);

const numberLetterList = {
  1: 'אֶחָד',
  2: 'שְׁנֵי',
  '2a': 'שְׁנַיִם',
  3: 'שְׁלֹשָׁה',
  4: 'אַרְבָּעָה',
  5: 'חֲמִשָּׁה',
  6: 'שִׁשָּׁה',
  7: 'שִׁבְעָה',
  8: 'שְׁמוֹנָה',
  9: 'תִּשְׁעָה',
  10: 'עָשָׂר',
  11: 'אַחַד עָשָׂר',
  12: 'שְׁנֵים עָשָׂר',
  20: 'עֶשְׂרִים',
  30: 'שְׁלֹשִׁים',
  40: 'אַרְבָּעִים'
};
const sefiraList = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

function setupHebrewDate () {
  todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
  todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem
}

function setupDate () {
  today = dayjs();
  setupHebrewDate();

  isAfterSunset = today.isAfter(todayHebrewObj.sunset());
  if (isAfterSunset) {
    today = today.add(1, 'days');
    setupHebrewDate();
  }

  todayHebrew = todayHebrewObj.toString('h');
  todayOmer = todayHebrewObj.omer();
  try {
    if (top.location.href === 'https://sefirat-haomer.vercel.app/sefirat-haomer-script/') {
      todayOmer = todayOmer || 1;
    }
  } catch (error) { }

  let weekDay = isAfterSunset || today.hour() < 5 ? 'אור ל' : '';
  weekDay += 'יום ' + today.format('dddd');
  if (!options.hideDate) {
    const header = document.querySelector('.header');
    const weekDayElement = document.querySelector('.week-day');
    const hebrewDateElement = document.querySelector('.hebrew-date');
    header.style.display = 'block';
    weekDayElement.textContent = weekDay;
    hebrewDateElement.textContent = todayHebrew;
  }
}

function getDays (number) {
  let day;

  if (number === 1) {
    day = 'יוֹם אֶחָד';
  } else if (number < 10) {
    day = numberLetterList[number] + ' יָמִים';
  } else if (number === 10) {
    day = 'עַשָׂרָה יָמִים';
  } else {
    if ([11, 12, 20, 30, 40].indexOf(number) >= 0) {
      day = numberLetterList[number];
    } else {
      const stringNumber = number.toString();
      day = (numberLetterList[stringNumber[1] + 'a'] || numberLetterList[stringNumber[1]]);
      day += ' ';
      day += (stringNumber[0] === '3') ? 'וּ' : (number > 20) ? 'וְ' : '';
      day += numberLetterList[stringNumber[0] + '0'];
    }
    day += ' יוֹם';
  }
  return day;
}

function writeDays () {
  const day = getDays(todayOmer);
  let suffix = '';
  if (todayOmer && todayOmer < 7) {
    suffix = options.nusach === 'sf' ? ' לָעוֹמֶר' : options.nusach === 'as' ? ' בָּעוֹמֶר' : '';
  }
  if (options.nusach === 'em') {
    suffix = ' לָעוֹמֶר';
  }
  const dayElement = document.querySelector('.day');
  dayElement.textContent = day + suffix;
}

function writeWeeks () {
  if (todayOmer < 7) {
    return;
  }
  const weeks = Math.floor(todayOmer / 7);
  const leftDays = (todayOmer % 7);
  let week = 'שֶׁהֵם ';

  if (weeks === 1) {
    week += 'שָׁבוּעַ אֶחָד ';
  } else {
    week += numberLetterList[weeks];
    week += ' שָׁבוּעוֹת';
  }

  if (leftDays) {
    week += ' ';
    if (leftDays === 5) {
      week += 'וַ';
    } else if ([2, 3].indexOf(leftDays) >= 0) {
      week += 'וּ';
    } else {
      week += 'וְ';
    }
    week += getDays(leftDays);
  }

  const suffix = (options.nusach === 'sf' ? ' לָעוֹמֶר' : options.nusach === 'as' ? ' בָּעוֹמֶר' : '');
  document.querySelector('.week').textContent = week + suffix;
}

function writeSefira () {
  if (!todayOmer) {
    return;
  }
  let todaySefira = (sefiraList[(todayOmer % 7) - 1] || sefiraList[6]);
  todaySefira += ' שב';
  if (todayOmer % 7) {
    todaySefira += sefiraList[Math.floor(todayOmer / 7)];
  } else {
    todaySefira += sefiraList[Math.floor(todayOmer / 7) - 1];
  }
  const sefiraElement = document.querySelector('.sefira');
  sefiraElement.textContent = todaySefira;
}

function toggleNoOmer () {
  const omer = document.querySelector('.omer');
  const noOmer = document.querySelector('.no-omer');
  omer.style.display = todayOmer ? 'block' : 'none';
  noOmer.style.display = todayOmer ? 'none' : 'block';
}

function lagBaomer () {
  if (todayOmer === 33 && !options.hideDate) {
    const lagBaomer = document.createElement('div');
    lagBaomer.classList.add('lag-baomer');
    lagBaomer.innerHTML = '<span class="fire">🔥</span> ל"ג בעומר';
    document.querySelector('.header').prepend(lagBaomer);
  }
}

setupDate();
toggleNoOmer();
writeDays();
writeWeeks();
if (!options.hideSefira) {
  writeSefira();
}
lagBaomer();
