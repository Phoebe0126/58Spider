let request = require('request');
let cheerio = require('cheerio');
const { time } = require('console');
let totalPage = require('../config/config').page;

// todo 记得在app.js中初始化
let cookie = ''
// 存入url的数组
let urlPipe = []
// 存储房屋的信息
let rentalInfosMap = new Map()
// 访问次数
let times = 0


/**
 * 用途： 获取第page页的url
 * @param {*} page 页码
 * @return {string} url
 */
function getUrl (page = 1){
	return  'https://hz.58.com/chuzu/pn' + page +'/?key=%E6%9D%AD%E5%B7%9E%E7%A7%9F%E6%88%BF%E5%AD%90&cmcskey=%E7%A7%9F%E6%88%BF%E5%AD%90&final=1&PGTID=0d3090a7-0004-f43c-ee04-95c2ea3d031f&ClickID=6';
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
    if (!url.includes('hz.58.com')) {
        return
    }
    urlPipe.push(url)
}

/**
 * 用途：反爬虫策略解析url
 * @param {*} times 访问次数
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
            if (descDom.length > 0) {
                const desc = descDom.reduce((pre, cur) => pre +'<br />' + (cur.data || ''), '')
            }
            // 获取相关信息
            $('a.c_333') && $('a.c_333')['0']
            && rentalInfosMap.set(url, {
                // tel: $('span.tel-num.tel-font').text(),
                // price: $('.house-price').text(),
                desc,
                location: $('a.c_333')[0].children[0].data,
                img: $('#smainPic')['0'].attribs.src,
            })
            console.log(`get ${Array.from(rentalInfosMap).length} rental infos`)
        } catch (e) {
            console.log('get rental info error when ananlyze url', e)
        }
    })
}

/**
 * 用途：获取js对象形式的租房信息
 */
function getFinalRentalInfo () {
    let res = {}

    for (let [key, value] of rentalInfosMap) {
        res[key] = value
    }

    return res
}

module.exports = {
    init () {
        getRentalInfo()
    },
    getRentalInfos (req, res, next) {
        res.json({
            result: true,
            params: getFinalRentalInfo()
        })
    }
}