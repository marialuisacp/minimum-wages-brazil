const pathData = '../data/minimum_wages_data.json';
const	parseDate = d3.timeFormat('%d-%m-%Y');

const parseYearDate = (year) => (
  parseInt(year) > 19 
      ? '19' + year
      : '20' + year
);

const render = (data) => {
  data.
  forEach(d => {
    let stringDate = d.validity.replace(/\./g, '/');
    let parts = stringDate.split('/');
    parts[2] = parseYearDate(parts[2]);
    
    stringDate = parts.join('/');
    d.date = new Date(stringDate);
  });

  const margin = {
    horizontal: 30,
    vertical: 90
  };

  const size = {
    width: screen.width - margin.horizontal * 4,
    height: 400
  };

  const minDate = d3.min(data, (d) => (d.date));
  const maxDate = new Date(2021,0,11);

  const x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, size.width]);

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

  const renderNode = (d) => {
    const dx = x(new Date(d.date)) || x(new Date());
    const dy = y(parseFloat(d.value)) || 0;

    console.log(parseFloat(d.value), dy);
    return 'translate(' + dx + ',' + dy + ')';
  };

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', size.width + (margin.horizontal * 2))
    .attr('height', size.height + (margin.vertical * 2))
    .append('g')
    .attr('transform', 
          'translate(' 
            + margin.horizontal * 2
            + ',' + margin.vertical + ')');

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + size.height + ')')
    .call(xAxis)
  .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-1em')
    .attr('dy', '-.5em')
    .attr('transform', 'rotate(-90)' );
  

  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('R$');
  
  const nodes = svg.selectAll('.node')
    .data(data)
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => renderNode(d));
  
  nodes.append('circle')
      .attr('id', function(d) { return d.id; })
      .attr('r', function(d) { return 3; })
      .style('fill', function(d) { return '#f00'; })
};

d3.json(pathData).then(render);
