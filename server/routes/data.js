import express from 'express';
import db from '../config/database.js'
import { ObjectId } from 'mongodb';

const router = express.Router();


// get
router.get('/api/data', async (req, res) => {
    let collection = db.collection('data');
    let results = await collection.find().toArray();
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
router.delete('/api/data/:id', async (req, res) => {
    let collection = db.collection('data');
    let results = await collection.deleteOne({ "_id": new ObjectId(req.params.id) });
    res.send(results).status(200);
})


export default router;