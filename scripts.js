let moneyHave,
    moneyWant,
    localHistory,
    RowHistory,
    history = [],
    currentId = 1;

const UNIT_OF_MAIN_CURRENCY = 1,
      selectIn      = document.querySelector('#selectIn'),
      selectOut     = document.querySelector('#selectOut'),
      swapInputs    = document.querySelector('#swapInputs'),
      checkRateBtn  = document.querySelector('#checkRateBtn'),
      loaderIconTag = document.createElement('span'),
      textOnMainBtn = document.createElement('strong');


function changeViewCurrencyRow () {
  let flagClass = this.id === 'selectIn' ? '#flagIn' : '#flagOut';
  let flag = document.querySelector(flagClass);
  let label = document.querySelector(`label[for='${this.id}']`);
  flag.className = '';

  switch (this.value) {
    case 'pln':
      flag.classList.add('flag','flag-pln');
      label.innerText = 'zł';
    break;

    case 'eur':
      flag.classList.add('flag','flag-eur');
      label.innerText = '€';
    break;

    case 'usd':
      flag.classList.add('flag','flag-usd');
      label.innerText = '$';
    break;

    case 'chf':
      flag.classList.add('flag','flag-chf');
      label.innerText = 'fr';
    break;
  }
};


const swapCurrencyRow = () => {
  const labelUp   = document.querySelector(`label[for='selectIn']`),
        labelDown = document.querySelector(`label[for='selectOut']`),
        flagUp    = document.querySelector('#flagIn'),
        flagDown  = document.querySelector('#flagOut'),
        valueIn   = selectIn.value,
        valueOut  = selectOut.value,
        textUp    = labelUp.innerText,
        textDown  = labelDown.innerText;

  labelUp.innerText   = textDown;
  labelDown.innerText = textUp;

  flagUp.className   = '';
  flagUp.classList.add('flag',`flag-${selectOut.value}`);
  flagDown.className = '';
  flagDown.classList.add('flag',`flag-${selectIn.value}`);

  selectIn.value =  valueOut;
  selectOut.value = valueIn;
};


const checkInputValue = () => {
  const infoBarTag = document.querySelector('#infoBar');
  const moneyYouHaveTag = document.querySelector('#moneyYouHave');
  moneyHave = moneyYouHaveTag.value.split(',').join('.');

  if (Boolean(+moneyHave) === false) {
    infoBarTag.innerText = "Warning!\nThe value entered is not a number.";
    infoBarTag.classList.replace('alert-info', 'alert-danger');
    moneyYouHaveTag.classList.add('border-danger');
    return 0;
  }else if (infoBarTag.classList.contains('alert-danger')) {
    infoBarTag.classList.replace('alert-danger', 'alert-info');
    infoBarTag.innerText = 'A money converter is a calculator that exchanges the'
    + ' value of one currency into the relative value of the chosen currency.';
    moneyYouHaveTag.classList.remove('border-danger');
  }

  return moneyHave;
};


async function getValueFromNBP() {
  try {
    let eur = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/eur/');
    let usd = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/usd/');
    let chf = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/chf/');

    const ValueAllCurrencies = {
      pln: UNIT_OF_MAIN_CURRENCY,
      eur: eur.data.rates[0].mid,
      usd: usd.data.rates[0].mid,
      chf: chf.data.rates[0].mid
    }

    swapLoaderIconBtn();
    calculateExchangeRate(ValueAllCurrencies);
  }
  catch (err) {
    console.log("ACHTUNG, ACHTUNG:\n", err);
  }
};


const calculateExchangeRate = (values) => {
  let valueSelectIn = eval(`values.${selectIn.value}`);
  let valueSelectOut= eval(`values.${selectOut.value}`);
  moneyWant = (moneyHave*(valueSelectIn/valueSelectOut)).toFixed(2);
  document.querySelector('#moneyYouWant').value = moneyWant;

  addToLocalStorage();
};


const addRowOnTopTable = (tr) => {
  let parent = document.querySelector('#historyTable');
  let firstChild = parent.firstChild;
  parent.insertBefore(tr, firstChild);
}


const addRowToHistory = (RowHistory) => {
  let tr = document.createElement('tr');
  for (let elem in RowHistory) {
    let td = document.createElement('td');
    td.innerText = RowHistory[elem];
    if (elem==='amount' || elem==='newAmount') td.classList.add('text-right','border-left');
    if (elem==='id'     || elem==='time')      td.classList.add('text-center');
    tr.appendChild(td);
  }
  addRowOnTopTable(tr);
}


const addToLocalStorage = () => {
  RowHistory = {
    id:         currentId,
    time:       getTimeNow(),
    amount:     moneyHave,
    from:       selectIn.value.toUpperCase(),
    newAmount:  moneyWant,
    to:         selectOut.value.toUpperCase()
  };

  history.push(RowHistory);
  localStorage.setItem(currentId , JSON.stringify(RowHistory));
  currentId++;
  addRowToHistory(RowHistory);
};


const getTimeNow = () => {
  const Time = new Date();
  const Now = {
    year:   Time.getFullYear(),
    month:  Time.getMonth(),
    day:    Time.getDate(),
    hour:   Time.getHours(),
    minute: Time.getMinutes(),
    second: Time.getSeconds()
  }
  for (let unit in Now) if (Now[unit] < 10) Now[unit] = '0' + Now[unit];
  const timeNow = `${Now.day}.${Now.month}.${Now.year} --- ${Now.hour}:${Now.minute}:${Now.second}`;

  return timeNow;
};


const importFromLocalStorage = () => {
  for (let i=0; i<localStorage.length;i++) {
    let rowLocalStorage = JSON.parse( localStorage.getItem( localStorage.key(i)));
    history.push({
      id:         rowLocalStorage.id,
      time:       rowLocalStorage.time,
      amount:     rowLocalStorage.amount,
      from:       rowLocalStorage.from,
      newAmount:  rowLocalStorage.newAmount,
      to:         rowLocalStorage.to
    });
  }

  for (let i=1; i<=history.length; i++) {
    let RowHistory = history.find(curr => curr.id === i);
    addRowToHistory(RowHistory);
  }
  currentId = localStorage.length + 1;
}


const swapLoaderIconBtn = () => {
  if (checkRateBtn.disabled === false) {
    checkRateBtn.disabled = true;
    checkRateBtn.removeChild(document.querySelector('strong'));
    checkRateBtn.appendChild(loaderIconTag);
  } else {
    checkRateBtn.disabled = false;
    checkRateBtn.removeChild(loaderIconTag);
    checkRateBtn.appendChild(textOnMainBtn);
  }
}


loaderIconTag.classList.add('spinner-border', 'spinner-border-lg');
textOnMainBtn.innerText = 'Check rate';

selectIn.addEventListener('change', changeViewCurrencyRow);
selectOut.addEventListener('change', changeViewCurrencyRow);
swapInputs.addEventListener('click', swapCurrencyRow);

checkRateBtn.addEventListener('click', () => {
  if (!checkInputValue()) return 0;
  swapLoaderIconBtn();
  getValueFromNBP();
});

document.querySelector('#clearLocalStorage').addEventListener('click', () => {
  localStorage.clear();
  window.location = location.href;
});

checkRateBtn.appendChild(textOnMainBtn);
if(localStorage.length!==0) importFromLocalStorage();