datashaper-js - Pure js minimalist data shaper
=======

## Usage

Import:

```js
const { from } = require('datashaper-js');
```

Import extra functions:

```js
const { from, id, konst } = require('datashaper-js');
```

Example with array:

```js
from([0, 1, 1, 2, 3])
    .filter((x) => x >= 1)      // [1, 1, 2, 3]
    .map((x) => x + 1)          // [2, 2, 3, 4]
    .map((x) => x * 2)          // [3, 4, 6, 8]
    .distinct()                 // [4, 6, 8]
    .sorted((a, b) => b - a)    // [8,6,4]
    .skip(1)                    // [6, 4]
    .take(1)                    // [6]
    .return();                  // [6]
```

Example with an object:

```js
from({
    alice: { height: 171 },
    bob: { height: 185 },
    joe: { height: 168 },
  })
    .map((x) => x.height)       // {"alice":171,"bob":185,"joe":168}
    .filter((x) => x > 170)     // {"alice":171,"bob":185}
    .listValues()               // [171, 185]
    .sorted((a, b) => b - a)    // [185, 171]
    .return();                  // [185, 171]
```

## Notes

Does not modify the initial object (__sorted__ returns new array instead of sorting in-place).

Lazily evaluated, does not apply any transformations until __return__ is called.

## Debugging

When debugging, to log all the intermediate operations and results, pass __true__ to __return__:

```js
from([0, 1, 1, 2, 3])
    .map((x) => x + 1)
    .return(true);
```

Alternatively, you can insert __log__ operation anywhere in the middle of the pipe:

```js
from([1, 2, 3])
    .filter((x) => x > 1)
    .map((x) => x * 2)
    .log()                  // logs [4,6]
    .distinct()
    .return();
```


## API

Arrays support: __map__, __filter__, __flatMap__, __distinct__, __sorted__, __skip__, __take__, __toSet__, __toMap__, __toLookup__

Objects support: __map__, __filter__, __toList__, __listKeys__, __listValues__

Extra helpful functions: __id__, __konst__