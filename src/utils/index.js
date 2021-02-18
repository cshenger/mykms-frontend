function hasRoles(arr1, arr2) {
  let arr3 = [];
  for (let s in arr1) {
    for (let x in arr2) {
      if (arr1[s] == arr2[x]) {
        arr3.push(arr1[s]);
      }
    }
  }

  return arr3.length > 0;
}

export {
  hasRoles
}