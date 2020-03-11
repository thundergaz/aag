/**
 * 格式化日期
 * @param  {[type]} time    [description]
 * @param  {[type]} cFormat [description]
 * @return {[type]}         [description]
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 时间戳转换
 * @param {*} s
 */
export function timestampToTime (cjsj, val) {
  var date = new Date(cjsj) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())
  var h = ' ' +(date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds())
  if(val == 1){
    return Y+M+D
  }else{
    return Y+M+D+h+m+s
  }

}

/**
 * 秒转文字
 * @param s 秒
 * @return {[str]}
 */
export function timeToStr(s) {
  var oneM = 60;
  var oneH = 60 * oneM;
  var str = '';
  var temp;
  var h, m;

  h = Math.floor(s / oneH);
  temp = s % oneH;
  m = Math.floor(temp / oneM);

  if (h > 0) str += h + '小时';
  str += m + '分钟';

  if (str === '0分钟') str = '不足1分钟'

  return str;
}

/**
 * 是否数字
 */
export function isNum (num) {
  let reg = /^\d+$/
  return reg.test(num)
}

/**
 * 是否范围内整数
 */
export function isRangeInt (num, min, max) {
  return Number.isInteger(num) && num >= min && num <= max
}

// 是否手机号
export function isPhone (s) {
  let p = /(^1[0-9]{10}$)/
  return p.test(s)
}

// 密码效验规则
export function isBCIAPassword (s) {
	let p = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S*]{8,16}$/
  return p.test(s)
}

// 字面对象
export function isObject (val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false
}

export function isChinese(s) {
  let p = /^[\u4e00-\u9fa5]+$/
  return p.test(s)
}
/**
 * 转义字符串对象
 */
export function parseData(obj) {
	return JSON.parse(obj)
}

export function stringifyData(obj) {
	return JSON.stringify(obj)
}

// 获取Url参数
export function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
}

export function camelize(str) {
    return str.replace(/_(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// 邮箱校验
export function isEm(value) {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  return reg.test(value)
}

// 手机号校验
export function isPh(value) {
  const reg = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/
  return reg.test(value)
}
