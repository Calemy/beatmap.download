
const setServer = async (url) => {
  resetPage()
  setTimeout(() => buildPage(`https://${url}/api`), 500)
}

/* peep the cursed js */
const resetPage = async () => {
  let id = window.setTimeout(() => { }, 0)
  while (id--) window.clearTimeout(id)

  setTimeout(() => document.getElementById("center").classList.remove("aos-animate"), 10)
  setTimeout(() => document.querySelector(".mirror-list").innerHTML = '', 500)
  setTimeout(() => document.getElementById("center").classList.add("aos-animate"), 500)
}

const buildPage = async (apiUrl) => {
  const resp = await fetch(`${apiUrl}/servers/average`)
  const upResp = await fetch(`${apiUrl}/servers`)
  const avgJson = await resp.json();
  const upJson = await upResp.json()

  // sort json by resp time
  const sortedJson = Object.fromEntries(
    Object.entries(avgJson).sort(([, a], [, b]) => (a.search.average.latency - b.search.average.latency))
  );

  Object.entries(sortedJson).forEach(([mirror, _data]) => {
    const mirrorCard = document.createElement('div');
    mirrorCard.classList.add('mirror');

    const mirrorText = document.createElement('a');
    mirrorText.innerText = mirror;
    mirrorText.href = `https://${mirror}`;
    mirrorText.target = "_blank";
    mirrorCard.appendChild(mirrorText);

    const up = [upJson[mirror].status.uptime.slice(-1)[0], upJson[mirror].search.uptime.slice(-1)[0], upJson[mirror].download.uptime.slice(-1)[0]]
    const upTotal = up.reduce((a, b) => a + b, 0)
    const mirrorUpDown = document.createElement('h1');

    switch (upTotal) {
      case 0:
        mirrorCard.innerHTML = '<i class="fa-solid fa-circle-down fa-2x1" style="color: #FF7276"></i> ' + mirrorCard.innerHTML
        mirrorUpDown.innerHTML = '<span>DOWN</span>'
        break;
      case 3:
        mirrorCard.innerHTML = '<i class="fa-solid fa-circle-up fa-2x1" style="color: #90EE90"></i> ' + mirrorCard.innerHTML
        mirrorUpDown.innerHTML = '<span>UP</span>'
        break;
      default:
        mirrorCard.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-2x1" style="color: #FFC600"></i> ' + mirrorCard.innerHTML
        mirrorUpDown.innerHTML = '<span>DEGRADED</span>'

        const degradedEndpoints = document.createElement('h3')
        degradedEndpoints.classList.add('degraded')
        if (up[0] === 0) degradedEndpoints.innerHTML += '<span>Status</span>'
        if (up[1] === 0) degradedEndpoints.innerHTML += '<span>Search</span>'
        if (up[2] === 0) degradedEndpoints.innerHTML += '<span>Download</span>'
        mirrorCard.appendChild(degradedEndpoints)
        break;
    }

    mirrorCard.appendChild(mirrorUpDown)
    document.querySelector('.mirror-list').appendChild(mirrorCard);
  });
  initSeries(apiUrl, sortedJson, upJson);
}

document.addEventListener('DOMContentLoaded', async () => {
  setServer('beatmap.download')
});