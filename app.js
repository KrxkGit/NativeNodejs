import {handleRoute} from "./src/routes/router.js";

export function myHandler(req, res) {
    handleRoute(req, res) /* 路由派发 */
}

