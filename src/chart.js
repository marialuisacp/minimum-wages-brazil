const pathData = '../data/minimum_wages_data.json';
const parseDate = d3.timeFormat('%d-%m-%Y');

const getItemsByTypeChart = (d, type) => {
  if (type === 'real' && d.coin === 'R$')
    return true;

  if (type !== 'real' && d.coin !== 'R$')
    return true;

  return false;
};

const getStyleReal = (d, i) => {
  if (i % 4 === 1 && i > 6)
    return 'visible';
};

const getStyleCoins = (d, i) => {
  if (d.value > 300 && i > 2)
    return 'visible';
};

const createStyleLegend = (k, value, type) => {
  document.getElementById(k + '-text-real-' + type).style.opacity = value;
  document.getElementById(k + '-text-value-' + type).style.opacity = value;
  document.getElementById(k + '-text-legislation-' + type).style.opacity = value;
};

const render = (data, chartId, type, scale, getStyle) => {
  const dataReal = [];
  data.
    forEach(d => {
      convertData(d);
      d.realValue = type === 'real'
        ? convertToReal(d.coin, d.value, d.year)
        : d.value;
      if (getItemsByTypeChart(d, type)) {
        dataReal.push(d);
      }
    });

  const margin = {
    horizontal: 90,
    vertical: 90
  };

  const size = {
    width: screen.width - margin.horizontal * 4,
    height: 500
  };

  const minDate = d3.min(dataReal, (d) => (d.date));
  const maxDate = type === 'real'
    ? new Date()
    : d3.max(dataReal, (d) => (d.date));

  const x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, size.width - margin.horizontal]);

  const y = d3.scaleLinear()
    .domain([scale, 0])
    .range([0, size.height]);

  const xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat('%m-%d-%Y'))
    .ticks(20);

  const yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

  const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y);

  const defineAxis = (d) => {
    d.realValue = parseFloat(d.realValue).toFixed(2);

    d.x = x(new Date(d.date));
    d.y = y(d.realValue);

    d.id = d.validity;
    if (d.y < 0) d.y = d.y * -1;
  };

  dataReal.forEach((d) => defineAxis(d));

  const renderNode = (d) => {
    return `translate(${d.x},${d.y})`;
  };

  const svg = d3.select(`#${chartId}`)
    .append('svg')
    .attr('width', size.width + (margin.horizontal * 2))
    .attr('height', size.height + (margin.vertical * 2))
    .append('g')
    .attr('transform',
      `translate(${margin.horizontal * 2},${margin.vertical})`);

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${size.height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '-.5em')
    .attr('transform', 'rotate(-90)');

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('R$');

  svg.append('g')
    .attr('class', 'grid')
    .call(yAxis
      .tickSize(-size.width, 0, 0)
      .tickFormat('')
    );

  svg.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${size.height})`)
    .call(xAxis
      .tickSize(-size.height, 0, 0)
      .tickFormat('')
    );

  svg.append('path')
    .attr('class', `line-${type} line`)
    .attr('d', line(dataReal));

  const nodes = svg.selectAll('.node')
    .data(dataReal)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', (d) => renderNode(d))
    .on('mouseover', (d, i) => {
      createStyleLegend(i, 1, type);
      dataReal.forEach((item, key) => {
        if (key !== i) {
          createStyleLegend(key, .1, type);
        }
      });
    });

  nodes.append('circle')
    .attr('id', (d) => d.id)
    .attr('r', (d) => 6)
    .attr('class', `dot-${type} dot`);

  nodes.append('text')
    .attr('id', (d, i) => i + '-text-real-' + type)
    .attr('class', `txt-real-value-${type} txt-real-value txt-detail`)
    .style('visibility', (d, i) => getStyle(d, i))
    .attr('transform',
      'translate(-50, -5)')
    .text(d => getTextReal(d));

  nodes.append('text')
    .attr('id', (d, i) => i + '-text-value-' + type)
    .attr('class', `txt-value-${type} txt-value txt-detail`)
    .style('visibility', (d, i) => getStyle(d, i))
    .attr('transform',
      'translate(-100, -35)')
    .text(d => getTextDescription(d));

  nodes.append('text')
    .attr('id', (d, i) => i + '-text-legislation-' + type)
    .attr('class', `txt-legislation-${type} txt-legislation txt-detail`)
    .style('visibility', (d, i) => getStyle(d, i))
    .attr('transform',
      'translate(-150, -60)')
    .text(d => getTextLegislation(d));
};

d3.json(pathData).then((data) => {
  render(data, 'chart-real', 'real', 1000, getStyleReal);
  render(data, 'chart-coins', 'coins', 2000, getStyleCoins);
});
