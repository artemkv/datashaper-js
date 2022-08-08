const { from, id, konst, pair } = require('./shaper');

test('Selling case - list', () => {
  const actual = from([0, 1, 2, 3, 2, 3, 4, 5, 6])
    .filter((x) => x > 1)
    .map((x) => x + 1)
    .map((x) => x * 2)
    .distinct()
    .sorted((a, b) => b - a)
    .skip(1)
    .take(3)
    .return();

  const expected = [12, 10, 8];
  expect(actual).toStrictEqual(expected);
});

test('Selling case - map', () => {
  const actual = from({
    alice: { height: 171 },
    bob: { height: 185 },
    joe: { height: 168 },
  })
    .map((x) => x.height)
    .filter((x) => x > 170)
    .listValues()
    .sorted((a, b) => b - a)
    .return();

  const expected = [185, 171];
  expect(actual).toStrictEqual(expected);
});

test('map', () => {
  const actual = from([1, 2, 3])
    .map((x) => x + 1)
    .return();

  const expected = [2, 3, 4];
  expect(actual).toStrictEqual(expected);
});

test('map after map', () => {
  const actual = from([1, 2, 3])
    .map((x) => x + 1)
    .map((x) => x * 2)
    .return();

  const expected = [4, 6, 8];
  expect(actual).toStrictEqual(expected);
});

test('filter', () => {
  const actual = from([1, 4, 3, 2, 5])
    .filter((x) => x > 2)
    .return();

  const expected = [4, 3, 5];
  expect(actual).toStrictEqual(expected);
});

test('filter after filter', () => {
  const actual = from([1, 4, 3, 2, 5])
    .filter((x) => x > 2)
    .filter((x) => x < 5)
    .return();

  const expected = [4, 3];
  expect(actual).toStrictEqual(expected);
});

test('distinct', () => {
  const actual = from([1, 1, 2, 3, 2, 3])
    .distinct()
    .return();

  const expected = [1, 2, 3];
  expect(actual).toStrictEqual(expected);
});

test('distinct, mixed string and numbers', () => {
  const actual = from([1, 1, 2, 3, 2, '3'])
    .distinct()
    .return();

  const expected = [1, 2, '3'];
  expect(actual).toStrictEqual(expected);
});

test('sorted', () => {
  const actual = from([1, 4, 3, 2, 5])
    .sorted()
    .return();

  const expected = [1, 2, 3, 4, 5];
  expect(actual).toStrictEqual(expected);
});

test('sorted with function', () => {
  const actual = from([1, 4, 3, 2, 5])
    .sorted((a, b) => b - a)
    .return();

  const expected = [5, 4, 3, 2, 1];
  expect(actual).toStrictEqual(expected);
});

test('skip', () => {
  const actual = from([1, 2, 3, 4, 5])
    .skip(2)
    .return();

  const expected = [3, 4, 5];
  expect(actual).toStrictEqual(expected);
});

test('take', () => {
  const actual = from([1, 2, 3, 4, 5])
    .take(2)
    .return();

  const expected = [1, 2];
  expect(actual).toStrictEqual(expected);
});

test('toSet', () => {
  const actual = from(['a', 'b', 'b'])
    .toSet()
    .return();

  const expected = {
    a: 'a',
    b: 'b',
  };
  expect(actual).toStrictEqual(expected);
});

test('map over a map', () => {
  const actual = from({ a: 1, b: 2 })
    .map((x) => x * 2)
    .return();
  const expected = { a: 2, b: 4 };
  expect(actual).toStrictEqual(expected);
});

test('filter over a map', () => {
  const actual = from({ a: 1, b: 2, c: 3 })
    .filter((x) => x >= 2)
    .return();
  const expected = { b: 2, c: 3 };
  expect(actual).toStrictEqual(expected);
});

