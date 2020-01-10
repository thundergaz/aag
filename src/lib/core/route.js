import VueRouter from "vue-router";
export class Router extends VueRouter  {
    constructor(option) {
        super({...{
            mode: "history",
            base: process.env.BASE_URL
        }, ...option})
    }
}
