import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadString } from 'firebase/storage'
import express from 'express';
import dotenv from 'dotenv'
import {createBlobAndUpload} from "./util/createBlobAndUpload.js";
import {flushBufferToBlob} from "./cron/flushBufferToBlob.js";
dotenv.config();

// FIREBASE CONFIG
const firebaseConfig = {
  storageBucket: process.env.FB_BUCKET
}
const fb = initializeApp(firebaseConfig);
const storage = getStorage(fb);

// MODULAR STATE
let MAIN_BUFFER = [];
let BUFFER_QUEUE = [];
let IS_CREATING_BLOB = false;
let c = 0; // Request count

// Express
const app = express();
app.use(express.json());

app.post('/log', async (req, res) => {
  console.log("log no.", ++c);
  const log = JSON.stringify({
    ...req.body.log,
    timestamp: Date.now().toString()
  })

  if (IS_CREATING_BLOB) {
    BUFFER_QUEUE.push(log);
    res.json("queued")
  } else {
    MAIN_BUFFER.push(log);
    res.json("ok")
  }

  // EMERGENCY FLUSH (If array crosses 200000 logs approx. 10MB)
  if (MAIN_BUFFER.length >= 200000 && IS_CREATING_BLOB === false) {
    IS_CREATING_BLOB = true;
    try {
      await flushBufferToBlob(MAIN_BUFFER, BUFFER_QUEUE, storage);
    } catch (e) {
      throw e;
    } finally {
      console.log("EMERGENCY FLUSH")
      IS_CREATING_BLOB = false
    }
  }
})

// CRON JOB (for flushing the buffer onto blob every 10 seconds)
setInterval(async () => {
  if (MAIN_BUFFER.length === 0 || IS_CREATING_BLOB === true) {
    // Do not flush if main buffer is empty or if an emergency flushg is triggered
    console.log('Buffer empty')
    return;
  }
  IS_CREATING_BLOB = true;
  try {
    await flushBufferToBlob(MAIN_BUFFER, BUFFER_QUEUE, storage);
  } catch (e) {
    throw e;
  } finally {
    IS_CREATING_BLOB = false
  }
}, 10000)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`live @ ${PORT}`);
});



