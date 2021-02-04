const axios = require('axios')
export class httpClient {
    constructor(auth, callback) {
        this.axios = axios;
        this.axios.defaults.timeout = auth.authConfig.httpTimeout;
        this.axios.defaults.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
        this.axios.defaults.baseURL = auth.authConfig.baseUrl;
        // request 拦截
        this.axios.interceptors.request.use(
            config => {
                if (!auth.authConfig.notAuthUrl.split(',').some( x => x === config.url)) {
                    auth.isLogin() ? config.headers[auth.authConfig.authHeadName] = auth.getAuthorizationHeader() : null;
                }
                return config
            },
            err => {
                return Promise.reject(err)
            }
        )
        const translate = {
            400: '请求错误',
            401: '授权认证失败',
            403: '禁止访问',
            404: '资源未找到',
            405: '不支持该操作',
            422: '请求数据有误',
            500: '内部服务器错误',
            503: '网络故障'
        };
        this.axios.interceptors.response.use(
            response => {
                if (response.data) {
                    // 附合规定样式，才去处理结果。
                    if (response.data.code) {
                        if ( auth.authConfig.normalCode.indexOf(Number(response.data.code)) > -1) {
                            return response.data.data
                        } else {
                            callback(response.data.msg, 'error', response.data);
                            return Promise.reject(`状态码为${response.data.code}, 为巩异常时状态码`)
                        }
                    }
                    // 不附合规定样式的一律原样返回
                    return response.data
                } else {
                    callback('数据为空！', 'error');
                    return Promise.reject('数据为空！')
                }
            },
            error => {
                callback(translate[error.response.status], 'error', error.response.data);
                return Promise.reject(error)
            },
        )
    }

    // 封装get方法
    get = async (url, config = {}) => await this.axios.get(url, config)

    // 封装post方法
    post = async (url, data = {}, config = {}) => await this.axios.post(url, data, config)

    // 封装patch方法
    put = async (url, data = {}, config = {}) => await this.axios.put(url, data, config)

    // 封装patch方法
    patch = async (url, data = {}, config = {}) => await this.axios.patch(url, data, config)

    // 封装delete方法
    del = async (url, data = {}) => await this.axios.delete(url, data)

    // 封装download
    download = async (url, data = {}, config = {}) => await this.axios.post(url, data, { responseType: 'blob', ...config })

}