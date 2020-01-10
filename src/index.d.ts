import { AxiosInstance } from 'axios';
import VueRouter from "vue-router";
export class httpClient {
  axios: AxiosInstance;
  callback: (message) => void;
  get: (url: string, params: object) => Promise<Object>,
  post: (url: string, data: object, config: object) => Promise<Object>,
  patch: (url: string, data: object) => Promise<Object>,
  del: (url: string, data: object) => Promise<Object>,
  download: (url: string, data: object, config: object) => Promise<Blob>,
}

export class Router extends VueRouter {}

