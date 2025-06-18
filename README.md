# Stripdown

A Markdown superset for comic book scripts.

> [!WARNING]
> This is a work in progress. The spec may change. The code may be buggy.

## Contents

This monorepo contains the Stripdown spec, libraries for parsing and enhancing Stripdown documents, and plugins for 3rd-party writing apps.

* [codemirror](./libs/codemirror) - A collection of [CodeMirror](https://codemirror.net/) extensions for parsing, styling, linting, and autocompleting Stripdown text.
* [joplin-plugin](./app-plugins/joplin) - The Stripdown CodeMirror extensions packaged as a plugin for [Joplin](https://joplinapp.org/).
* [obsidian-plugin](./app-plugins/obsidian) - The Stripdown CodeMirror extensions packaged as a plugin for [Obsidian](https://obsidian.md/).
* [playground](./apps/playground) - The proving ground for Stripdown features and user experience.
* [spec](./libs/spec) - The definition of what Stripdown is, how it is meant to be written and parsed, and what functionality the syntax 
