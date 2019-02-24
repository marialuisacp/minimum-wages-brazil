const parseYearDate = (year) => (
  parseInt(year) > 19
    ? '19' + year
    : '20' + year
);

const convertToReal = (coin, value, year) => {
  let newValue = value;
  switch (coin.toLowerCase()) {
    case 'mil reis':
      newValue = parseFloat(value)
        / Math.pow(1000, 3) * 0.123;
      break;
    case 'cr$':
      newValue = parseFloat(value)
        / Math.pow(1000, 5) * 2.75;
      break;
    case 'ncr$':
      newValue = parseFloat(value)
        / Math.pow(1000, 4) * 2.75;
      break;
    case 'cz$':
      newValue = parseFloat(value)
        / Math.pow(1000, 3) * 2.75;
      break;
    case 'ncz$':
      if (year < 1970) {
        newValue = parseFloat(value)
          / Math.pow(1000, 4) * 2.75;
      } else {
        newValue = parseFloat(value)
          / Math.pow(1000, 2) * 2.75;
      }
      break;
    case 'urv':
      newValue = value;
      break;
    case 'r$':
      newValue = value;
      break;
  }
  return newValue;
};

const convertData = (d) => {
  let stringDate = d.validity.replace(/\./g, '/'), parts = stringDate.split('/');
  let day = parts[0], month = parts[1];

  parts[0] = month;
  parts[1] = day;
  parts[2] = parseYearDate(parts[2]);

  stringDate = parts.join('/');
  d.year = parts[2];
  d.date = new Date(stringDate);
};

const getTextReal = (d) => {
  if (d.coin === 'R$' || d.coin === 'URV')
    return '';
  return 'R$' + d.realValue
};

const getTextLegislation = (d) => (
  d.legislation + ' '
);

const getTextDescription = (d) => (
  d.coin + ' ' + d.value + ''
);