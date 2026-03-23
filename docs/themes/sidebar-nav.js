/*
 * Sidebar bar indicator — spanning bar + section highlight.
 *
 * Collapse guard: clicking an expanded header once arms it — the click
 * is swallowed entirely so docsify never sees it. Only a second
 * consecutive click allows collapse. Any other click disarms.
 *
 * Scroll adjustment: switching pages keeps the clicked header under
 * the cursor after sub-sections expand/collapse.
 */

(function () {
  var observer;
  var collapseArmed = null;       // href of header armed for collapse
  var pendingScrollTarget = null; // { element, viewportY }

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
    var hash = window.location.hash;

    if (!hash || hash.indexOf('?id=') === -1) {
      return pageLi.querySelector(':scope > a');
    }

    var links = pageLi.querySelectorAll('ul li > a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === hash) return links[i];
    }
    var decodedHash = decodeURIComponent(hash);
    for (var i = 0; i < links.length; i++) {
      var href = decodeURIComponent(links[i].getAttribute('href') || '');
      if (href === decodedHash) return links[i];
    }

    var subs = pageLi.querySelectorAll('ul li');
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].classList.contains('active')) {
        var a = subs[i].querySelector(':scope > a');
        if (a) return a;
      }
    }

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
      if (pendingScrollTarget) {
        var target = pendingScrollTarget;
        pendingScrollTarget = null;
        var newRect = target.element.getBoundingClientRect();
        var delta = newRect.top - target.viewportY;
        if (Math.abs(delta) > 2) {
          var sidebar = document.querySelector('.sidebar');
          if (sidebar) sidebar.scrollTop += delta;
        }
      }
      applyActiveStates();
    });

    hook.ready(function () {
      observer = new MutationObserver(function () {
        applyActiveStates();
      });
      reconnect();

      window.addEventListener('hashchange', function () {
        applyActiveStates();
      });

      var nav = document.querySelector('.sidebar-nav');
      if (!nav) return;

      // Capture phase — runs before docsify's handlers
      nav.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;

        var href = a.getAttribute('href');
        var li = a.closest('li');
        var rootUl = nav.querySelector(':scope > ul');
        var isTopLevel = li && li.parentElement === rootUl;

        if (!isTopLevel) {
          collapseArmed = null;
          return;
        }

        // --- Top-level header click ---
        var currentPath = (window.location.hash || '#/').split('?')[0];
        var linkPath = (href || '').split('?')[0];
        var isCurrentPage = linkPath === currentPath;

        if (!isCurrentPage) {
          collapseArmed = null;
          pendingScrollTarget = {
            element: a,
            viewportY: a.getBoundingClientRect().top,
          };
          return;
        }

        // Check if sub-sections are visible (docsify may not use active on the li)
        var subUl = li.querySelector('ul');
        var isExpanded = subUl && subUl.children.length > 0;

        if (!isExpanded) {
          collapseArmed = null;
          return;
        }

        if (collapseArmed === href) {
          collapseArmed = null;
          return;
        }

        // First click on expanded header — swallow the event completely
        e.preventDefault();
        e.stopImmediatePropagation();
        collapseArmed = href;

        // Update URL silently (replaceState doesn't trigger hashchange)
        if (window.location.hash !== linkPath) {
          history.replaceState(null, '',
            window.location.pathname + window.location.search + linkPath);
        }

        // Scroll content to top
        window.scrollTo(0, 0);

        applyActiveStates();
      }, true);
    });
  }

  window.sidebarNavPlugin = sidebarNavPlugin;
})();
