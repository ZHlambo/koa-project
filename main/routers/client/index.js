import mysql from "../../mysql";
import {getIdNo, check} from "../../utils";
import userRouter from "./user";
import orderRouter from "./order";
import productRouter from "./product";

module.exports = (koaRouter) => {
  userRouter(koaRouter);
  orderRouter(koaRouter);
  productRouter(koaRouter);
};
