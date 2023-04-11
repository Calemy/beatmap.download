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
    mirrorCard.dataset.aos = "fade-in";
    mirrorCard.dataset.aosDelay = index * 100;
    document.getElementById('mirror-list').appendChild(mirrorCard);
    index++;
  });
  initSeries(json);
});