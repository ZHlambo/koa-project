import mysql from "../../mysql";
import {getIdNo, check} from "../../utils";
import orderRouter from "./order";
import productRouter from "./product";

module.exports = (koaRouter) => {
  orderRouter(koaRouter);
  productRouter(koaRouter);
};
