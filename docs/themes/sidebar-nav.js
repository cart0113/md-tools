/*
 * Sidebar bar indicator — spanning bar + section highlight.
 *
 * Adds a light bar spanning the active page entry and all its
 * subsections, with a strong accent bar on the currently viewed
 * section. Manages custom classes (sb-spanning, sb-current) in
 * response to docsify's active-state updates and URL changes.
 */

(function () {
  var observer;

  function findPageLi(nav) {
    var rootUl = nav.querySelector(':scope > ul');
    if (!rootUl) return null;
    var topLis = rootUl.querySelectorAll(':scope > li');

    for (var i = 0; i < topLis.length; i++) {
      if (topLis[i].classList.contains('active')) return topLis[i];
    }
    for (var i = 0; i < topLis.length; i++) {
      if (topLis[i].querySelector('.active')) return topLis[i];
    }

    var path = (window.location.hash || '#/').split('?')[0];
    for (var i = 0; i < topLis.length; i++) {
      var a = topLis[i].querySelector(':scope > a');
      if (a) {
        var href = a.getAttribute('href');
        if (href === path || href === path + '/') return topLis[i];
      }
    }
    return null;
  }

  function findCurrentLink(pageLi) {
    // 1. Check docsify's active class on sub-items
    var subs = pageLi.querySelectorAll('ul li');
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].classList.contains('active')) {
        var a = subs[i].querySelector(':scope > a');
        if (a) return a;
      }
    }

    // 2. Match by URL hash (handles ?id= sub-section anchors)
    var hash = window.location.hash;
    if (hash && hash.indexOf('?id=') !== -1) {
      var links = pageLi.querySelectorAll('ul li > a');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (href === hash) return links[i];
      }
      // Normalize comparison: decode both sides
      var decodedHash = decodeURIComponent(hash);
      for (var i = 0; i < links.length; i++) {
        var href = decodeURIComponent(links[i].getAttribute('href') || '');
        if (href === decodedHash) return links[i];
      }
    }

    // 3. Fall back to page-level link
    return pageLi.querySelector(':scope > a');
  }

  function applyActiveStates() {
    if (observer) observer.disconnect();

    var nav = document.querySelector('.sidebar-nav');
    if (!nav) { reconnect(); return; }

    nav.querySelectorAll('.sb-spanning').forEach(function (el) {
      el.classList.remove('sb-spanning');
    });
    nav.querySelectorAll('.sb-current').forEach(function (el) {
      el.classList.remove('sb-current');
    });
    nav.querySelectorAll('a').forEach(function (el) {
      el.style.removeProperty('--sb-bar-left');
    });

    var pageLi = findPageLi(nav);
    if (pageLi) {
      pageLi.classList.add('sb-spanning');

      var baseLeft = pageLi.getBoundingClientRect().left;
      pageLi.querySelectorAll('a').forEach(function (a) {
        var offset = baseLeft - a.getBoundingClientRect().left;
        if (offset !== 0) {
          a.style.setProperty('--sb-bar-left', offset + 'px');
        }
      });

      var current = findCurrentLink(pageLi);
      if (current) current.classList.add('sb-current');
    }

    reconnect();
  }

  function reconnect() {
    var sidebar = document.querySelector('.sidebar-nav');
    if (sidebar && observer) {
      observer.observe(sidebar, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class'],
      });
    }
  }

  function sidebarNavPlugin(hook) {
    hook.doneEach(function () {
      setTimeout(applyActiveStates, 20);
    });

    hook.ready(function () {
      observer = new MutationObserver(function () {
        applyActiveStates();
      });
      reconnect();

      // Sub-section clicks change the hash without reloading the page
      // and may not trigger class changes, so listen for hash changes.
      window.addEventListener('hashchange', function () {
        setTimeout(applyActiveStates, 20);
      });

      // Also catch clicks on sidebar links directly for immediate feedback.
      var nav = document.querySelector('.sidebar-nav');
      if (nav) {
        nav.addEventListener('click', function (e) {
          var a = e.target.closest('a');
          if (a) setTimeout(applyActiveStates, 30);
        });
      }
    });
  }

  window.sidebarNavPlugin = sidebarNavPlugin;
})();
