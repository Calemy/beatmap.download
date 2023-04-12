
let a = ['us', 'beatmap.download']
let b = ['eu', 'eu.beatmap.download']
const serverSwitch = document.getElementById("serverSwitch")
serverSwitch.onclick = () => {
  let temp = a
  a = b
  b = temp
  setServer(a[1])
  serverSwitch.innerHTML = `Switch to <span class="fi fi-${b[0]}"></span>`
}


const setServer = async (url) => {
  resetPage()
  setTimeout(() => buildPage(`https://${url}/api`), 500)
}

/* peep the cursed js */
const resetPage = async () => {
  let id = window.setTimeout(() => {}, 0)
  while (id--) window.clearTimeout(id)
  
  setTimeout(() => {
    document.getElementById("center").classList.remove("aos-animate")
    setTimeout(() => document.body.setAttribute('style', 'overflow: hidden'), 20)
    window.scrollTo(-1, -1)
  }, 10)
  setTimeout(() => document.querySelector(".mirror-list").innerHTML = '', 500)
  setTimeout(() => {
    document.getElementById("center").classList.add("aos-animate")
    document.body.setAttribute('style', 'overflow: visible')
  }, 1000)
}

const buildPage = async (apiUrl) => {
  let resp = await fetch(`${apiUrl}/servers/average`)
  let upResp = await fetch(`${apiUrl}/servers`)
  let json = await resp.json();
  let upJson = await upResp.json()

  // sort json by resp time
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
    document.querySelector('.mirror-list').appendChild(mirrorCard);
    index++;
  });
  initSeries(apiUrl, json);
}

document.addEventListener('DOMContentLoaded', async () => {
  setServer('beatmap.download')
});