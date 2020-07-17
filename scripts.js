async function value () {

  try {
    let eur = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/eur/');
    let usd = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/usd/');
    let chf = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/chf/');


    eur = eur.data.rates[0].mid;
    usd = usd.data.rates[0].mid;
    chf = chf.data.rates[0].mid;

    console.log('EUR = ', eur);
    console.log('USD = ', usd);
    console.log('CHF = ', chf);

  } catch (err) {
    console.log("Natan masz blad: ", err);
  }
}



// Pasek boczny z historią wyszukań.



document.addEventListener('DOMContentLoaded', (event) => {
  let selectIn = document.querySelector('#selectIn');
  selectIn.addEventListener('change', () => changeView(selectIn));

  let selectOut = document.querySelector('#selectOut');
  selectOut.addEventListener('change', () => changeView(selectOut));

  let swapInputs = document.querySelector('#swapInputs');
  swapInputs.addEventListener('click', () => swapCurrencies());

});







function swapCurrencies() {
  let selectIn  = document.querySelector('#selectIn');
  let selectOut = document.querySelector('#selectOut');

  let valueIn  = selectIn.value;
  let valueOut = selectOut.value;

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














function changeView(currency) {
  let flagClass = currency.id === 'selectIn' ? '#flagIn' : '#flagOut';

  let flag = document.querySelector(flagClass);
  let label = document.querySelector(`label[for='${currency.id}']`);

  flag.classList.remove('flag-pln','flag-eur','flag-usd','flag-chf');

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