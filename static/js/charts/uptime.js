const reloadSeries = async () => {
  let response = await fetch("https://beatmap.download/api/servers/average")
  let json = await response.json()
  await updateSeries(json);
}

async function updateSeries(json) {
  chart.updateSeries([])
  Object.entries(json).forEach(([mirror, data]) => {
    chart.appendSeries({
      name: mirror,
      data: [((data.download.average.uptime + data.search.average.uptime) / 2) * 100]
    })
  });

  setTimeout(reloadSeries, 60 * 1000 * 5)
};

var options = {
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

var chart = new ApexCharts(document.querySelector("#uptime-chart"), options)
chart.render()