import {userController} from "../controller/userController.js";
import {shopController} from "../controller/shopController.js";

export const routerConfig = {
    '/user': userController,
    '/shop': shopController
}