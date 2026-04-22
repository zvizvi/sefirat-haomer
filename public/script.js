const params = new URLSearchParams(location.search);
const urlOptions = Object.fromEntries(params.entries());
if (urlOptions.franknatan === 'true') {
  document.body.classList.add('franknatan');
}

let today, todayHebrewObj, isAfterTzeit, todayHebrew, todayOmer;
const Hebcal = window.Hebcal;
const dayjs = window.dayjs;
dayjs.locale('he');
const options = {};
if (['sf', 'as', 'em'].includes(urlOptions.nusach)) {
  options.nusach = urlOptions.nusach;
} else {
  options.nusach = 'sf';
}
if (['as', 'em'].includes(options.nusach)) {
  document.querySelector('link[rel=canonical]').href += '?nusach=' + options.nusach;
}
const nusachEl = document.getElementById('nusach');
nusachEl.value = options.nusach;
nusachEl.addEventListener('change', (event) => {
  options.nusach = nusachEl.value;
  urlOptions.nusach = options.nusach;
  location.search = new URLSearchParams(urlOptions).toString();
});
const contentEl = document.querySelector('.content');
contentEl.classList.remove('sf', 'as', 'em');
contentEl.classList.add(options.nusach);

const numberLetterList = {
  1: 'אֶחָד', 2: 'שְׁנֵי', '2a': 'שְׁנַיִם', 3: 'שְׁלֹשָׁה', 4: 'אַרְבָּעָה', 5: 'חֲמִשָּׁה', 6: 'שִׁשָּׁה', 7: 'שִׁבְעָה', 8: 'שְׁמוֹנָה', 9: 'תִּשְׁעָה', 10: 'עָשָׂר', 11: 'אַחַד עָשָׂר', 12: 'שְׁנֵים עָשָׂר', 20: 'עֶשְׂרִים', 30: 'שְׁלֹשִׁים', 40: 'אַרְבָּעִים'
};
const sefiraList = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

function setupHebrewDate () {
  todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
  todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem
}

function setupDate () {
  today = dayjs();
  setupHebrewDate();

  isAfterTzeit = today.isAfter(todayHebrewObj.getZemanim().tzeit);
  if (isAfterTzeit) {
    today = today.add(1, 'days');
    setupHebrewDate();
  }

  todayHebrew = todayHebrewObj.toString('h');
  todayOmer = todayHebrewObj.omer();
  if (!todayOmer) {
    document.querySelector('.no-omer').style.display = 'block';
    todayOmer = 1;
  }

  let weekDay = isAfterTzeit || today.hour() < 5 ? 'אור ל' : '';
  weekDay += 'יום ' + today.format('dddd');
  const weekDayElement = document.querySelector('.week-day');
  const hebrewDateElement = document.querySelector('.hebrew-date');
  weekDayElement.textContent = weekDay;
  hebrewDateElement.textContent = todayHebrew;
  hebrewDateElement.setAttribute('datetime', dayjs().format());
  document.title += (', ' + Hebcal.gematriya(todayHebrewObj.getYearObject('h').year % 5000));
}

function getDays (number) {
  let day;

  if (number === 1) {
    day = 'יוֹם אֶחָד';
  } else if (number < 10) {
    day = numberLetterList[number] + ' יָמִים';
  } else if (number === 10) {
    day = 'עֲשָׂרָה יָמִים';
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

function lagBaomer () {
  if (todayOmer === 33) {
    const header = document.querySelector('.header');
    const lagBaomer = document.createElement('span');
    lagBaomer.classList.add('lag-baomer');
    lagBaomer.innerHTML = '<span class="fire">🔥</span> ל"ג בעומר';
    header.prepend(lagBaomer);
  }
}

function highlights () {
  if (!todayOmer) {
    return;
  }
  const lamnatseachElement = document.querySelector('.lamnatseach-content');
  const lamnatseach = lamnatseachElement.textContent.split(/\s/);
  lamnatseach[todayOmer + 2] = '<font class="current">' + lamnatseach[todayOmer + 2] + '</font>';
  lamnatseachElement.innerHTML = lamnatseach.join(' ');

  const anaBekoachRow = document.querySelectorAll('.ana-bekoach .ana-bekoach-row-content')[Math.floor(todayOmer / 7)];
  const anaBekoachArray = anaBekoachRow.textContent.split(/\s/);
  anaBekoachArray[todayOmer % 7 - 1] = '<font class="current">' + anaBekoachArray[todayOmer % 7 - 1] + '</font>';
  anaBekoachRow.innerHTML = anaBekoachArray.join(' ');
}

setupDate();
writeDays();
writeWeeks();
writeSefira();
lagBaomer();
highlights();
document.querySelector('.nusach').style.display = 'block';
