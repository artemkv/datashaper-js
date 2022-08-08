"use strict";

const OP_MAP = Symbol();
const OP_FLATMAP = Symbol();
const OP_FILTER = Symbol();
const OP_DISTINCT = Symbol();
const OP_SORT = Symbol();
const OP_SKIP = Symbol();
const OP_TAKE = Symbol();
const OP_TOSET = Symbol();
const OP_LISTKEYS = Symbol();
const OP_LISTVALUES = Symbol();
const OP_TOLIST = Symbol();
const OP_TOMAP = Symbol();
const OP_TOLOOKUP = Symbol();
const OP_ZIP = Symbol();
const OP_LOG = Symbol();

const toOpString = (op) => {
  switch (op) {
    case OP_MAP: return 'map';
    case OP_FLATMAP: return 'flatmap';
    case OP_FILTER: return 'filter';
    case OP_DISTINCT: return 'distinct';
    case OP_SORT: return 'sort';
    case OP_SKIP: return 'skip';
    case OP_TAKE: return 'take';
    case OP_TOSET: return 'toSet';
    case OP_LISTKEYS: return 'listKeys';
    case OP_LISTVALUES: return 'listValues';
    case OP_TOLIST: return 'toList';
    case OP_TOMAP: return 'toMap';
    case OP_TOLOOKUP: return 'toLookup';
    case OP_ZIP: return 'zip';
    case OP_LOG: return 'log';
  }
}

const map = (obj, f) => {
  if (Array.isArray(obj)) {
    return obj.map(f);
  }
  const m = {};
  Object.keys(obj).forEach((k) => m[k] = f(obj[k]));
  return m;
}

const filter = (obj, f) => {
  if (Array.isArray(obj)) {
    return obj.filter(f);
  }
  const m = {};
  Object.keys(obj).forEach((k) => {
    if (f(obj[k])) {
      m[k] = obj[k];
    }
  });
  return m;
}

const distinct = (aa) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  return listValues(toSet(aa));
}

const sort = (aa, f) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  let xx = [...aa];
  xx.sort(f);
  return xx;
}

const skip = (aa, n) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  return aa.slice(n);
}

const take = (aa, n) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  return aa.slice(0, n);
}

const toSet = (aa) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  const m = {};
  aa.forEach((a) => m[a] = a);
  return m;
}

const toList = (m) => {
  if (Array.isArray(m)) {
    return [...m];
  }
  return Object.keys(m).map((k) => ({ k, v: m[k] }));
}

const toMap = (aa, kfunc, vfunc) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  const m = {};
  aa.forEach((a) => m[kfunc(a)] = vfunc(a));
  return m;
}

const toLookup = (aa, kfunc, vfunc) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  const m = {};
  aa.forEach((a) => {
    const key = kfunc(a);
    const val = vfunc(a);
    if (key in m) {
      m[key].push(val);
    } else {
      m[key] = [val];
    }
  });
  return m;
}

const listKeys = (m) => {
  if (Array.isArray(m)) {
    throw "not an object";
  }
  return Object.keys(m);
}

const listValues = (m) => {
  if (Array.isArray(m)) {
    throw "not an object";
  }
  return Object.keys(m).map((k) => m[k]);
}

const flatMap = (aa, f) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  return aa.flatMap(f);
}

const zip = (aa, xx, f) => {
  if (!Array.isArray(aa)) {
    throw "not an array";
  }
  if (!Array.isArray(xx)) {
    throw "expected to be zipped with an array";
  }
  return aa.map(function (a, idx) {
    return f(a, xx[idx]);
  });
}

const run = (start, pipe, debug) => {
  let obj = start;
  if (debug) {
    console.log(JSON.stringify(obj));
  }

  for (let i = 0; i < pipe.length; i++) {
    const op = pipe[i];
    if (op.op === OP_MAP) {
      obj = map(obj, op.arg);
    } else if (op.op === OP_FLATMAP) {
      obj = flatMap(obj, op.arg);
    } else if (op.op === OP_FILTER) {
      obj = filter(obj, op.arg);
    } else if (op.op === OP_DISTINCT) {
      obj = distinct(obj);
    } else if (op.op === OP_SORT) {
      obj = sort(obj, op.arg);
    } else if (op.op === OP_SKIP) {
      obj = skip(obj, op.arg);
    } else if (op.op === OP_TAKE) {
      obj = take(obj, op.arg);
    } else if (op.op === OP_TOSET) {
      obj = toSet(obj);
    } else if (op.op === OP_TOLIST) {
      obj = toList(obj);
    } else if (op.op === OP_LISTKEYS) {
      obj = listKeys(obj);
    } else if (op.op === OP_LISTVALUES) {
      obj = listValues(obj);
    } else if (op.op === OP_TOMAP) {
      obj = toMap(obj, op.arg.kfunc, op.arg.vfunc);
    } else if (op.op === OP_TOLOOKUP) {
      obj = toLookup(obj, op.arg.kfunc, op.arg.vfunc);
    } else if (op.op === OP_ZIP) {
      obj = zip(obj, op.arg.xx, op.arg.f);
    } else if (op.op === OP_LOG) {
      console.log(`${JSON.stringify(obj)}`);
    }

    if (debug) {
      console.log(`${toOpString(op.op)} -> ${JSON.stringify(obj)}`);
    }
  }
  return obj;
}

const from = (obj) => {
  const start = obj;
  const pipe = [];

  let shaper = {
    map: (f) => {
      pipe.push({ op: OP_MAP, arg: f });
      return shaper;
    },
    flatMap: (f) => {
      pipe.push({ op: OP_FLATMAP, arg: f });
      return shaper;
    },
    filter: (f) => {
      pipe.push({ op: OP_FILTER, arg: f });
      return shaper;
    },
    distinct: () => {
      pipe.push({ op: OP_DISTINCT });
      return shaper;
    },
    sorted: (f) => {
      pipe.push({ op: OP_SORT, arg: f });
      return shaper;
    },
    skip: (n) => {
      pipe.push({ op: OP_SKIP, arg: n });
      return shaper;
    },
    take: (n) => {
      pipe.push({ op: OP_TAKE, arg: n });
      return shaper;
    },
    toSet: () => {
      pipe.push({ op: OP_TOSET });
      return shaper;
    },
    toList: () => {
      pipe.push({ op: OP_TOLIST });
      return shaper;
    },
    listKeys: () => {
      pipe.push({ op: OP_LISTKEYS });
      return shaper;
    },
    listValues: () => {
      pipe.push({ op: OP_LISTVALUES });
      return shaper;
    },
    toMap: (kfunc, vfunc) => {
      pipe.push({ op: OP_TOMAP, arg: { kfunc, vfunc } });
      return shaper;
    },
    toLookup: (kfunc, vfunc) => {
      pipe.push({ op: OP_TOLOOKUP, arg: { kfunc, vfunc } });
      return shaper;
    },
    zip: (xx, f) => {
      pipe.push({ op: OP_ZIP, arg: { xx, f } });
      return shaper;
    },
    log: () => {
      pipe.push({ op: OP_LOG });
      return shaper;
    },
    return: (debug) => run(start, pipe, debug),
  };

  return shaper;
}

const id = (x) => x;

const konst = (x) => (_) => x;

const pair = (fst, snd) => ({ fst, snd })

module.exports = {
  from,
  id,
  konst,
  pair
};

