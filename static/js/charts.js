const initSeries = async (json) => {
  updateUptimeSeries(json);
  let allResponse = await fetch(`${apiUrl}/servers`);
  let allDataJson = await allResponse.json();
  updateSearchLatencySeries(allDataJson);
  setTimeout(reloadSeries, 60 * 1000 * 5)
}

const reloadSeries = async () => {
  let recentResponse = await fetch(`${apiUrl}/servers/average`);
  let recentDataJson = await recentResponse.json();
  let allResponse = await fetch(`${apiUrl}/servers`);
  let allDataJson = await allResponse.json();
  updateUptimeSeries(recentDataJson);
  updateSearchLatencySeries(allDataJson);
  setTimeout(reloadSeries, 60 * 1000 * 5)
}

const updateUptimeSeries = (json) => {
  uptimeChart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    uptimeChart.appendSeries({
      name: mirror,
      data: [((data.download.average.uptime + data.search.average.uptime) / 2) * 100]
    })
  });
};

const updateSearchLatencySeries = (json) => {
  searchChart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    let categories = data.search.time.splice(data.search.latency.length - 10, data.search.latency.length);
    categories = categories.map((time) => {
      const newTime = moment(new Date(time * 1000)).fromNow();
      return newTime;
    });

    const dataa = data.search.latency.splice(data.search.latency.length - 10, data.search.latency.length);
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