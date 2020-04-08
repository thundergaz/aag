const axios = require('axios')
export class httpClient {
    constructor(auth, callback) {
        this.axios = axios;
        this.axios.defaults.timeout = 10000
        this.axios.defaults.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
        this.axios.defaults.baseURL = auth.authConfig.baseUrl;
        // request 拦截
        this.axios.interceptors.request.use(
            config => {
                auth.isLogin() ? config.headers.Authorization = auth.getAuthorizationHeader() : null;
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
                if (response.status > 200 ) {
                    callback(translate[response.status], 'error');
                } else {
                    if (response.data.size) {
                        return response.data
                    }
                    if (response.data) {
                        if (response.data.code === auth.authConfig.normalCode || response.config.responseType === 'blob') {
                            return response.data.data
                        } else {
                            callback(response.data.msg, 'error', response.data);
                        }
                    } else {
                        callback('数据错误！', 'error');
                    }
                }
                return Promise.reject()
            },
            error => {
                return Promise.reject(error)
            },
        )
    }

    // 封装get方法
    get = async (url, params = {}) => await this.axios.get(url, { params: params })

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