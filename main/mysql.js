const mysql = require('mysql2');

// NOTE: goods --> product --> sku

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'lambo'
});

// Connect
db.connect((err) => {
    if(err) {
        throw(err);
    }
    console.log('MySql Connected...')
});

const create = (sql) => {
  db.query(`${sql}`, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`success: ${sql}`);
    }
  })
}

db.query(`SELECT id FROM product LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE product(
    id int(12) not null primary key auto_increment comment '产品id',
    product_id varchar(15) not null comment '产品product_id',
    name varchar(100) not null comment '产品名称',
    status int(1) default 0 comment '产品状态：0下架；1上架',
    images text comment '产品图片：以;分割的图片数组',
    descs text comment '产品详情：可以为富文本',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='产品表';`;
  if (err) {
    create(sql);
  }
});

// db.query(`SELECT id FROM attr LIMIT 0,1`, (err,res) => {
//   let sql = `CREATE TABLE attr(
//     id int(12) not null primary key auto_increment comment '规格id',
//     product_id int(15) not null comment '产品product_id',
//     name varchar(100) not null comment '规格名称',
//     value text comment '规格数组：以;分割的规格数组',
//     createdAt timestamp default current_timestamp comment '创建时间',
//     updatedAt timestamp default current_timestamp comment '更新时间',
//     deletedAt timestamp comment '删除时间'
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='产品规格表';`;
//   if (err) {
//     create(sql);
//   }
// });

db.query(`SELECT id FROM sku LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE sku(
    id int(12) not null primary key auto_increment comment '库存id',
    product_id varchar(15) not null comment '产品id',
    standard text comment '规格数组：以;分割的规格key:value;数组',
    status int(1) default 1 comment '库存状态：0不可销售；1可销售',
    quantity int(10) default 0 comment '库存总数量',
    saled int(10) default 0 comment '库存已售数量',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='产品规格表';`;
  if (err) {
    create(sql);
  }
});

db.query(`SELECT id FROM user LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE user(
    id int(12) not null primary key auto_increment comment '用户id',
    uuid varchar(32) not null comment '用户uuid',
    mobile varchar(15) comment '用户手机号',
    open_id varchar(32) comment '用户小程序open_id',
    union_id varchar(32) comment '用户小程序union_id',
    password varchar(32) comment '账户密码',
    name varchar(100) not null comment '用户名称',
    icon varchar(100) not null comment '用户头像',
    roles varchar(10) default 'c' comment '用户角色：c,s',
    shop_name varchar(20) comment '店铺名称',
    shop_icon varchar(100) comment '店铺头像',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户表（用户注册必须有手机号码或者小程序open_id）';`;
  if (err) {
    create(sql);
  }
});

db.query(`SELECT id FROM goods LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE goods(
    id int(12) not null primary key auto_increment comment '商品id',
    product_id varchar(15) not null comment '产品product_id',
    goods_id varchar(15) not null comment '商品goods_id',
    s_uuid varchar(32) not null comment 'spreader用户uuid',
    status int(1) default 1 comment '商品状态：0终止；1上架；2下架',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='产品表';`;
  if (err) {
    create(sql);
  }
});

db.query(`SELECT id FROM orders LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE orders(
    id int(12) not null primary key auto_increment comment '订单id',
    order_no varchar(32) not null comment '订单编号',
    s_uuid varchar(32) not null comment 'spreader用户uuid',
    skus json not null comment '下单sku数据{sku.id,sku.standard,quantity,product_id,product_name,product_images}',
    order_history json comment '订单操作历史',
    status int(2) comment '订单状态：10待付款;11取消订单;20待发货;21申请退款;30待收货;31未收货退货;32收货退货;40已收货;50订单完成;51已退款;52已退货',
    receive_mobile varchar(11) not null comment '收货手机号码',
    receive_address varchar(30) not null comment '收货地址 "省市区 详细地址"',
    carrier_no varchar(30) comment '发货物流单号',
    carrier_compony varchar(10) comment '发货物流公司名',
    carrier_compony_no varchar(10) comment '发货物流公司key',
    note varchar(100) comment '订单备注',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='订单表';`;
  if (err) {
    create(sql);
  }
});

module.exports = function (sql) {
  return new Promise((resolve, reject) => {
    // NOTE: fields 没用到
    db.query(sql, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  });
};
