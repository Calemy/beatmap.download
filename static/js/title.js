/* welcome to the 90s */
(function titleScroller(text) {
    document.title = text;
    setTimeout(function () {
        titleScroller(text.substr(1) + text.substr(0, 1));
    }, 750);
}(" beatmap.download - a osu! beatmap mirror list - "));