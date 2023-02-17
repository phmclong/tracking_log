'use strict';
var router = global.router;
var BoxLog = require('../model/box_log');
var BoxId = require('../model/box_id');


//insert box
router.post('/insert_new_box', (req, res, next) => {
	
	const newBox = new BoxLog({
		box_id: req.body.box_id,
		mac_address: req.body.mac_address,
		cpu_usage: req.body.cpu_usage,
		memory: req.body.memory,
		memory_usage: req.body.memory_usage,
		boot_storage: req.body.boot_storage,
		boot_storage_usage: req.body.boot_storage_usage,
		storage: req.body.storage,
		storage_usage: req.body.storage_usage,
		ip_private: req.body.ip_private,
		ip_public: req.body.ip_public,
		temperature: req.body.temperature,
		engine_status: req.body.engine_status,
		service_view_status: req.body.service_view_status
	})
	newBox.save((err) => {
		if (err) {
			res.json({
				status: '1001',
				data: {},
				message: `Error is ${err}`
			});
		} else {
			res.json({
				status: '1000',
				data: newBox,
				message: 'Insert new box successfully'
			});
		}
	})
	
});

// /v1/devices
router.get('/v1/devices', (req, res, next) => {
	let dataRes = [];
	BoxId.find({}).exec((err, boxindexes) => {
		if (err) {
			console.log(err)
			res.json({
				error_code: 10002,
				data: [],
				message: `Error is ${err}`
			});
		} else {
            boxindexes.forEach((boxindex) => {
                BoxLog.findOne({ box_id: boxindex.box_id }).sort({time: -1}).exec((err, box) => {
					if (err) {
						res.json({
                            error_code: 10002,
                            data: [],
                            message: `Error is ${err}`
						});
						return
					} else {
						if (box != null) {
							var status = 0
							var engine_pub_status = 1
							let ms = Date.parse(box.time)
							if (Date.now() - ms <= 60000) {
								status = 1;
							}
							box.status = status;
							dataRes.push(box);
						}
					}

					if (dataRes.length === boxindexes.length) {
						res.json({
							error_code: 10000,
							data: dataRes
						})
						}
					})
			})
        }
	})
});

// /v1/device?box_id=001&start_date=2019-01-01T00:00
router.get('/v1/device', async (req, res, next) => {
	// console.log(`box_id ${req.query.box_id} --- start date ${req.query.start_date}`);
	if (!req.query.box_id) {
		res.json({
			error_code: 10002,
			data: [],
			message: 'Box_id invalidate'
		});
	} else if (!req.query.start_date) {
		res.json({
			error_code: 10002,
			data: [],
			message: 'Start date invalidate'
		})
	} else {
		let criteria = {
			box_id: new RegExp('^' + req.query.box_id + '$', 'i'), // 'i' = case-insensitive
			time: { $gte: new Date(req.query.start_date) }
		}
		await BoxLog.find(criteria).exec((err, boxes) =>  {
			if (err) {
				res.json({
					error_code: 10002,
					data: [],
					message: `Error is ${err}`
				})
			} else {
				res.json({
					error_code: 10000,
					data: boxes,
					message: 'Successfully'
				})
			}
		})
	}
	
});

// /v1/getData?start_date=2016-01-01T16:00&end_date=2016-01-07T16:00
router.get('/v1/getData', (req, res, next) => {
	
	if (!req.query.start_date) {
		res.json({
			error_code: 10002,
			data: [],
			message: 'Start date invalidate'
		});
	} else if (!req.query.end_date) {
		res.json({
			error_code: 10001,
			data: [],
			message: 'End date invalidate'
		});
	} else {
		let criteria = {
			time: { $gte: new Date(req.query.start_date), $lte: new Date(req.query.end_date) }
		};
		BoxLog.find(criteria).exec((err, boxes) => {
			if (err) {
				res.json({
					error_code: 10001,
					data: [],
					message: `Error is ${err}`
				})
			} else {
				res.json({
					error_code: 10000,
					data: boxes,
					message: 'Successfully'
				})
			}
		})
	}
	
});

router.post('/v1/delete_box', (req, res, next) => {
	
	if (!req.body.box_id) {
		res.json({
			error_code: 10002,
			message: 'Box_id invalidate'
		})
		return 
	}
	BoxId.findOneAndRemove({box_id: req.body.box_id}, (err) => {
		if (err) {
			console.log(err)
			res.json({
				error_code: 10002,
				message: `Cannot delete box_id. Error is :  ${err}` 
			})
			return
		}
		res.json({
			error_code: 10000,
		})
	})
	
})
/*
router.post('/v1/delete_box', (req, res, next) => {
	if (!req.body.start_date) {
		res.json({
			error_code: 10002,
			data: [],
			message: 'Start date invalidate'
		});
	} else if (!req.body.end_date) {
		res.json({
			error_code: 10002,
			data: [],
			message: 'End date invalidate'
		});
	} else {
		let criteria = {
			time: { $gte: new Date(req.body.start_date), $lte: new Date(req.body.end_date) }
		};
		BoxLog.find(criteria).exec((err, boxes) => {
			if (err) {
				res.json({
					error_code: 10002,
					message: `Delete error : ${err}`
				})
			} else {
				res.json({
					error_code: 10000,
					data: boxes
				})
			}
		})
		// Box.deleteMany(criteria).exec((err) => {
		// 	if (err) {
		// 		res.json({
		// 			error_code: '1001',
		// 			message: 'Delete error'
		// 		})
		// 	} else {
		// 		res.json({
		// 			error_code: '1000',
		// 			message: `Delete box start_date: ${req.body.start_date}, 
		// 					end_date: ${req.body.end_date} SUCCESSFULLY`
		// 		})
		// 	}
		// })
	}
})
*/

module.exports = router;
