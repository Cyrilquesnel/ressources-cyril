(function () {
  var KEY = 'classeur-hygiene-v1';
  var NUDGE_FROM = 5;
  var boxes = Array.prototype.slice.call(document.querySelectorAll('input[data-pt]'));
  if (!boxes.length) return;
  var bar = document.getElementById('cl-bar');
  var count = document.getElementById('cl-n');
  var nudge = document.getElementById('cl-nudge');
  var reset = document.getElementById('cl-reset');
  var armTimer = null;

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.map(String) : [];
    } catch (e) { return []; }
  }
  function save() {
    try {
      var on = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-pt'); });
      if (on.length) window.localStorage.setItem(KEY, JSON.stringify(on));
      else window.localStorage.removeItem(KEY);
    } catch (e) { /* stockage indisponible : la page marche sans */ }
  }
  function refresh() {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    count.textContent = String(n);
    nudge.hidden = n < NUDGE_FROM;
    Array.prototype.forEach.call(document.querySelectorAll('ol.points'), function (ol) {
      var g = ol.getAttribute('data-group');
      var all = ol.querySelectorAll('input[data-pt]');
      var done = ol.querySelectorAll('input[data-pt]:checked').length;
      var label = document.querySelector('.group-count[data-group="' + g + '"]');
      if (label) {
        label.textContent = done + ' sur ' + all.length;
        label.classList.toggle('done', done === all.length);
      }
    });
  }
  function disarm() {
    reset.classList.remove('armed');
    reset.textContent = 'Tout décocher';
    if (armTimer) { clearTimeout(armTimer); armTimer = null; }
  }

  var saved = load();
  boxes.forEach(function (b) {
    if (saved.indexOf(b.getAttribute('data-pt')) !== -1) b.checked = true;
    b.addEventListener('change', function () { save(); refresh(); });
  });

  reset.addEventListener('click', function () {
    if (!reset.classList.contains('armed')) {
      reset.classList.add('armed');
      reset.textContent = 'Confirmer ?';
      armTimer = setTimeout(disarm, 4000);
      return;
    }
    boxes.forEach(function (b) { b.checked = false; });
    save(); refresh(); disarm();
  });

  bar.hidden = false;
  document.body.classList.add('has-bar');
  refresh();
})();
