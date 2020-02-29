const axios = require('axios')
export class httpClient {
    callback
    constructor() {
        this.axios = axios;
        this.axios.defaults.timeout = 10000
        this.axios.defaults.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        }
        // request 拦截
        this.axios.interceptors.request.use(
            config => {
                let token = sessionStorage.token
                if (token) {
                    config.headers.Authorization = token
                }
                return config
            },
            err => {
                return Promise.reject(err)
            }
        )
        this.axios.interceptors.response.use(
            response => {
                if (response.data.success || response.config.responseType === 'blob') {
                    return response.data
                } else {
                    this.callback('请求API出错！');
                    throw new Error('请求API出错！');
                }
            },
            error => {
                return Promise.reject(error)
            },
        )
    }

    // 封装get方法
    get = async (url, params = {}) => responseBase(await this.axios.get(url, { params: params }))

    // 封装post方法
    post = async (url, data = {}, config = {}) => responseBase(await this.axios.post(url, data, config))

    // 封装patch方法
    put = async (url, data = {}, config = {}) => responseBase(await this.axios.put(url, data, config))

    // 封装patch方法
    patch = async (url, data = {}, config = {}) => responseBase(await this.axios.patch(url, data, config))

    // 封装delete方法
    del = async (url, data = {}) => await this.axios.delete(url, data)

    // 封装download
    download = async (url, data = {}, config = {}) => await this.axios.post(url, data, config)

}

const responseBase = (res) => {
    if (res.code !== '200') {
        this.callback('返回出错！');
        throw new Error('返回出错！');
    } else {
        return res.data;
    }
}

