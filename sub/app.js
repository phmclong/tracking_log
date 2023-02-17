
var { open } = require("./utils/database_connection");

const BROKER_HOST = process.env.BROKER_HOST;
const BROKER_PORT = process.env.BROKER_PORT;

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://' + BROKER_HOST+ ':' + BROKER_PORT)
var BoxLog = require('./model/box_log')
var BoxId = require('./model/box_id')

open()

client.on('connect', () => {
    console.log('Device connect')
    client.subscribe('v1/devices/+/telemetry')
    //subcribte('mqtt/face/basic)
})

client.on('message', (topic, message) => {
    console.log(`${topic}, ${message}`)
    var params = topic.split("/");
    if (params.length >= 4 && params[0] === 'v1' && params[1] === 'devices' && params[3] === 'telemetry') {
        try {
            console.time('save_message')
            //console.log(`${message}`)
            var mess = message.toString()
            // remove non-printable and other non-valid JSON chars
            mess = mess.replace(/[\u0000-\u0019]+/g,"")
            var boxJSon = JSON.parse(mess.toString())

            if(!boxJSon.hasOwnProperty('box_id'))
                return

            // console.log(` box_id : ${boxJSon.box_id}`)

            let criteria = {
                box_id: boxJSon.box_id 
            }
            BoxId.find(criteria).exec((err, boxindexes) => {
                if (!err) {
                    if (!boxindexes.length) {
                        const newBoxIndex = new BoxId({
                            box_id: boxJSon.box_id
                        })
                        newBoxIndex.save((err, addBoxIndex) => {
                            if (!err) {
                                // console.log(`Insert new box_index : ${addBoxIndex}`)
                            } else {
                                console.log(`Insert Box index Error : ${err}`)
                            }
                        })
                    }
                } else {
                    console.log(`Box find error: ${err}`)
                }
            })
            
            let engines_pub = []
            let engines_pub_status = 1
            if(boxJSon.hasOwnProperty('engine_status')) {
                engines_pub.push({'status':boxJSon.engine_status})
            } else {
		        // console.log(boxJSon.engines_pub);
                engines_pub = boxJSon.engines_pub
                engines_pub.forEach(item => {
                    if (item.status == 0) {
                        engines_pub_status = 0
                    }
                })
            }
            // console.log(engines_pub)
            const newBox = new BoxLog({
                box_id: boxJSon.box_id,
                mac_address: boxJSon.mac_address,
                cpu_usage: boxJSon.cpu_usage,
                memory: boxJSon.memory,
                memory_usage: boxJSon.memory_usage,
                boot_storage: boxJSon.boot_storage,
                boot_storage_usage: boxJSon.boot_storage_usage,
                storage: boxJSon.storage,
                storage_usage: boxJSon.storage_usage,
                ip_private: boxJSon.ip_private,
                ip_public: boxJSon.ip_public,
                temperature: boxJSon.temperature,
                engines_pub: engines_pub,
                engines_pub_status: engines_pub_status
            })
            newBox.save((err) => {
                if (err) {
                    console.log(`Error is ${err}`)
                } else {
                    // console.log(`Insert new box successfully`)
                }
            })
            console.timeEnd('save_message')
        } catch (e) {
            console.log(e);
        } 
    }
})
