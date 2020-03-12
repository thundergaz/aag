import { getQueryString } from '../utils';
export class Auth {
    defaultConfig = {
        storageType: 0,
        storageName: 'oauthToken',
        ticketName: 'token',
        SSOUrl: '',
        baseUrl: '',
        clientId: '12345',
        scope: 'openid profile default-api',
        redirectUri: window.location.origin + window.location.pathname,
        profileUri: 'userinfo',
        logoutPath: '/',
        notAuthUrl: 'login,manage/user/mobile/',
        tokenType: 'bearer',
        accessToken: 'access_token',
        upperTokenType: true,
        normalCode: 200,
    };
    authConfig
    constructor(config) {
        this.authConfig = { ...this.defaultConfig, ...config};
    }
    install = (vue) => {
        vue.prototype.authService = this
    }

    SSO() {
        let ticket = getQueryString(this.authConfig.ticketName);
        !!ticket ? this.SSOLogin(ticket) : this.SSOGoLogin();
    };

    SSOLogin(ticket){
        this.login(ticket);
        window.location.href = window.location.pathname
    }
      
    SSOGoLogin() {
        var redirectUri = encodeURIComponent(this.authConfig.redirectUri);
        window.location.href = this.authConfig.SSOUrl+"/login?service="+redirectUri;
    }

    login(tokenStr, remember = true) {
        const token = {};
        token.token_type = this.authConfig.tokenType;
        token.access_token = tokenStr;
        if (!remember) {
            this.authConfig.storageType = 1;
        } else {
            const date = new Date();
            this.authConfig.storageType = 0;
            token.expires_at = date.setDate(date.getDate() + 7);
        }
        this.setToken(token);
    }

    logout() {
        sessionStorage.clear();
        this.removeToken();
        window.top.location.href = `${this.authConfig.logoutPath}`;
    }


    getStorage() {
        let storage;
        if (this.authConfig.storageType === 0) {
            storage = localStorage;
        } else {
            storage = sessionStorage;
        }
        return storage;
    }

    getToken() {
        const dataString = this.getStorage()[this.authConfig.storageName];
        if (dataString) {
            const data = JSON.parse(dataString);
            if (data && data.expires_at && new Date(data.expires_at) >= new Date()) {
                return data;
            }
        }
        return null;
    }

    setToken(data) {
        this.getStorage()[this.authConfig.storageName] = JSON.stringify(data);
    }

    removeToken() {
        delete this.getStorage()[this.authConfig.storageName];
    }

    getAuthorizationHeader() {
        const token = this.getToken();
        if (token) {
            const tokenType = token.token_type;
            const accessToken = token.access_token;
            return `${this.authConfig.upperTokenType ? tokenType[0].toUpperCase() + tokenType.substr(1) : tokenType.toLocaleLowerCase()} ${accessToken}`;
        }
        return '';
    }
   
}