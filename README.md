# ngx-daisy-extensions

Composable DaisyUI components installed into Angular applications as editable source, following the shadcn ownership model.

## Usage

Initialize the project and choose where generated components should live:

```bash
npx ngx-daisy-extensions init
```

The default directory is `src/app/daisy-extensions`. The choice is stored in `daisy-extensions.json` and can also be supplied directly:

```bash
npx ngx-daisy-extensions init --directory src/app/ui
```

Add individual components:

```bash
npx ngx-daisy-extensions add select
npx ngx-daisy-extensions add combobox
npx ngx-daisy-extensions add --all
```

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
npx ngx-daisy-extensions init
npx ngx-daisy-extensions add combobox
```
