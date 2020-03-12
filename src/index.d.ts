import { AxiosInstance } from 'axios';
import VueRouter from "vue-router";
export class httpClient {
  axios: AxiosInstance;
  callback: (message) => void;
  get: (url: string, params: object) => Promise<Object>;
  post: (url: string, data: object, config: object) => Promise<Object>;
  patch: (url: string, data: object) => Promise<Object>;
  del: (url: string, data: object) => Promise<Object>;
  download: (url: string, data: object, config: object) => Promise<Blob>;
}

export class Router extends VueRouter { }

export class msg {
  message: () => void;
  modal: () => void;
  drawer: () => void;
  success(config: NotificationOptions): void;
  warning(config: NotificationOptions): void;
  warn(config: NotificationOptions): void;
  info(config: NotificationOptions): void;
  error(config: NotificationOptions): void;
  open(config: NotificationOptions): void;
}

interface configType {
  storageType: 0 | 1;
  storageName: string;
  ticketName: string;
  SSOUrl: string;
  baseUrl: string;
  clientId: string;
  scope: string;
  redirectUri: string;
  profileUri: string;
  logoutPath: string;
  notAuthUrl: string;
  tokenType: string;
  accessToken: string;
  normalCode: string | number;
};
export class Auth {
  constructor(config: configType): void;
  SSO(): void;
  SSOLogin(): void;
  SSOGoLogin(): void;
  login(): void;
  logout(): void;
  getStorage(): Storage;
  getToken(): string | null;
  setToken(): void;
  removeToken(): void;
  getAuthorizationHeader(): string;
}