# ngx-daisy-extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[Demo](https://ngx-daisy-extensions.netlify.app)

Composable Angular components installed into applications as editable source.

## About

`ngx-daisy-extensions` provides Angular-first components built with Angular ARIA and the Angular CDK, styled with Tailwind CSS and DaisyUI, with no extra dependencies.

## Installation

1.Install Angular CDK and import overlay styles:

```bash
npm install @angular/cdk
```

```css
@import '@angular/cdk/overlay-prebuilt.css';
```

2.Install Angular ARIA:

```bash
npm install @angular/aria
```

3.Install [Tailwind CSS](https://tailwindcss.com/docs/installation/framework-guides/angular).

4.Install [daisyUI for Angular](https://daisyui.com/docs/install/angular/).

5.Install `ngx-daisy-extensions`:

```bash
npx ngx-daisy-extensions install
```

## Angular API

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
