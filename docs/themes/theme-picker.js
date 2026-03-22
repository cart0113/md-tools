/*
 * Theme picker — color palette switcher for docsify.
 *
 * Applies saved palette immediately (before docsify renders),
 * then adds a picker UI via a docsify plugin.
 */

(function () {
  var PALETTES = [
    { id: 'parchment', label: 'Parchment', color: '#4a6591' },
    { id: 'arctic', label: 'Arctic', color: '#2563eb' },
    { id: 'forest', label: 'Forest', color: '#3d7a4a' },
    { id: 'ocean', label: 'Ocean', color: '#0d7377' },
    { id: 'mint', label: 'Mint', color: '#2a9e70' },
    { id: 'sand', label: 'Sand', color: '#a07840' },
    { id: 'copper', label: 'Copper', color: '#b85c2a' },
    { id: 'plum', label: 'Plum', color: '#882244' },
    { id: 'dusk', label: 'Dusk', color: '#7c4d8a' },
    { id: 'slate', label: 'Slate', color: '#333333' },
  ];

  var savedPalette = localStorage.getItem('doc-palette') || 'parchment';

  function setPalette(id) {
    var html = document.documentElement;
    html.className = html.className.replace(/\bpalette-\w+/g, '').trim();
    if (id !== 'parchment') {
      html.classList.add('palette-' + id);
    }
    localStorage.setItem('doc-palette', id);
    savedPalette = id;
    document.querySelectorAll('.tp-swatch').forEach(function (btn) {
      btn.classList.toggle('tp-active', btn.getAttribute('data-palette') === id);
    });
  }

  // Apply immediately
  if (savedPalette !== 'parchment') {
    document.documentElement.classList.add('palette-' + savedPalette);
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.tp-wrap{position:fixed;bottom:24px;right:24px;z-index:10000;font-family:system-ui,-apple-system,sans-serif}',
      '.tp-btn{width:42px;height:42px;border-radius:50%;background:#555;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.18);transition:transform .15s,box-shadow .15s}',
      '.tp-btn:hover{transform:scale(1.08);box-shadow:0 4px 14px rgba(0,0,0,.22)}',
      '.tp-btn svg{width:20px;height:20px;fill:#fff}',
      '.tp-panel{position:absolute;bottom:54px;right:0;width:280px;background:#fff;border:1px solid #ddd;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.12);padding:16px 16px 12px;display:none}',
      '.tp-panel.tp-open{display:block;animation:tp-slide .15s ease-out}',
      '@keyframes tp-slide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
      '.tp-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}',
      '.tp-head span{font-weight:600;font-size:15px;color:#222}',
      '.tp-close{background:none;border:none;font-size:18px;cursor:pointer;color:#999;padding:0 2px;line-height:1}',
      '.tp-close:hover{color:#333}',
      '.tp-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#999;margin-bottom:10px;font-weight:700}',
      '.tp-palettes{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}',
      '.tp-swatch{width:30px;height:30px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .12s;position:relative}',
      '.tp-swatch:hover{transform:scale(1.12)}',
      '.tp-swatch.tp-active{border-color:#333;box-shadow:0 0 0 1px #333}',
      '.tp-swatch::after{content:attr(data-label);position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:#888;white-space:nowrap;opacity:0;transition:opacity .12s;pointer-events:none}',
      '.tp-swatch:hover::after{opacity:1}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function buildHTML() {
    var swatches = PALETTES.map(function (p) {
      var cls = 'tp-swatch' + (p.id === savedPalette ? ' tp-active' : '');
      return '<button class="' + cls + '" data-palette="' + p.id + '" data-label="' + p.label + '" style="background:' + p.color + '"></button>';
    }).join('');

    return [
      '<button class="tp-btn" title="Color theme">',
      '  <svg viewBox="0 0 24 24"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>',
      '</button>',
      '<div class="tp-panel">',
      '  <div class="tp-head">',
      '    <span>Color Theme</span>',
      '    <button class="tp-close">&times;</button>',
      '  </div>',
      '  <div class="tp-label">Palette</div>',
      '  <div class="tp-palettes">' + swatches + '</div>',
      '</div>',
    ].join('\n');
  }

  function themePickerPlugin(hook) {
    hook.mounted(function () {
      injectStyles();

      var wrap = document.createElement('div');
      wrap.className = 'tp-wrap';
      wrap.innerHTML = buildHTML();
      document.body.appendChild(wrap);

      var btn = wrap.querySelector('.tp-btn');
      var panel = wrap.querySelector('.tp-panel');
      var closeBtn = wrap.querySelector('.tp-close');

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.toggle('tp-open');
      });

      closeBtn.addEventListener('click', function () {
        panel.classList.remove('tp-open');
      });

      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) {
          panel.classList.remove('tp-open');
        }
      });

      wrap.querySelectorAll('.tp-swatch').forEach(function (b) {
        b.addEventListener('click', function () {
          setPalette(b.getAttribute('data-palette'));
        });
      });
    });
  }

  window.themePickerPlugin = themePickerPlugin;
})();
