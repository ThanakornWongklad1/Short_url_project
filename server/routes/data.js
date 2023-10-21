import express from 'express';
import db from '../config/database.js'
import { ObjectId } from 'mongodb';

const router = express.Router();


// get all data and sort by time desc

router.get('/api/data', async (req, res) => {
    let collection = db.collection('data');
    let results = await collection.find().sort({ "time": -1 }).toArray();
    res.send(results).status(200);
})

// post
router.post('/api/create-short-url', async (req, res) => {
    let collection = db.collection('data');
    let existLongURL = await collection.find({ "long_url": req.body.long_url }).toArray();
    if (existLongURL.length > 0) {
        res.status(400).json({
            status: "error",
            message: "This URL already exists",
            existData: existLongURL[0]
        })
    }
    else {
        let uniqueId = Math.random().toString(36).replace(/[^a-z0-9]/gi, '').substring(3, 10);
        let results = await db.collection('data').insertOne({
            "long_url": req.body.long_url,
            "short_url": uniqueId,
            "clicks": 0,
            "time": new Date()
        });
        res.status(200).json({
            status: "ok",
            results: uniqueId
        });
    }
})

// delete  
router.delete('/api/data/:shortId', async (req, res) => {
    let collection = db.collection('data');
    let results = await collection.deleteOne({ "short_url": req.params.shortId });
    res.send(results).status(200);
})

// redirect
router.get('/:shorturlid', async (req, res) => {
    let shorturlid = req.params.shorturlid
    let collection = db.collection('data');
    let existShortUrl = await collection.find({ "short_url": shorturlid }).limit(1).toArray();
    if (existShortUrl.length > 0) {
        res.redirect(existShortUrl[0].long_url)
        await collection.updateOne({ "short_url": shorturlid }, { $inc: { "clicks": +1 } })
    }
})


export default router;