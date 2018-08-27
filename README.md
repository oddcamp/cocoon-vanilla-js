# cocoon-vanilla-js (private)

A vanilla JS replacement for (Rails) Cocoon's jQuery script


## Usage

Replace `<token>` and `<commit>` with the corresponding values:

```
yarn add git+https://<token>:x-oauth-basic@github.com/kollegorna/cocoon-vanilla-js.git#<commit>
```

Import as ES6 module:

```js
import 'cocoon-vanilla-js'
```

## Notes

To broaden browser support, use the following polyfills:

- [Element.closest](https://www.npmjs.com/package/element-closest)
- [Element.classList](https://www.npmjs.com/package/classlist-polyfill)
