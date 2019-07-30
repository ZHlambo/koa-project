const mysql = require('mysql2');

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
    id int(10) not null primary key auto_increment comment '商品id',
    name varchar(100) not null comment '商品名称',
    status int(1) default 0 comment '商品状态：0下架；1上架',
    images text comment '商品图片：以;分割的图片数组',
    descs text comment '商品详情：可以为富文本',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品表';`;
  if (err) {
    create(sql);
  }
});

db.query(`SELECT id FROM attr LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE attr(
    id int(10) not null primary key auto_increment comment '规格id',
    productid int(10) not null comment '商品id',
    name varchar(100) not null comment '规格名称',
    value text comment '规格数组：以;分割的规格数组',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品规格表';`;
  if (err) {
    create(sql);
  }
});


db.query(`SELECT id FROM stock LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE stock(
    id int(10) not null primary key auto_increment comment '库存id',
    productid int(10) not null comment '商品id',
    standard text comment '规格数组：以;分割的规格key:value;数组',
    status int(1) default 1 comment '库存状态：0不可销售；1可销售',
    quantity int(10) default 0 comment '库存总数量',
    saled int(10) default 0 comment '库存已售数量',
    createdAt timestamp default current_timestamp comment '创建时间',
    updatedAt timestamp default current_timestamp comment '更新时间',
    deletedAt timestamp comment '删除时间'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='商品规格表';`;
  if (err) {
    create(sql);
  }
});


db.query(`SELECT id FROM user LIMIT 0,1`, (err,res) => {
  let sql = `CREATE TABLE user(
    id int(10) not null primary key auto_increment comment '用户id',
    mobile varchar(15) comment '用户手机号',
    open_id varchar(100) comment '用户小程序open_id',
    union_id varchar(100) comment '用户小程序union_id',
    password varchar(32) comment '账户密码',
    name varchar(100) not null comment '用户名称',
    icon varchar(100) not null comment '用户头像',
    roles varchar(10) default 'c' comment '用户角色：v、c',
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
