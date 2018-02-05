// Sometimes naive
/**
 * 手写字符串IndexOf算法
 * @param {String} strShort 需要匹配字符串
 * @param {String} strLong 匹配字符串
 * @returns {bool} 返回匹配成功true或者匹配失败false
 */
function myIndexOf(strShort, strLong) {
  const SSL = strShort.length, 
    SLL = strLong.length;
  for(var i = 0; i < SLL; i++) {
    //第一个字符匹配
    if(strShort[0] === strLong[i] && SSL > 1) {
      i++;
      for(var j = 1; j < SSL; j++) {
        if(strShort[j] === strLong[i] && j < SSL - 1) {
          i++;
        } else if(strShort[j] === strLong[i] && j === SSL - 1) {
          return true;
        } else {
          break;
        }
      }
    } else if (strShort[0] === strLong[i] && SSL === 1) {
      //匹配成功
      return true;
    } else if (SSL > SLL - i - 1) {
      return false;
    }
  }
  return false;
}
/**
 * ‘123456789’ -> ‘123，456,789’ 或者 ‘123456789.11’ -> ‘123,456,789.11’
 * @param {string} numStr 需要进行间隔的字符串
 * @returns {string} 返回处理后的字符串
 */
function strAddComma(numStr) {
  var commaArr = numStr.indexOf('.') === -1 ? [numStr] : numStr.split('.');
  var beforStr = commaArr[0];
  var beforStrSize = beforStr.length;
  //可以放逗号个数
  var commaSize = Math.floor(beforStr.length / 3);
  var returnStr = '';
  for(var i = 0; i < commaSize; i++) {
    returnStr = ',' + beforStr.slice(beforStrSize - 3 * (i + 1), beforStrSize - 3 * i) + returnStr;
  }
  returnStr = beforStr.slice(0, beforStrSize - 3 * i) + returnStr;
  return returnStr + (commaArr[1] ? '.' + commaArr[1] : '');
}
console.log(strAddComma('12345678910.1222'));
console.log(strAddComma('12345678910111'));