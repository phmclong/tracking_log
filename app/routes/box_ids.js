'use strict'
var router = global.router
var BoxId = require('../model/box_id')

router.post('/insert_box_id', (req, res, next) => {
    let criteria = {
        box_id: new RegExp('^' + req.body.box_id.trim() + '$', 'i') 
    }
    BoxId.find(criteria).limit(1).exec((err, box_indexes) => {
        if (err) {
            res.json({
                error_code: '1001',
                data: [],
                message: `Error is ${err}`
            })
        } else {
            if (box_indexes.length) {
                res.json({
                    error_code: '1001',
                    data: [],
                    message: 'BoxId is exist'
                })
            } else {
                const newBoxIndex = new BoxId({
                    box_id: req.body.box_id
                    }
                )
                newBoxIndex.save((err, addBoxIndex) => {
                    if (err) {
                        res.json({
                            error_code: '1001',
                            data: [],
                            message: `Error is ${err}`
                        })
                    } else {
                        res.json({
                            error_code: '1000',
                            data: addBoxIndex,
                            message: `Successfully`
                        })
                    } 
                })
            }
        }
    })
})

router.get('/hi_box_index', (req, res, next) =>{
    res.json({hi: "hi_box_index"})
})

module.exports = router;

