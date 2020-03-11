
import { message, notification, Modal, Drawer } from 'ant-design-vue';
// 进度条简单配置
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'ant-design-vue/dist/antd.css';
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
class MessageService {
    title = {
        info: '提示',
        success: '提示',
        warning: '警告',
        error: '错误',
    }
    constructor() {
        this.hiddenLoading = () => NProgress.done()
        this.message = message;
        this.modal = Modal;
        this.drawer = Drawer;

        ['success', 'info', 'warning', 'error', 'warn', 'open'].forEach( (type) => {
            this[type] = (message) => {
                this.prev !== message ? this.timeOut ? clearTimeout(this.timeOut) : null : null;
                const exe = () => {
                    notification[type]({
                        message: this.title[type],
                        description: message,
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                    this.prev = message;
                }
                this.timeOut = setTimeout(exe, 300);
            }
        });
    }
    install = (vue) => {
        vue.prototype.msg = this
    }
}
export const msg = new MessageService() 