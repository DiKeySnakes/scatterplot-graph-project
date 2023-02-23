let values = [];

let xScale;
let yScale;

let xAxis;
let yAxis;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select('svg');

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(values, (item) => {
        return item['Year'];
      }) - 1,
      d3.max(values, (item) => {
        return item['Year'];
      }) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(values, (item) => {
        return new Date(item['Seconds'] * 1000);
      }),
      d3.max(values, (item) => {
        return new Date(item['Seconds'] * 1000);
      }),
    ])
    .range([padding, height - padding]);
};

const createSvg = () => {
  svg.attr('width', width);
  svg.attr('height', height);
};

const createCircles = () => {
  const tooltip = d3.select('body').append('div').attr('id', 'tooltip');
  svg
    .selectAll('circle')
    .data(values)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', '5')
    .attr('data-xvalue', (item) => {
      return item['Year'];
    })
    .attr('data-name', (item) => {
      return item['Name'];
    })
    .attr('data-nationality', (item) => {
      return item['Nationality'];
    })
    .attr('data-time', (item) => {
      return item['Time'];
    })
    .attr('data-place', (item) => {
      return item['Place'];
    })
    .attr('data-doping', (item) => {
      return item['Doping'];
    })
    .attr('data-yvalue', (item) => {
      return new Date(item['Seconds'] * 1000);
    })
    .attr('cx', (item) => {
      return xScale(item['Year']);
    })
    .attr('cy', (item) => {
      return yScale(new Date(item['Seconds'] * 1000));
    })
    .attr('fill', (item) => {
      if (item['URL'] === '') {
        return 'blue';
      } else {
        return 'orange';
      }
    })
    .on('mouseover', (e) => {
      const target = e.target;
      tooltip.transition().style('visibility', 'visible');
      tooltip.text(
        `${target.dataset.name}, ${target.dataset.nationality}, Time: ${target.dataset.time}, Place: ${target.dataset.place}, Year: ${target.dataset.xvalue}`
      );
      tooltip.attr('data-year', target.dataset.xvalue);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

const generateAxes = () => {
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - padding) + ')');

  svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)');
};

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const req = new XMLHttpRequest();

req.open('GET', url, true);
req.send();
req.onload = () => {
  values = JSON.parse(req.responseText);
  createSvg();
  generateScales();
  createCircles();
  generateAxes();
};
