# cocoon-vanilla-js

A vanilla JS replacement for (Rails) [Cocoon](https://github.com/nathanvda/cocoon)'s jQuery script


## Usage

Replace `<commit>` with the corresponding values:

```
yarn add git+https://github.com/kollegorna/cocoon-vanilla-js.git#<commit>
```

Import as ES6 module:

```js
import 'cocoon-vanilla-js'
```

## Notes

To broaden browser support, include the following polyfills in your project:

- [Element.closest](https://www.npmjs.com/package/element-closest)
- [Element.classList](https://www.npmjs.com/package/classlist-polyfill)
- [CustomEvent](https://www.npmjs.com/package/custom-event-polyfill)
