const reloadSeries = async () => {
  let response = await fetch("https://beatmap.download/api/servers/average")
  let json = await response.json()
  await updateSeries(json);
}

async function updateSeries(json) {
  uptimeChart.updateSeries([])
  searchChart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    uptimeChart.appendSeries({
      name: mirror,
      data: [((data.download.average.uptime + data.search.average.uptime) / 2) * 100]
    })
    searchChart.appendSeries({
      name: mirror,
      data: [(Math.trunc(data.search.average.latency))]
    })
  });

  setTimeout(reloadSeries, 60 * 1000 * 5)
};

var uptimeOptions = {
  theme: {
    mode: 'dark',
    palette: 'palette1',
    monochrome: {
      enabled: true,
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
    text: 'Uptime % to Date',
    align: 'center'
  },
  yaxis: {
    max: 100,
    min: 90
  },
  xaxis: {
    categories: [''],
  },
  tooltip: {
    y: {
      formatter: function (value, options) {
        return `${value}%`
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
  }]
}

var searchOptions = {
  theme: {
    mode: 'dark',
    palette: 'palette1',
    monochrome: {
      enabled: true,
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
    text: 'Search latency to Date',
    align: 'center'
  },
  yaxis: {
    min: 0,
  },
  xaxis: {
    categories: [''],
  },
  tooltip: {
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
  }]
}

var uptimeChart = new ApexCharts(document.querySelector("#uptime-chart"), uptimeOptions)
uptimeChart.render()

var searchChart = new ApexCharts(document.querySelector("#search-chart"), searchOptions)
searchChart.render()