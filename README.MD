## 58Spider

 58同城租房信息爬虫，使用node.js，获取武汉地区的租房信息，存储在MongoDB数据库，并使用百度地图进行数据可视化。

## 主要难点

- cheerio：解析页面的dom信息
- [百度地图](http://lbsyun.baidu.com/index.php?title=jspopular)：前端页面数据可视化
- 反爬虫策略：遇到302设置cookie，间隔一段时间内随机访问，访问八次后休息一段时间（随机时间）再重复。其他策略请自行Google

## How to run

```bash
cd 58Spider

# install dependencies
npm install

# app running
npm start
```

## 截图演示

[![T36-A-MM-CBDAFFHAL-K0-FU.png](https://i.postimg.cc/Z5zF3Xjz/T36-A-MM-CBDAFFHAL-K0-FU.png)](https://postimg.cc/gn4ZbSfg)