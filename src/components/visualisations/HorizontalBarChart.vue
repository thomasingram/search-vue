<template>
  <svg v-bind:width="width" v-bind:height="height">
    <g class="chart" v-bind:style="{ transform: `translate(${margin.left}px, ${margin.top}px)` }">
      <g class="y-axis"></g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'horizontal-bar-chart',
  props: {
    data: Array
  },
  data () {
    return {
      width: 500,
      height: 300,
      margin: {
        top: 24,
        right: 24,
        bottom: 24,
        left: 60
      }
    }
  },
  computed: {
    chartWidth () {
      return this.width - this.margin.left - this.margin.right
    },
    chartHeight () {
      return this.height - this.margin.top - this.margin.bottom
    }
  },
  methods: {
    initialize () {
      this.svg = d3.select(this.$el)
      this.chart = d3.select('.chart')
      this.yAxis = d3.select('.y-axis')
    },
    renderChart (data) {
      const x = d3.scale.linear()
        .range([0, chartWidth])
        .domain([0, d3.max(data, d => d.value)])

      const y = d3.scale.ordinal()
        .rangeRoundBands([chartHeight, 0], .1)
        .domain(data.map(d => d.name))

      // Create y-axis to show bar names.
      const yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient('left')

      this.yAxis.call(yAxis)

      // Create bars.
      const bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('g')

      bars.append('rect')
        .attr('class', 'bar')
        .attr('y', d => y(d.name))
        .attr('height', y.rangeBand())
        .attr('x', 0)
        .attr('width', d => x(d.value))

      // Add a value label to the right of each bar.
      bars.append('text')
        .attr('class', 'label')
        // y position of the label is halfway down the bar.
        .attr('y', d => y(d.name) + y.rangeBand() / 2 + 4)
        // x position is 3 pixels to the right of the bar.
        .attr('x', d => x(d.value) + 3)
        .text(d => d.value)
    }
  },
  mounted () {
    this.initialize()
  },
  watch: {
    data: function (newData) {
      this.renderChart(newData)
    }
  }
}
</script>

<style lang="scss">
@import '~src/assets/sass/_base.scss';

</style>
