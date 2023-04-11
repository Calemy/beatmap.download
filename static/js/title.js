/* welcome to the 90s */
(function titleScroller(text) {
  document.title = text;
  setTimeout(function () {
    titleScroller(text.substring(1) + text.substring(0, 1));
  }, 750);
}(" beatmap.download - a osu! beatmap mirror list - "));