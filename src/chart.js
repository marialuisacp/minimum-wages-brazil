const pathData = '../data/minimum_wages_data.json';
const parseDate = d3.timeFormat('%d-%m-%Y');

const render = (data) => {

  data.
    forEach(d => {
      convertData(d);
      d.realValue = convertToReal(d.coin, d.value, d.year);
    });

  const margin = {
    horizontal: 90,
    vertical: 90
  };

  const size = {
    width: screen.width - margin.horizontal * 2,
    height: 500
  };

  const minDate = d3.min(data, (d) => (d.date));
  const maxDate = new Date();

  const x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, size.width - margin.horizontal]);

  const y = d3.scaleLinear()
    .domain([1000, 0])
    .range([0, size.height]);

  const xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat('%m-%d-%Y'))
    .ticks(50);

  const yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

  const line = d3.line()
    .x((d) => d.x)
    .y((d) => d.y);

  const defineAxis = (d) => {
    d.x = x(new Date(d.date));
    d.y = y(parseFloat(d.realValue));
    d.id = d.validity;

    if (d.y < 0) d.y = d.y * -1;
  };

  data.forEach((d) => defineAxis(d));

  const renderNode = (d) => {
    return 'translate(' + d.x + ',' + d.y + ')';
  };

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', size.width + (margin.horizontal * 2))
    .attr('height', size.height + (margin.vertical * 2))
    .append('g')
    .attr('transform',
      'translate('
      + margin.horizontal
      + ',' + margin.vertical + ')');

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + size.height + ')')
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
    .attr('transform', 'translate(0,' + size.height + ')')
    .call(xAxis
      .tickSize(-size.height, 0, 0)
      .tickFormat('')
    );

  svg.append('path')
    .attr('class', 'line')
    .attr('d', line(data));

  const nodes = svg.selectAll('.node')
    .data(data)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', (d) => renderNode(d));

  nodes.append('circle')
    .attr('id', (d) => d.id)
    .attr('r', (d) => 6)
    .attr('class', 'dot');

  nodes.append('text')
    .attr('id', d => d.id + '-text-real')
    .attr('class', 'txt-real-value txt-detail')
    .attr('transform',
      'translate(-50, -5)')
    .text(d => getTextReal(d));

  nodes.append('text')
    .attr('id', d => d.id + '-text-value')
    .attr('class', 'txt-value txt-detail')
    .attr('transform',
      'translate(-100, -35)')
    .text(d => getTextDescription(d));

  nodes.append('text')
    .attr('id', d => d.id + '-text-legislation')
    .attr('class', 'txt-legislation txt-detail')
    .attr('transform',
      'translate(-150, -60)')
    .text(d => getTextLegislation(d));
};

d3.json(pathData).then(render);
