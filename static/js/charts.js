const reloadSeries = async () => {
  let recentResponse = await fetch("https://beatmap.download/api/servers/average")
  let recentDataJson = await recentResponse.json()
  let allResponse = await fetch("https://beatmap.download/api/servers")
  let allDataJson = await allResponse.json()
  updateUptimeSeries(recentDataJson);
  updateSearchLatencySeries(allDataJson);
  setTimeout(reloadSeries, 60 * 1000 * 5)
}

function updateUptimeSeries(json) {
  uptimeChart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    uptimeChart.appendSeries({
      name: mirror,
      data: [((data.download.average.uptime + data.search.average.uptime) / 2) * 100]
    })
  });
};

function updateSearchLatencySeries(json) {
  searchChart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    let categories = data.search.time.reverse().splice(data.search.time.length - 30, data.search.time.length).reverse();
    categories = categories.map((time) => {
      const newTime = new Date(time * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      console.log(time, newTime);
      return newTime;
    });

    const dataa = data.search.latency.reverse().splice(data.search.latency.length - 30, data.search.latency.length).reverse();
    searchChart.appendSeries({
      name: mirror,
      type: 'line',
      data: dataa
    });
    searchChart.updateOptions({
      xaxis: {
        categories: categories
      }
    })
  });
}

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
    text: 'Search latency to Date',
    align: 'center'
  },
  xaxis: {
    type: 'category',
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