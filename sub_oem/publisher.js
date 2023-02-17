var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://{HOST}:21883')

client.on('connect', function () {
    console.log('Client connect')
    setInterval(() => {
        client.publish('v1/devices/me/telemetry', '{"box_id": "BI_0001","mac_address" : "1","cpu_usage" : "2","memory" : "3012","memory_usage": "20.03","boot_storage": "10.10","boot_storage_usage": "90","storage" : "123","storage_usage" : "123","ip_private" : "123","ip_public" : "123","temperature" : "123","engine_status" : "123","service_view_status" : ""}')
        console.log('Message Sent')
    }, 500)
})




