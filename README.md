# ngx-daisy-extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Composable Angular components installed into applications as editable source.

## About

`ngx-daisy-extensions` provides Angular-first components built with Angular ARIA and the Angular CDK, styled with Tailwind CSS and DaisyUI, with no extra dependencies.

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

Install all available components into the default directory, `src/app/daisy-extensions`:

```bash
npx ngx-daisy-extensions install
```

Choose a different directory or install specific components:

```bash
npx ngx-daisy-extensions install --directory src/app/ui
npx ngx-daisy-extensions install select
npx ngx-daisy-extensions install combobox
```

For a two-step setup, initialize the project first and then add components:

```bash
npx ngx-daisy-extensions init
npx ngx-daisy-extensions add select
npx ngx-daisy-extensions add combobox
npx ngx-daisy-extensions add --all
```

`init` creates `daisy-extensions.json`; `install` creates it if needed and then copies component files.

Existing modified files are skipped. Pass `--overwrite` only when registry versions should replace local changes, or use `--dry-run` to preview an installation.

## Angular API

Classes are prefixed with `Dxe`, element selectors with `dxe-`, and directive selectors with `dxe`:

```html
<dxe-combobox-root [(value)]="selectedCountries">
  <dxe-combobox-trigger>
    <dxe-placeholder>Select countries...</dxe-placeholder>
    <dxe-dropdown-button />
  </dxe-combobox-trigger>

  <input dxeComboboxInput alwaysExpanded [(value)]="searchString" />

  <ng-container *dxeComboboxPortal>
    <dxe-combobox-option [value]="country">
      <dxe-combobox-option-label>{{ country.name }}</dxe-combobox-option-label>
    </dxe-combobox-option>
  </ng-container>
</dxe-combobox-root>
```

## Development

The demo imports registry sources directly through TypeScript path aliases. Do not install components into the demo app.

```ts
import { DxeSelectImports } from '@dxe/select';
import { DxeComboboxImports } from '@dxe/combobox';
```

The published CLI copies those same files into consumer projects:

```bash
npx ngx-daisy-extensions install combobox
```

## License

MIT © [Oleh Biblyi](https://github.com/OlegSuncrown)
