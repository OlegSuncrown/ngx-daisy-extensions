# ngx-daisy-extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Angular-first components built with Angular ARIA and the Angular CDK, styled with Tailwind CSS and DaisyUI, with no extra dependencies.

## Installation

Install and configure the required Angular and styling packages:

```bash
npm install @angular/aria @angular/cdk tailwindcss daisyui
```

Useful setup links: [Angular ARIA](https://www.npmjs.com/package/@angular/aria), [Angular CDK](https://material.angular.dev/cdk/categories), [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/angular), [DaisyUI](https://daisyui.com/docs/install/).

Then install `ngx-daisy-extensions`:

```bash
npm install ngx-daisy-extensions
```

## Usage

Install all components:

```bash
npx ngx-daisy-extensions install
```

`install` creates `daisy-extensions.json` if needed and copies component files. The default directory is `src/app/daisy-extensions`.

Choose a different directory:

```bash
npx ngx-daisy-extensions install --directory src/app/ui
```

For a two-step setup, run `init` first and then add all components:

```bash
npx ngx-daisy-extensions init
npx ngx-daisy-extensions add --all
```

`init` creates only `daisy-extensions.json`. To copy component files, run `install` or `add --all`.

Available components:

- `select`
- `combobox`

The generated Angular classes use the `Dxe` prefix. Element selectors use `dxe-`, and attribute directives use `dxe`, for example:

```html
<dxe-combobox-root>
  <dxe-combobox-trigger />
  <input dxeComboboxInput />
  <ng-container *dxeComboboxPortal />
</dxe-combobox-root>
```

The CLI does not overwrite changed component files unless `--overwrite` is passed.

This package is for consumer projects. In this repository the demo imports `libs/components/registry` through `@dxe/*` path aliases.

## License

MIT © [Oleh Biblyi](https://github.com/OlegSuncrown)
