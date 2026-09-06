# ngx-daisy-extensions

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Angular-first components built with Angular ARIA and the Angular CDK, styled with Tailwind CSS and DaisyUI, with no extra dependencies.

```bash
npx ngx-daisy-extensions init
npx ngx-daisy-extensions add combobox
```

`init` asks where component files should be written and stores the answer in `daisy-extensions.json`. The default is `src/app/daisy-extensions`.

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
