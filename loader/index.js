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
  const normalRoute = (fileName, fullPath) => `{path: "${fileName.replace('\.vue', '')}",component: () => import("${path.normalize('../views/' + path.relative(routerDir, fullPath)).replace(/\\/g, '/')}")}`

  function readFileList(dir) {
    // 路由并列的集合
    const list = []
    const files = fs.readdirSync(dir);
    files.forEach(item => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (fs.readdirSync(fullPath).length > 0) {
          const sonRoute = `{path:"${item}",component: {render: h => h("router-view")}, children: [${readFileList(path.join(dir, item))}]}`
          list.push(sonRoute)
        }
      } else {
        // 添加一个标准路由
        list.push(normalRoute(`${item}`, fullPath))
      }
      // 如果存在index模块，添加一个重定向模块
      if (item === 'index.vue') {
        list.push(defaultRoute(`index`));
      }
    });
    return list.join(',')
  }
  const result = readFileList(routerDir)

  source = source.replace('\/\*injectRoutes\*\/', result)

  return source;
};