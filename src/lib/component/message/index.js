
import { message, notification, Modal, Drawer } from 'ant-design-vue';
// 进度条简单配置
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'ant-design-vue/dist/antd.css';
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
class MessageService {
    constructor() {
        this.hiddenLoading = () => NProgress.done()
        this.message = message;
        this.notification = notification;
        this.modal = Modal;
        this.drawer = Drawer;
    }
    install = (vue) => {
        vue.prototype.msg = this
    }
}
export const msg = new MessageService() 