datashaper-js - Pure js minimalist data shaper
=======

Data shaper is extremely useful when working with APIs that return complex JSON objects. It allows to re-shape the returned data into the form that is consumable by your UI components.

## Usage

Import:

```js
const { from } = require('datashaper-js');
```

Import with extra functions:

```js
const { from, id, konst, pair } = require('datashaper-js');
```

Example with array:

```js
from([0, 1, 1, 2, 3])
    .filter((x) => x >= 1)      // [1, 1, 2, 3]
    .map((x) => x + 1)          // [2, 2, 3, 4]
    .map((x) => x * 2)          // [3, 4, 6, 8]
    .distinct()                 // [4, 6, 8]
    .sorted((a, b) => b - a)    // [8, 6, 4]
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
    .map((x) => x.height)       // { alice: 171, bob: 185, joe: 168 }
    .filter((x) => x > 170)     // { alice: 171, bob: 185 }
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

Arrays support: __map__, __filter__, __flatMap__, __distinct__, __sorted__, __skip__, __take__, __zip__, __toSet__, __toMap__, __toLookup__

Objects support: __map__, __filter__, __toList__, __listKeys__, __listValues__

Extra helpful functions: __id__, __konst__, __pair__

### Arrays

__map__

```js
from([1, 2, 3])
    .map((x) => x * 2)
    .return();

// [2, 4, 6]
```

__filter__

```js
from([1, 2, 3])
    .filter((x) => x % 2 === 0)
    .return();

// [2, 4]
```

__flatMap__

```js
from([1, 2, 3])
    .flatMap((x) => [x, x])
    .return();

// [1, 1, 2, 2, 3, 3]
```

__distinct__

```js
from([1, 2, 1, 2, 3])
    .distinct()
    .return();

// [1, 2, 3]
```

__sorted__

```js
from([1, 5, 4, 2, 3])
    .sorted()
    .return();

// [1, 2, 3, 4, 5]
```

__skip__

```js
from([1, 2, 3, 4, 5])
    .skip(2)
    .return();
    
// [3, 4, 5]
```

__take__

```js
from([1, 2, 3, 4, 5])
    .take(2)
    .return();
    
// [1, 2]
```

__zip__

```js
from([1, 2, 3])
    .zip(['a', 'b'], pair)
    .return();

// [{ fst: 1, snd: 'a' }, { fst: 2, snd: 'b' }, { fst: 3 }]
```

__toSet__

```js
from(['a', 'b', 'b'])
    .toSet()
    .return();

// { a: 'a', b: 'b' }
```

__toMap__

```js
from([
        { name: 'alice', height: 171 },
        { name: 'bob', height: 185 },
        { name: 'joe', height: 168 }
    ])
    .toMap((x) => x.name, (x) => x.height)
    .return();

// { alice: 171, bob: 185, joe: 168 }
```

__toLookup__

```js
from([
        { year: 2021, val: 5 },
        { year: 2022, val: 10 },
        { year: 2021, val: 3 }
    ])
    .toLookup((x) => x.year, (x) => x.val)
    .return();

// { 2021: [5, 3], 2022: [10] }
```

### Objects

__map__


```js
from({
        2021: 5,
        2022: 10,
        2023: 8
    })
    .map((x) => x * 2)
    .return();

// { 2021: 10, 2022: 20, 2023: 16 }
```

__filter__

```js
from({
        2021: 5,
        2022: 10,
        2023: 8
    })
    .filter((x) => x > 7)
    .return();

// { 2022: 10, 2023: 8 }
```

__toList__

```js
from({ a: 1, b: 2 })
    .toList()
    .return();

// [{ k: 'a', v: 1 }, { k: 'b', v: 2 }]
```

__listKeys__

```js
from({
        2021: 5,
        2022: 10,
        2023: 8
    })
    .listKeys()
    .return();

// ['2021', '2022', '2023']
```


__listValues__

```js
from({
        2021: 5,
        2022: 10,
        2023: 8
    })
    .listValues()
    .return();

// [5, 10, 8]
```

### Helpers

__id__

```js
const id = (x) => x;
```

__konst__

```js
const konst = (x) => (_) => x;
```

__pair__

```js
const pair = (fst, snd) => ({ fst, snd })
```