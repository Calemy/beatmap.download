const apiUrl = window.location.href.includes("localhost") ? "http://beatmap.download/api" : "/api";

document.addEventListener('DOMContentLoaded', async () => {
  let response = await fetch(`${apiUrl}/servers/average`)
  let json = await response.json();

  // sort json by response time
  json = Object.fromEntries(
    Object.entries(json).sort(([, a], [, b]) => (a.search.average.latency - b.search.average.latency))
  );

  let index = 6;
  Object.entries(json).forEach(([mirror, _data]) => {
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
    if (upTotal === 3) {
      mirrorCard.innerHTML = '<i class="fa-solid fa-circle-up fa-2x1" style="color: #90EE90"></i> ' + mirrorCard.innerHTML
      mirrorUpDown.innerHTML = '<span>UP</span>'
    } else if (upTotal === 0) {
      mirrorCard.innerHTML = '<i class="fa-solid fa-circle-down fa-2x1" style="color: #FF7276"></i> ' + mirrorCard.innerHTML
      mirrorUpDown.innerHTML = '<span>DOWN</span>'
    } else {
      mirrorCard.innerHTML = '<i class="fa-solid fa-circle-exclamation fa-2x1" style="color: #FFC600"></i> ' + mirrorCard.innerHTML
      mirrorUpDown.innerHTML = '<span>DEGRADED</span>'
      
      const degradedEndpoints = document.createElement('h3')
      degradedEndpoints.classList.add('degraded')
      if (up[0] === 0) degradedEndpoints.innerHTML += '<span>Status</span>' 
      if (up[1] === 0) degradedEndpoints.innerHTML += '<span>Search</span>'
      if (up[2] === 0) degradedEndpoints.innerHTML += '<span>Download</span>'
      mirrorCard.appendChild(degradedEndpoints)
    }
    mirrorCard.appendChild(mirrorUpDown)
    mirrorCard.dataset.aos = "fade-in";
    mirrorCard.dataset.aosDelay = index * 100;
    document.getElementById('mirror-list').appendChild(mirrorCard);
    index++;
  });
  initSeries(json);
});