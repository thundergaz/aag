const utils = require('loader-utils');
const path = require("path");
const fs = require("fs");
module.exports = function (source) {
  const options = utils.getOptions(this);
  const base = `{path: "",redirect: "/home"},{path: "/home",component: () => import("../views/Layout.vue"),children: [`;
  const loaderContext = this
  const {
    rootContext,
    resourcePath,
  } = loaderContext

  const context = rootContext || process.cwd()
  const sourceRoot = path.dirname(path.relative(context, resourcePath))
  const routerDir = path.resolve(sourceRoot, options.viewPath)

  const defaultRoute = () => `{path: "",redirect: "index"}`
  const normalRoute = (fileName, fullPath) => `{path: "${fileName.replace('\.vue','')}", component: () => import("${path.normalize('../views/' + path.relative(routerDir, fullPath)).replace(/\\/g,'/')}")}`

  function readFileList(dir) {
    const list = []
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const sonRoute = `{path:"${item}", children: [${readFileList(item, path.join(dir, item))}]}`
        list.push(sonRoute)
      } else {
        // 如果存在index模块，添加一个重定向模块
        if (item === 'index.vue') {
          list.push(defaultRoute());
        }
        // 添加一个标准路由
        list.push(normalRoute(item, fullPath))
      }
    });
    return list.join(',')
  }
  const result = readFileList(routerDir)

  source = source.replace('\/\*injectRoutes\*\/', `routes: [${result}]`);
  // 对资源应用一些转换……

  return source;
};