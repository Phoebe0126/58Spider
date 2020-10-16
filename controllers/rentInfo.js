let request = require('request');
let cheerio = require('cheerio');
let totalPage = require('../config/config').page;
let RentModel = require('../models/rent')

// todo 记得在app.js中初始化
let cookie = ''
// 存入url的数组
let urlPipe = []
// 访问次数
let times = 0


/**
 * 用途： 获取第page页的url
 * @param {*} page 页码
 * @return {string} url
 */
function getUrl (page = 1){
    return 'https://wh.58.com/chuzu/pn' + page +'/?PGTID=0d3090a7-0009-e83a-9946-fd47f2681520&ClickID=2'
}

/**
 * 用途：获取所有房子的url
 */
function getRentalInfo () {
    for (let page = 1; page <= totalPage; page++) {
        const url = getUrl(page)
        request.get(url, (err, res) => {
            // 设置cookie
            cookie = res.headers['set-cookie']
            const options = {
                url,
                headers: {
                    cookie
                }
            }
            request(options, (err, res, body) => {

                const $ = cheerio.load(body)
                const urlDomArr = $('div.des > h2 > a');
                
                for (let i = 0; i < urlDomArr.length; i++) {
                    storeUrl(urlDomArr[i].attribs.href)
                }
                // 读取所有url
                accessUrlInfo()
            })
        })
    }
}

/**
 * 用途：存储爬到的url
 * @param {*} url 
 */
function storeUrl (url) {
    // 筛选符合要求的url
    if (!url.includes('wh.58.com')) {
        return
    }
    urlPipe.push(url)
}

/**
 * 用途：反爬虫策略解析url
 * 
 */
function accessUrlInfo () {
    // url数组为空
    if (urlPipe.length <= 0) {
        return
    }
    times++
    // 反爬虫
    // 访问随机时间控制在1-10s内，每访问8次后休息
    if (times > 8) {
        setTimeout(accessUrlInfo, 10000 * (1 + Math.random()))
        if (times === 40) {
            times = 0
        }
    } else {
        analysis(urlPipe.shift())
        setTimeout(accessUrlInfo, 10000 * Math.random())
    }

}

/**
 * 用途：解析得到的url，获取房屋信息
 */
function analysis (url) {
    const options = {
        url,
        headers: {
           cookie
        }
    }

    request(options, (err, res, body) => {
        const $ = cheerio.load(body)

        try {
            const descDom = $('div.house-word-introduce > .introduce-item li > span.a2')[1].children
            let desc = ''
            if (descDom.length > 0) {
                desc = descDom.reduce((pre, cur) => pre + (cur.data ? (cur.data + '<br/>') : ''), '')
            }
            // 获取相关信息
            if ($('a.c_333') && $('a.c_333')['0']) {
                const data = {
                    url,
                    desc,
                    location: $('a.c_333')[0].children[0].data,
                    img: $('#smainPic')['0'].attribs.src,
                }

                // 存在数据库中
                RentModel.create(data).then(result => {
                    console.log(result)
                })
                .catch(err => {
                    console.log(err)
                }) 
            }

        } catch (e) {
            console.log('get rental info error when ananlyze url', e)
        }
    })
}


module.exports = {
    init () {
        getRentalInfo()
    }
}