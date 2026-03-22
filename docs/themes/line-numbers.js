/*
 * Docsify plugin: adds line numbers to code blocks.
 *
 * Wraps each line in a <span class="code-line"> so CSS can use counters
 * to render line numbers with a vertical divider.
 *
 * Load this BEFORE docsify.js in the HTML.
 */
function lineNumbersPlugin(hook) {
  hook.doneEach(function () {
    var blocks = document.querySelectorAll('pre[data-lang] > code');
    blocks.forEach(function (block) {
      if (block.querySelector('.code-line')) return;
      var html = block.innerHTML;
      var lines = html.split('\n');
      if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        lines.pop();
      }
      block.innerHTML = lines
        .map(function (line) {
          return '<span class="code-line">' + (line || ' ') + '</span>';
        })
        .join('');
    });
  });
}
