"""Read docsify-ext.yaml and generate a JS config file for the browser.

The YAML file is the single source of truth for all docsify extension
settings. This module reads it, validates required keys, and writes a
JS file that sets window.__docsifyExtConfig plus applies immediate CSS
classes to <html> before docsify renders.
"""

import json
import pathlib

import yaml

REQUIRED_KEYS = [
    "theme_name",
    "theme_picker",
    "document_inline_sidebar_selector",
    "document_header_depth",
    "top_level_folders_as_top_control",
    "hamburger_menu",
    "github_corner",
]

JS_TEMPLATE = """\
window.__docsifyExtConfig = {config_json};
(function(c) {{
  if (!c.hamburger_menu) document.documentElement.classList.add('ext-no-hamburger');
  if (!c.github_corner) document.documentElement.classList.add('ext-no-github-corner');
  if (c.top_level_folders_as_top_control) document.documentElement.classList.add('ext-has-top-nav');
}})(window.__docsifyExtConfig);
"""


class ConfigError(Exception):
    pass


def load_config(docs_folder):
    """Read docsify-ext.yaml and return the config dict."""
    config_path = pathlib.Path(docs_folder) / "docsify-ext.yaml"
    raw = yaml.safe_load(config_path.read_text(encoding="utf-8"))

    missing = [k for k in REQUIRED_KEYS if k not in raw]
    if missing:
        raise ConfigError(f"Missing required config keys: {missing}")

    return raw


def generate_config_js(docs_folder):
    """Generate docs/themes/docsify-ext-config.js from the YAML config."""
    config = load_config(docs_folder)
    docs_root = pathlib.Path(docs_folder)
    config_json = json.dumps(config, indent=2)
    js_content = JS_TEMPLATE.format(config_json=config_json)
    output_path = docs_root / "themes" / "docsify-ext-config.js"
    output_path.write_text(js_content, encoding="utf-8")
    return output_path
