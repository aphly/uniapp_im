
export function generateRandStr(length=32,pre='') {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return pre+result;
}

//判断2个数组是否相同
export function arrEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
	  return false;
  }
  return arr1.every((element, index) => element === arr2[index]);
}

//判断2个对象是否相同
export function objEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}