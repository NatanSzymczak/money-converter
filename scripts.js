let selectIn;
let selectOut;
let swapInputs;
let checkRateBtn;
let moneyYouHave;
const MAIN_UNIT = 1;
const history = [];
const loaderIcon = document.createElement('span');
const textMainBtn = document.createElement('strong');
textMainBtn.innerText = 'Check rate';


async function getValueFromNBP() {
  try {
    let eur = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/eur/');
    let usd = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/usd/');
    let chf = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/chf/');

    const valueAllCurrencies = {
      pln: MAIN_UNIT,
      eur: eur.data.rates[0].mid,
      usd: usd.data.rates[0].mid,
      chf: chf.data.rates[0].mid
    }

    console.log(valueAllCurrencies);

    checkRateBtn.removeChild(loaderIcon);
    checkRateBtn.appendChild(textMainBtn);
    checkRateBtn.disabled = false;

    calculateExchangeRate(valueAllCurrencies);

  } catch (err) {
    console.log("Natan masz blad: ", err);
  }
}

const calculateExchangeRate = (values) => {

  let currIn = eval(`values.${selectIn.value}`);
  let currOut= eval(`values.${selectOut.value}`);

  console.log(currIn);
  console.log(currOut);


  let amountMoney = (moneyYouHave.value*(currIn/currOut)).toFixed(2);

  document.querySelector('#moneyYouWant').value = amountMoney;

}



const checkInputValue = () => {
  let infoBar = document.querySelector('#infoBar');
  moneyYouHave = document.querySelector('#moneyYouHave');

  if (Boolean(+(moneyYouHave.value)) === false) {
    infoBar.innerText = "Warning!\nThe value entered is not a number.";
    infoBar.classList.replace('alert-info', 'alert-danger');
    moneyYouHave.classList.add('border-danger');
    return 0;
  }else if (infoBar.classList.contains('alert-danger')) {
    infoBar.classList.replace('alert-danger', 'alert-info');
    infoBar.innerText = `A money converter is a calculator that exchanges the value of one currency into the relative value of the chosen currency.`;
    moneyYouHave.classList.remove('border-danger');
  }
  return  moneyYouHave.value;
};



const clickCheckRateBtn = () => {
  if (!checkInputValue()) return 0;

  addToHistory();

  loaderIcon.classList.add('spinner-border', 'spinner-border-lg');
  checkRateBtn.disabled = true;

  checkRateBtn.removeChild(document.querySelector('strong'));
  checkRateBtn.appendChild(loaderIcon);

  getValueFromNBP();
}



const swapCurrencyRow = () => {
  let selectIn  = document.querySelector('#selectIn');
  let selectOut = document.querySelector('#selectOut');

  let valueIn  = selectIn.value;
  let valueOut = selectOut.value; // czy to jest potrzebne skoro nie wprowadzam 2 wartosci waluty?

  let labelUp   = document.querySelector(`label[for='selectIn']`);
  let labelDown = document.querySelector(`label[for='selectOut']`);

  textUp = labelUp.innerText;
  textDown = labelDown.innerText;

  labelUp.innerText = textDown;
  labelDown.innerText = textUp;

  let flagUp   = document.querySelector('#flagIn');
  let flagDown = document.querySelector('#flagOut');

  flagUp.className = '';
  flagDown.className = '';

  flagUp.classList.add('flag',`flag-${selectOut.value}`);
  flagDown.classList.add('flag',`flag-${selectIn.value}`);

  selectIn.value =  valueOut;
  selectOut.value = valueIn;
}




const changeViewCurrencyRow = (currency) => {
  let flagClass = currency.id === 'selectIn' ? '#flagIn' : '#flagOut';

  let flag = document.querySelector(flagClass);
  let label = document.querySelector(`label[for='${currency.id}']`);

  flag.classList.remove('flag-pln','flag-eur','flag-usd','flag-chf');
  // usuniecie wszystkich klas i wstawienie flag oraz flag-pln np...

  switch (currency.value) {

    case 'pln':
      flag.classList.add('flag-pln');
      label.innerText = 'zł';
      break;

      case 'eur':
        flag.classList.add('flag-eur');
        label.innerText = '€';
        break;

        case 'usd':
          flag.classList.add('flag-usd');
          label.innerText = '$';
          break;

          case 'chf':
            flag.classList.add('flag-chf');
            label.innerText = 'fr';
            break;
          }
        }




document.addEventListener('DOMContentLoaded', () => {

  selectIn = document.querySelector('#selectIn');
  selectIn.addEventListener('change', () => changeViewCurrencyRow(selectIn));

  selectOut = document.querySelector('#selectOut');
  selectOut.addEventListener('change', () => changeViewCurrencyRow(selectOut));

  swapInputs = document.querySelector('#swapInputs');
  swapInputs.addEventListener('click', () => swapCurrencyRow());

  checkRateBtn = document.querySelector('#checkRateBtn');
  checkRateBtn.addEventListener('click', clickCheckRateBtn);


  checkRateBtn.appendChild(textMainBtn);
});