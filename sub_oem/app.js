
var { open } = require("./utils/database_connection");

const BROKER_HOST = process.env.BROKER_HOST;
const BROKER_PORT = process.env.BROKER_PORT;
const BROKER_USERNAME = process.env.BROKER_USERNAME;
const BROKER_PASSWORD = process.env.BROKER_PASSWORD;

const options={
    clientId: "subcriber_oem",
    username: BROKER_USERNAME,
    password: BROKER_PASSWORD,
    clean:true
};

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://' + BROKER_HOST + ':' + BROKER_PORT, options)
var BoxId = require('./model/box_id')
var BoxLog = require('./model/box_log')

open()

const topic = "mqtt/face/basic";

client.on('connect', () => {
    console.log('Device connect')
    client.subscribe(topic, () => {
        console.log(`Subcribe to ${topic}`);
    })
})

client.on('message', (topic, message) => {
    console.log(`${topic}, ${message}`)
    var params = topic.split("/");
    if (params.length >= 3 && params[0] === 'mqtt' && params[1] === 'face' && params[2] === 'basic') {
        try {
            console.time('save_message')

            var mess = message.toString()
            // remove non-printable and other non-valid JSON chars
            mess = mess.replace(/[\u0000-\u0019]+/g, "")
            var boxJSon = JSON.parse(mess.toString())

            if (!boxJSon.info.hasOwnProperty('facesluiceId'))
                return

            let criteria = {
                box_id: boxJSon.info.facesluiceId
            }

            BoxId.find(criteria).exec((err, boxIndexes) => {
                if (!err) {
                    if (!boxIndexes.length) {
                        const newBoxIndex = new BoxId({
                            box_id: boxJSon.info.facesluiceId,
                            box_type: "oem"
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

            let engines_pub = [];

            const newBox = new BoxLog({
                box_id: boxJSon.info.facesluiceId,
                // operator: boxJson.operator,
                // username: boxJson.info.username,
                // facesname: boxJSon.info.facesname,
                // time: boxJSon.info.time,
                ip_private: boxJSon.info.ip,
                mac_address: "",
                cpu_usage: "",
                memory: "",
                memory_usage: "",
                boot_storage: "",
                boot_storage_usage: "",
                storage: "",
                storage_usage: "",
                ip_public: "",
                temperature: "",
                engines_pub: engines_pub,
                engines_pub_status: ""
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
