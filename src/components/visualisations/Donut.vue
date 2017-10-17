<template>
  <svg v-bind:width="width" v-bind:height="height">
    <g class="chart" v-bind:style="{ transform: `translate(${chartPosition.x}px, ${chartPosition.y}px)` }"></g>
    <g class="legend" v-bind:style="{ transform: `translate(${legendPosition.x}px, ${legendPosition.y}px)` }"></g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'donut',
  props: {
    data: Array
  },
  data () {
    return {
      width: 500,
      height: 300,
      radius: 150,
      donutWidth: 60,
      legendCircleSize: 15,
      legendHorizontalSpacing: 10,
      legendVerticalSpacing: 12,
      chartPosition: {
        x: 350,
        y: 150
      },
      legendPosition: {
        x: 0,
        y: 20
      }
    }
  },
  methods: {
    initialize () {
      this.svg = d3.select(this.$el)
      this.chart = d3.select('.chart')
      this.legend = d3.select('.legend')

      // Define color palette.
      this.color = d3.scaleOrdinal()
        .range(['#028695', '#41c4d3', '#f7b422', '#aa064b', '#ed2d7e'])
    },
    renderChart (data) {
      // Donut
      const arc = d3.arc()
        .outerRadius(this.radius)
        .innerRadius(this.radius - this.donutWidth)

      const pie = d3.pie()
        .value(d => d.value)
        .sort(null)

      this.chart.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => this.color(d.data.label))

      // Legend
      const legendVar = this.legend.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
          const positionY = i * (this.legendCircleSize + (this.legendVerticalSpacing * 2))
          return `translate(0, ${positionY})`
        })

      legendVar.append('circle')
        .attr('cx', this.legendCircleSize / 2)
        .attr('cy', this.legendCircleSize / 2)
        .attr('r', this.legendCircleSize / 2)
        .style('fill', d => this.color(d.label))

      legendVar.append('text')
        .attr('x', this.legendCircleSize + this.legendHorizontalSpacing)
        .attr('y', this.legendVerticalSpacing)
        .attr('class', 'legend__label')
        .text(d => d.label)

      legendVar.append('text')
        .attr('x', this.legendCircleSize + this.legendHorizontalSpacing)
        .attr('y', this.legendCircleSize + this.legendVerticalSpacing)
        .attr('class', 'legend__value')
        .text(d => `${this.$options.filters.commafy(d.value)} records`)
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

.legend {
  font-size: .875rem;
}

.legend__label {
  fill: #212121;
  font-weight: 500;
}

.legend__value {
  fill: #666666;
  font-size: .75rem;
}
</style>
