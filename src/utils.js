function isEqual(objectA, objectB) {
  return JSON.stringify(objectA) === JSON.stringify(objectB);
}

function unique(array) {
  return array.reduce((uniqueArray, currentElement) => {
    const isDuplicated = uniqueArray.find(element =>
      isEqual(element, currentElement)
    );
    return isDuplicated ? uniqueArray : [...uniqueArray, currentElement];
  }, []);
}

function flat(array) {
  return [].concat.apply([], array);
}

function cloneDeep(object) {
  return JSON.parse(JSON.stringify(object));
}

function replace(str, keys, value) {
  return keys.reduce((accum, current) => accum.replace(current, value), str);
}

export { isEqual, unique, flat, cloneDeep, replace };
