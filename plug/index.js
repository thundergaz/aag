const pluginName = 'WatchRouterPlugin';

class WatchRouterPlugin {
    constructor() { }
    apply(compiler) {
        compiler.hooks.watchRun.tapAsync("normal-module-factory", (compilation, callback) => {
            callback()
            // compilation.hooks.watchRun.tapAsync("before-resolve", function (result, callback) {
            //     console.log(result)
            //     if (!result) return callback();
            //     // if(resourceRegExp.test(result.request)) {
            //     //     if(typeof newResource === "function") {
            //     //         newResource(result);
            //     //     } else {
            //     //         result.request = newResource;
            //     //     }
            //     // }
            //     // if (result.request.indexOf('core.module') > -1) {
            //     //     // console.log(result);
            //     // }
            //     return callback(null, result);
            // });
            //     compilation.hooks.afterResolve.tapAsync("after-resolve", function(result, callback) {
            //         if(!result) return callback();
            //         if (result.resource.indexOf('core.module') > -1) {
            //             // console.log(result);
            //         }
            //         // if(resourceRegExp.test(result.resource)) {
            //         //     if(typeof newResource === "function") {
            //         //         newResource(result);
            //         //     } else {
            //         //         result.resource = path.resolve(path.dirname(result.resource), newResource);
            //         //     }
            //         // }
            //         return callback(null, result);
            //     });
        });

        compiler.hooks.watchRun.tapAsync('watchRun', (compile, callback) => {
            console.log('以异步方式触及 watchRun 钩子。')
            console.log(Object.keys(compile.hooks.shouldEmit))
            // compile.hooks.compilation.tap('compilation', (compilation, params) => {
            //     console.log(Object.keys(compilation))
            // });
            callback()
        });
        compiler.hooks.run.tapAsync(pluginName, (compiler, callback) => {
            console.log('以异步方式触及 run 钩子。')
            callback()
        });
    }
}

module.exports = WatchRouterPlugin;