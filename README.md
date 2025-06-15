# Stripdown

A Markdown superset for comic book scripts.

> [!WARNING]
> This is a work in progress. The spec may change. The code may be buggy.

## Contents

This monorepo contains the Stripdown spec, libraries for parsing and enhancing Stripdown documents, and plugins for 3rd-party writing apps.

* [codemirror](./packages/codemirror) - A collection of [CodeMirror](https://codemirror.net/) extensions for parsing, styling, linting, and autocompleting Stripdown text.
* [joplin-plugin](./packages/joplin-plugin) - The Stripdown CodeMirror extensions packaged as a plugin for [Joplin](https://joplinapp.org/).
* [obsidian-plugin](./packages/obsidian-plugin) - The Stripdown CodeMirror extensions packaged as a plugin for [Obsidian](https://obsidian.md/).
* [spec](./packages/stripdown-spec) - The definition of what Stripdown is, how it is meant to be written and parsed, and what functionality the syntax 
* [playground](./apps/playground) - The proving ground for Stripdown features and user experience.
