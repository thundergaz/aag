import { getQueryString } from '../utils';
export class Auth {
    defaultConfig = {
        storageType: 0, // localstorege sissonstoreage cookies
        storageName: 'oauthToken',
        ticketName: 'token',
        ticketUse: null,
        SSOUrl: '',
        SSOParams: {},
        baseUrl: '',
        clientId: '12345',
        expiresTime: 7,
        scope: 'openid profile default-api',
        redirectUriKey: 'service',
        redirectUri: window.location.origin + window.location.pathname,
        profileUri: 'userinfo',
        logoutPath: '/',
        notAuthUrl: 'login,manage/user/mobile/',
        tokenType: 'bearer',
        authHeadName: 'Authorization',
        accessToken: 'access_token',
        upperTokenType: true,
        normalCode: 200,
    };
    authConfig
    constructor(config) {
        this.authConfig = { ...this.defaultConfig, ...config };
        if (this.authConfig.storageType) {
            this.authConfig.expiresTime = 0
        }
    }
    install = (vue) => {
        vue.prototype.authService = this
    }

    isLogin() {
        return !!this.getToken();
    }

    SSO() {
        let ticket = getQueryString(this.authConfig.ticketName);
        !!ticket ? this.SSOLogin(ticket) : this.SSOGoLogin();
    }

    async SSOLogin(ticket) {
        await this.login(ticket);
        window.location.href = window.location.pathname
    }

    SSOGoLogin() {
        var redirectUri = encodeURIComponent(this.authConfig.redirectUri);
        const params = Object.keys(this.authConfig.SSOParams).map(x => `${x}=${this.authConfig.SSOParams[x]}`).join('&');
        window.location.href = `${this.authConfig.SSOUrl}?${this.authConfig.redirectUriKey}=${redirectUri}${params ? '&' + params : ''}`;
    }

    async login(tokenStr) {
        const token = {};
        if (!!this.authConfig.ticketUse) {
            await this.authConfig.ticketUse(tokenStr).then(res => token.access_token = res)
        } else {
            token.access_token = tokenStr
        }
        this.authConfig.tokenType && token.access_token ? token.token_type = this.authConfig.tokenType : null;
        if (this.authConfig.expiresTime) {
            const date = new Date();
            token.expires_at = date.setDate(date.getDate() + this.authConfig.expiresTime);
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
        } else if (this.authConfig.storageType === 1) {
            storage = sessionStorage;
        } else {
            const cookies = document.cookie.split(';').map(x => x.trim()).map(y => y.split('=')).map(z => ({ [z[0]]: z[1] }));
            let objectCookies = {};
            cookies.forEach(x => { objectCookies = { ...objectCookies, ...x } })
            storage = objectCookies[this.authConfig.storageName] ? { [this.authConfig.storageName]: JSON.stringify({ access_token: objectCookies[this.authConfig.storageName] }) } : {};
        }
        return storage;
    }

    getToken() {
        const dataString = this.getStorage()[this.authConfig.storageName];
        const data = dataString ? JSON.parse(dataString) : null;
        return data ? data.expires_at ? new Date(data.expires_at) >= new Date() ? data : null : data : null;
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
            const tokenType = token.token_type ? token.token_type : null;
            const accessToken = token.access_token;
            return tokenType ? `${this.authConfig.upperTokenType ? tokenType[0].toUpperCase() + tokenType.substr(1) : tokenType.toLocaleLowerCase()} ${accessToken}` : accessToken;
        }
        return '';
    }

}