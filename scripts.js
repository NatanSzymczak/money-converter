async function value () {

  const eur = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/eur/');
  const usd = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/usd/');
  const chf = await axios.get('http://api.nbp.pl/api/exchangerates/rates/a/chf/');



  console.log('EUR = ', eur.data.rates[0].mid);
  console.log('USD = ', usd.data.rates[0].mid);
  console.log('CHF = ', chf.data.rates[0].mid);

}

value();