test('distinct over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .distinct()
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('sort over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .sorted()
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('skip over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .skip(1)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('take over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .take(1)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('toSet over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .toSet(1)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('toList over a map', () => {
  const actual = from({ a: 1, b: 2 })
    .toList()
    .return();
  const expected = [{ k: 'a', v: 1 }, { k: 'b', v: 2 }];
  expect(actual).toStrictEqual(expected);
});

test('list map keys', () => {
  const actual = from({ a: 1, b: 2 })
    .listKeys()
    .return();
  const expected = ['a', 'b'];
  expect(actual).toStrictEqual(expected);
});

test('list map values', () => {
  const actual = from({ a: 1, b: 2 })
    .listValues()
    .return();
  const expected = [1, 2];
  expect(actual).toStrictEqual(expected);
});

test('listKeys over a list', () => {
  let actual;
  try {
    from([1, 2, 3])
      .listKeys()
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an object";
  expect(actual).toStrictEqual(expected);
});

test('listValues over a list', () => {
  let actual;
  try {
    from([1, 2, 3])
      .listValues()
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an object";
  expect(actual).toStrictEqual(expected);
});

test('toList over a list', () => {
  const actual = from([1, 2, 3])
    .toList()
    .return();
  const expected = [1, 2, 3];
  expect(actual).toStrictEqual(expected);
});

test('toMap', () => {
  const actual = from([
    { name: 'alice', height: 171 },
    { name: 'bob', height: 185 },
    { name: 'joe', height: 168 }
  ])
    .toMap((x) => x.name, (x) => x.height)
    .return();
  const expected = {
    alice: 171,
    bob: 185,
    joe: 168,
  };
  expect(actual).toStrictEqual(expected);
});

test('toMap over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .toMap(konst(1), id)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('flatMap', () => {
  const actual = from([1, 2, 3])
    .flatMap((x) => [x, x + 1])
    .return();

  const expected = [1, 2, 2, 3, 3, 4];
  expect(actual).toStrictEqual(expected);
});

test('flatMap over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .flatMap(id)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('map using id', () => {
  const actual = from([1, 2, 3])
    .map(id)
    .return();

  const expected = [1, 2, 3];
  expect(actual).toStrictEqual(expected);
});

test('map using konst', () => {
  const actual = from([1, 2, 3])
    .map(konst('a'))
    .return();

  const expected = ['a', 'a', 'a'];
  expect(actual).toStrictEqual(expected);
});

test('toLookup', () => {
  const actual = from([
    { name: 'alice', points: 3 },
    { name: 'bob', points: 5 },
    { name: 'alice', points: 7 },
    { name: 'bob', points: 1 },
    { name: 'bob', points: 4 },
  ])
    .toLookup((x) => x.name, (x) => x.points)
    .return();
  const expected = {
    alice: [3, 7],
    bob: [5, 1, 4],
  };
  expect(actual).toStrictEqual(expected);
});

test('toLookup over a map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .toLookup(konst(1), konst(2))
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('zip', () => {
  const actual = from([1, 2, 3])
    .zip(['a', 'b', 'c'], pair)
    .return();

  const expected = [{ fst: 1, snd: 'a' }, { fst: 2, snd: 'b' }, { fst: 3, snd: 'c' }];
  expect(actual).toStrictEqual(expected);
});

test('zip with larger array', () => {
  const actual = from([1, 2, 3])
    .zip(['a', 'b', 'c', 'd'], pair)
    .return();

  const expected = [{ fst: 1, snd: 'a' }, { fst: 2, snd: 'b' }, { fst: 3, snd: 'c' }];
  expect(actual).toStrictEqual(expected);
});

test('zip with smaller array', () => {
  const actual = from([1, 2, 3])
    .zip(['a', 'b'], pair)
    .return();

  const expected = [{ fst: 1, snd: 'a' }, { fst: 2, snd: 'b' }, { fst: 3, snd: undefined }];
  expect(actual).toStrictEqual(expected);
});

test('zip over map', () => {
  let actual;
  try {
    from({ a: 1, b: 2, c: 3 })
      .zip([], pair)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "not an array";
  expect(actual).toStrictEqual(expected);
});

test('zip with map', () => {
  let actual;
  try {
    from([1, 2, 3])
      .zip({}, pair)
      .return();
  } catch (err) {
    actual = err;
  }

  const expected = "expected to be zipped with an array";
  expect(actual).toStrictEqual(expected);
});