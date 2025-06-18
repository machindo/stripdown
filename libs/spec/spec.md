---
title: Stripdown Spec
version: '0.0.0'
---

# Stripdown

## Introduction

### What is Stripdown

Stripdown is a superset of Markdown for writing comic book scripts. It takes inspiration from [Markdown](https://www.markdownguide.org/), [Fountain](https://fountain.io/syntax/), and programming editors.

### What does it do?

Stripdown is not an app or set of features. It is a syntax that allows for certain features to exist. I believe a good comic book script editor should have all of the following features:

* Formatting as you type. You should be able to add headings, description, and dialogue without removing your hands from the keyboard.
* Page and panel numbering assistance. The editor should either number your headings automatically or warn you when headings are out of order.
* Allow multi-page spreads and multi-panel sequences.
* Track dialogue word count.
* Autocomplete character names.
* Format pages as pages when exporting and printing.
* Work in any language.

And then there are some other nice-to-haves:
* Make it easy for letterers to copy dialogue. Either one click copying or hotkeys should be enough to capture dialogue for a letterer to paste into another application.
* Display left vs right page side. Quite useful for ensuring your 2-page splash is printed on pages facing each other!
* Generate a panel count summary at the top of each page.
* Allow basic user-defined page layouts.

### Philosophy

A script is not an end in itself. It is a communication tool. A script is a structured way for a writer to describe to an artist and to a letterer what the art should look like, what the text should be, and what story they're trying to tell.

### Design goals

The overall design goal of Stripdown is the same as that of [Markdown](https://daringfireball.net/projects/markdown/):

> The idea is that a Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions.
> \- John Gruber

* Stripdown must be human-readable in its plain-text variant. Even without computer parsing, the content and intent of the writing must come across to the reader.
* Stripdown must be computer-readable. A computer must be able to extract data from the script for use in implementing the features described above.
* Stripdown rules should not conflict with Markdown rules or other popular Markdown extensions, such as [Github flavored Markdown](https://github.github.com/gfm/).
* Stripdown must be language agnostic and reading direction agnostic.

## Blocks

Unlike screenplays and teleplays, comic book scripts have no generally recognized standard. However, there are some basic elements found in most scripts no matter the format:

* **Title** - The title of the comic book. This is optional.
* **Page** - The main building block of a book. This is the bit the reader turns to continue reading the story. Comic books are typically made up of multiple pages; about 8 for a short story, 22 for a full issue, up to several hundred for a graphic novel. If the comic you're writing is very short or web-based, then you pages may be optional.
* **Panel** - Most comic books break pages up into multiple panels or frames.
* **Description** - The text describing the setting and action in each panel. Might also contain non-descriptive notes for the artist.
* **Speaker** - This tells the artist and letter who's talking. It could be a character's name or "Narrator" or "Caption" or "SFX" (for sound effects).
* **Dialogue/caption/SFX** - The words you see on the printed page. This includes any text in a speech balloon, thought bubble, narration, caption, or even sound effects.
* **Parenthetical** - A descriptor for the dialogue, such as "(off panel)" or "(whisper)." This tells the letterer how to draw the balloon and what style to use for the text.

### Title

A script title should use level-1 heading. Either the [ATX](https://spec.commonmark.org/0.31.2/#atx-headings) or [Setext](https://spec.commonmark.org/0.31.2/#setext-headings)  heading syntax will work, though the simpler ATX syntax is preferred.

```md
# Lost in Time

Lost in Time
============
```

Only one level-1 heading should be used in the document.

### Page heading

Page headings use the level-2 heading. Again, the ATX syntax is preferred.

```md
## Page 1

Page 1
------
```

A line can be recognized as a page heading by matching both of the following rules:

1. It is recognized as a level-2 Markdown heading.
2. It contains a number or range of numbers.

The word "page" is optional, but recommended. To support all languages, any words can be used in the heading and the location of the numerals does not matter.

Markdown parsers will treat these like other level-2 headings. Stripdown parsers will use the numbering to allow for validation and other supportive features, as well as create page breaks to assist with reading.

### Panel heading

Panel headings use the level-3 ATX heading. (Markdown only supports Setext style headings for levels 1 and 2.)

```md
### Panel 1
```

A line can be recognized as a panel heading by matching both of the following rules:

1. It is recognized as a level-3 Markdown heading.
2. It contains a number or range of numbers.

As with page headings, the word "panel" is optional but recommended.

Markdown parsers will treat these like other level-3 headings. Stripdown parsers will use the numbering to allow for validation and other supportive features.

### Page and panel numbering rules

#### Single numbers
Heading numbers must be written in Western Arabic numerals. They can appear anywhere within the heading. Non-numeric characters and spaces are ignored.

```md
## Page 1
(English)

## Seite 2
(German)

## Página 3
(Spanish)

## Страница 4
(Russian)

## 第5页
(Chinese)

## 6ページ
(Japanese)

## 7쪽
(Korean)

## 8 الصفحة
(Arabic)

## 9 עמוד
(Hebrew)
```

#### Ranges

Both page and panel headings support ranges of numbers. This can be used for defining multi-page spreads or panel sequences that would be too wordy to spell out. Ranges are separated by one of the following characters:

* Hyphen-minus sign (-). This is found between 0 and = on US keyboards
* En-dash (–)
* Em-dash (—)
* Tilde (~)
* Wave dash (〜)

The order of the numbers does not matter. Languages that are read left-to-right place the lower number on the left, while languages read right-to-left place the lower number on the right. Because there is no ambiguity in the order of the pages, either direction works. Parsers must treat the lower number as the starting page or panel, and the higher number as the ending page or panel.

```md
## Pages 1-2
(English)

## Seiten 3-4
(German)

## Páginas 5-6
(Spanish)

## Страница 7-8
(Russian)

## 第9-10页
(Chinese)

## 11〜12ページ
(Japanese)

## 13-14쪽
(Korean)

## 16-15 الصفحات
(Arabic)

## 18-17 עמודים
(Hebrew)
```

#### Escaping

As in [CommonMark](https://spec.commonmark.org/0.31.2/#atx-headings), numbers can be backslash-escaped. Escaped numbered headings should be ignored by parsers. They should not be autocorrected or considered invalid, and the numeric value should not be used for correcting later headings.

The following example is valid because the "Notes on Lost in Time 1" heading is ignored.

```md
## Page 1

## Notes on Lost in Time \1

## Page 2
```

#### Forced manual numbering

There may be cases where you need to prevent a heading number from being autocorrected, but still consider its value for further headings. You may, for example, break your script up into multiple text documents and thus need to start the page numbering at something other than 1. Or you may have a two-page spread that absolutely needs to be at the center of the comic book to avoid bleed. You may want to preserve that numbering even while adding and removing earlier pages.

In this case, you can force the numbering by padding it with a 0.

```md
## Page 10

## Pages 012-13

## Page 14
```

This is valid because 012 begins with a leading 0. The missing 11th page is ignored.

Note that only the escaped number is ignored, so the following heading example will be counted as panel 4:

```md
### Panel 4 of \6
```

### Speaker and dialogue

A speaker block is defined by ending a line in a colon and immediately following it with a non-blank line.

A speaker is any line that meets all of the following criteria.

* Would be recognized as a normal paragraph in Markdown.
* Is preceded by a blank line.
* Terminates in a colon.
* Is followed by a non-blank line.

A dialogue block is any line or group of lines immediately following a speaker block with no blank lines in between.

```md
Speaker:
This is dialogue.
This is also dialogue.

This is not dialogue. The blank line above ends the previous dialogue block.

Not a speaker:

The blank line above prevents the colon-terminating line from being considered a speaker block.
That makes this a normal paragraph as well.

## This is a heading:

- This is a list item:
```

This syntax has no significance in Markdown. The example block above will be treated as a normal paragraph. Even the line break after the colon will be ignored.

> Speaker:
> This is dialogue.
> This is also dialogue.

### Parenthetical

A parenthetical is a line entirely wrapped in parentheses. These can be used for different purposes, such as after speaker lines to add descriptors for the letterer, or after page headings to override auto-generated page summaries.

```
## Page 12-13
(Two-page splash)

### Panel 1
(No border or bleed)

Villain:
(Shouting)
**Time to meet your maker!**
```

When used after a speaker line, they are not to be considered part of the dialogue.

## Frontmatter

In editors that support it, the following YAML frontmatter property names have special meanings and requirements.

* [`characters`](#characters)
* [`pageTurnDirection`](#pageturndirection)
* [`oddSide`](#oddside)

### `characters`

A list of character names to use in autocompletion.

```yaml
characters:
  - Annette
  - Blanche
  - Estelle
```

### `pageTurnDirection`

The direction a book is read in the published language and region. In Western comics, this is usually `ltr` (left-to-right). In Manga, this is usually `rtl` (right-to-left).

Western comics:
```yaml
pageTurnDirection: ltr
```

Manga and right-to-left languages:
```yaml
pageTurnDirection: rtl
```

### `oddSide`

The hand-side of the odd-numbered pages. In English-language books, page 1 is usually on the right-hand side. For Manga, page 1 is usually on the left-hand side.

* When the `pageTurnDirection` is "ltr", `oddSide` is usually be "right".
* When the `pageTurnDirection` is "rtl", `oddSide` is usually "left".

Western comics:
```yaml
oddSide: right
```

Manga and right-to-left languages:
```yaml
oddSide: left
```
