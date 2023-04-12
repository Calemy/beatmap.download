const chartSettings = {
  latency: {
    theme: {
      mode: 'dark',
      palette: 'palette8',
      monochrome: {
        enabled: false,
        color: '#7171ff',
        shadeTo: 'light',
        shadeIntensity: 1
      },
    },
    series: [],
    chart: {
      width: "200%",
      background: "#1E1E2E",
      fontFamily: 'Uni Sans',
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
    },
    stroke: {
      curve: 'smooth'
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: '',
      align: 'center'
    },
    xaxis: {
      type: 'category',
    },
    tooltip: {
      inverseOrder: true,
      y: {
        formatter: function (value, options) {
          return `${value}ms`
        }
      }
    },
    responsive: [{
      breakpoint: 1024,
      options: {
        chart: {
          width: "140%"
        }
      }
    }],
    legend: {
      onItemClick: {
        toggleDataSeries: false
      }
    }
  },
  uptime: {
    theme: {
      mode: 'dark',
      palette: 'palette8',
      monochrome: {
        enabled: false,
        color: '#7171ff',
        shadeTo: 'light',
        shadeIntensity: 1
      },
    },
    series: [],
    chart: {
      width: "200%",
      background: "#1E1E2E",
      fontFamily: 'Uni Sans',
      type: 'bar',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: 'Uptime % (all time)',
      align: 'center'
    },
    yaxis: {
      max: 100,
      min: 50,
      decimalsInFloat: 0,

      labels: {
        formatter: function (value, index) {
          return `${value.toFixed(2)}%`
        }
      }
    },
    xaxis: {
      categories: [''],
    },
    tooltip: {
      y: {
        formatter: function (value, options) {
          return `${value.toFixed(2)}%`
        }
      }
    },
    responsive: [{
      breakpoint: 1024,
      options: {
        chart: {
          width: "140%"
        }
      }
    }],
    legend: {
      onItemClick: {
        toggleDataSeries: false
      }
    }
  }
};

const charts = [];

class LatencyChart {

  constructor(selector, dataType, data, title) {
    this.dataType = dataType;
    this.data = data;
    this.title = title;
    this.chart = new ApexCharts(document.querySelector(selector), chartSettings.latency);
    this.chart.render()

  }

  updateSeries(json) {
    let series = []
    Object.entries(json).forEach(([mirror, data]) => {
      let categories = data[this.dataType].time.splice(data[this.dataType][this.data].length - 9, data[this.dataType][this.data].length);
      categories = categories.map((time) => {
        return moment(new Date(time * 1000)).fromNow()
      });

      const dataa = data[this.dataType][this.data].splice(data[this.dataType][this.data].length - 9, data[this.dataType][this.data].length);
      series.push({
        name: mirror,
        type: 'line',
        data: dataa
      });

      this.chart.updateSeries(series)
      this.chart.updateOptions({
        title: {
          text: this.title,
          align: 'center'
        },
        xaxis: {
          categories: categories
        }
      })
    });
  }
}

const initSeries = async (apiUrl, json, allDataJson) => {
  updateUptimeSeries(json);
  charts.forEach(chart => chart.updateSeries(allDataJson))
  setTimeout(() => reloadSeries(apiUrl), 60 * 1000 * 1)
}

const reloadSeries = async (apiUrl) => {
  let recentResponse = await fetch(`${apiUrl}/servers/average`);
  let recentDataJson = await recentResponse.json();
  let allResponse = await fetch(`${apiUrl}/servers`);
  let allDataJson = await allResponse.json();
  updateUptimeSeries(recentDataJson);
  charts.forEach(chart => chart.updateSeries(allDataJson))
  setTimeout(() => reloadSeries(apiUrl), 60 * 1000 * 1)
}

const updateUptimeSeries = (json) => {
  let series = []
  Object.entries(json).forEach(([mirror, data]) => {
    series.push({
      name: mirror,
      data: [((data.download.average.uptime + data.search.average.uptime) / 2) * 100]
    })
  });
  uptimeChart.updateSeries(series.sort((a, b) => a.data[0] - b.data[0]))
};

var uptimeChart = new ApexCharts(document.querySelector("#uptime-chart"), chartSettings.uptime)
uptimeChart.render()

charts.push(new LatencyChart("#search-chart", "search", "latency", "Search latency (last hour)"));
charts.push(new LatencyChart("#download-chart", "download", "latency", "Download latency (last hour)"));
charts.push(new LatencyChart("#downloadtime-chart", "download", "downloadTime", "Download time (last hour)"));
charts.push(new LatencyChart("#status-chart", "status", "latency", "Status latency (last hour)"));