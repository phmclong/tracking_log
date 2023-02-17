'use strict'

var CronJob = require('cron').CronJob
var BoxIds = require('../model/box_id')
var BoxLogs = require('../model/box_log')
const dbConfig = require('../config/db');
var mongoose = require('mongoose');

console.log('(+) Before job instantiation');

mongoose.Promise = global.Promise
mongoose.connect(dbConfig.uri, dbConfig.options).then(
  () => {
    console.log('Connect mongodb success')
  },
  err => {
    console.log(`Failed connect to mongodb ${err}`)
  }
)

const job = new CronJob('* * * * * *', () => {
    var date = new Date()
    
    console.log('test cronjob delete data')
    let criteria = {
        time: { $gte: new Date(time(date.setMonth(date.getMonth() - 2))), $lte: new Date()}
        // time: {$gte: new Date("2019-05-10T03:59:10.682Z"), $lte: new Date("2019-05-10T07:27:03.213Z")}
    };
    BoxLogs.find(criteria).exec((err, boxes) => {
        if (err) {
            console.log("error find")
        } else {
            console.log(boxes.length)
        } 
    })
    BoxLogs.deleteMany(criteria).exec((err) => {
        if (err) {
            console.log('Error code : 1001')
            console.log(`Error is : ${err}`)
        } else {
            console.log('Error code : 1000')
            console.log(`Delete success`)
        }
    })
    console.log("[Condition delete] start_date", new Date(time(date)),", end_date", new Date() )

})


const all_box_id = new Set();
BoxIds.find().exec(async (err, box_ids) => {
    if (err) {
        console.log("error when find BoxID")
    } else {
        // console.log("(+) BoxID info", box_ids)
        await box_ids.forEach(item => {
            all_box_id.add(item.box_id)
        })
    }
})
const job2 = new CronJob('0 */1 * * * *', async () => {
    var date = new Date()
        
    console.log('(+) test cronjob sending warning to telegram')
        
    let criteria = {
            time: { $gte: new Date(date.getTime() - 1000*60*3).toISOString() }
    //     // time: { $gte: new Date(time(date.setMonth(date.getMonth() - 2))), $lte: new Date()}
    //     // time: {$gte: new Date("2019-05-10T03:59:10.682Z"), $lte: new Date("2019-05-10T07:27:03.213Z")}
    };
    const newest_box_id = new Set()
    BoxLogs.find(criteria).exec(async (err, boxes) => {
        if (err) {
            console.log("error find")
        } else {
            await boxes.forEach(item => {
                newest_box_id.add(item.box_id)
            })
            console.log("(+) Box info", boxes)
        } 
    })

    await newest_box_id.forEach(item => {
        if(all_box_id.has(item)) {
            console.log(item)
        }
    })

    console.log("[Condition bot] start_date", new Date(time(date)),", end_date", new Date() )
})

function time(s) {
    return new Date(s).toISOString();
}

console.log('(+) After job instantiation')
// job.start()
job2.start()


