document.addEventListener('DOMContentLoaded', async () => {
  let response = await fetch("https://beatmap.download/api/servers/average")
  let json = await response.json()

  let index = 6;
  Object.entries(json).forEach(([mirror, data]) => {
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
  await updateSeries(json);
});