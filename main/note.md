删除重复数据，且保留最小id的数据
// delete from sku where standard in (select s.standard from  (select standard from sku group by standard having count(1)>1) s) and id not in (select c.id from  (select min(id) as id from sku group by standard having count(1)>1) c);
