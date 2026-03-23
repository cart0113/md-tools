/*
 * Collapsible folders — click folder headers to expand/collapse.
 *
 * Folder items in the sidebar are <li> elements with a <p> direct child
 * (bold section headers). Document items have <a> direct children.
 * This plugin makes folder <p> elements clickable and toggles visibility
 * of their child <ul>.
 */

(function () {
  function getCurrentPath() {
    return (window.location.hash || '#/').split('?')[0];
  }

  function folderContainsPath(li, path) {
    var links = li.querySelectorAll('ul a');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').split('?')[0];
      if (href === path) return true;
    }
    return false;
  }

  function setupFolders() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    var currentPath = getCurrentPath();

    var allLis = nav.querySelectorAll('li');
    for (var i = 0; i < allLis.length; i++) {
      var li = allLis[i];
      var p = li.querySelector(':scope > p');
      var ul = li.querySelector(':scope > ul');

      if (!p || !ul) continue;
      if (li.classList.contains('ext-folder')) continue;

      li.classList.add('ext-folder');

      (function (folderLi) {
        folderLi.querySelector(':scope > p').addEventListener('click', function () {
          folderLi.classList.toggle('ext-folder-collapsed');
        });
      })(li);
    }

    var folders = nav.querySelectorAll('li.ext-folder');
    for (var j = 0; j < folders.length; j++) {
      var folder = folders[j];
      if (folderContainsPath(folder, currentPath)) {
        folder.classList.remove('ext-folder-collapsed');
      } else {
        folder.classList.add('ext-folder-collapsed');
      }
    }
  }

  function collapsibleFoldersPlugin(hook) {
    hook.doneEach(function () {
      setupFolders();
    });
  }

  window.collapsibleFoldersPlugin = collapsibleFoldersPlugin;
})();
