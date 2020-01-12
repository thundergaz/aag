const utils = require('loader-utils');
const path = require("path");
const fs = require("fs");
module.exports = function (source) {
  const options = utils.getOptions(this);
  const loaderContext = this
  const {
    rootContext,
    resourcePath,
  } = loaderContext

  const context = rootContext || process.cwd()
  const sourceRoot = path.dirname(path.relative(context, resourcePath))
  const routerDir = path.resolve(sourceRoot, options.viewPath)

  const defaultRoute = (name) => `{path: "",redirect: "${name}"}`
  const normalRoute = (fileName, fullPath) => `{path: "${fileName.replace('\.vue', '')}", component: () => import("${path.normalize('../views/' + path.relative(routerDir, fullPath)).replace(/\\/g, '/')}")}`

  function readFileList(dir, l) {
    let level = l ? l + 1 : 1;
    // 路由并列的集合
    const list = []
    // 有子的话，子路由的集合
    const sonList = []
    const slash = level === 1 ? '/' : ''
    const files = fs.readdirSync(dir);
    files.forEach(item => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        sonList.push(readFileList(path.join(dir, item), level))
      } else {
        // 如果存在index模块，添加一个重定向模块
        if (item === 'index.vue') {
          list.push(defaultRoute(`${slash}index`));
        }
        // 1级时index.vue是一个套嵌路由
        if (level !== 1) {
          // 添加一个标准路由
          list.push(normalRoute(`${slash}${item}`, fullPath))
        }
      }
    });
    const sonRoute = level !== 1 ? `{path:"${slash}${item}", children: [${sonList.join(',')}]}` :
    `{path:"${slash}${item}", component: () => import("${path.normalize('../views/' + path.relative(routerDir, fullPath)).replace(/\\/g, '/')}"), children: [${sonList.join(',')}]}`
    list.push(sonRoute)
    return list.join(',')
  }
  const result = readFileList(routerDir)

  console.log(result)

  source = source.replace('\/\*injectRoutes\*\/', `routes: [${result}]`);
  // 对资源应用一些转换……

  return source;
};