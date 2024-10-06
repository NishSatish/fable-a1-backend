import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadString } from 'firebase/storage'
import express from 'express';
import dotenv from 'dotenv'
import {createBlobAndUpload} from "./util/createBlobAndUpload.js";
dotenv.config();

// FIREBASE CONFIG
const firebaseConfig = {
  storageBucket: process.env.FB_BUCKET
}
const fb = initializeApp(firebaseConfig);
const storage = getStorage(fb);
const fbRef = ref(storage, `blobs/new_${Date.now().toString()}_${Math.random()}.txt`)

// MODULAR STATE
let MAIN_BUFFER = [];
let BUFFER_QUEUE = [];
let IS_CREATING_BLOB = false;
const MAX_BUFFER = 2999
let c = 0;

// Express
const app = express();
app.use(express.json());

app.use('/log', async (req, res) => {
  console.log("log no.", ++c);
  const log = {
    ...req.body.log,
    timestamp: Date.now().toString()
  }

  if (IS_CREATING_BLOB) {
    BUFFER_QUEUE.push(log);
    res.json("queued")
  } else {
    MAIN_BUFFER.push(log);
    if (MAIN_BUFFER.length === MAX_BUFFER) {
      IS_CREATING_BLOB = true;
      try {
        const response = await createBlobAndUpload(MAIN_BUFFER, fbRef);
        if (response) {
          res.json("1 file uploaded")
          console.log("1 file uploaded")
        }
      } catch (e) {
        console.log("Error:", e)
      } finally {
        // Load queued messages and reset everything for the next file
        MAIN_BUFFER.length = 0;
        MAIN_BUFFER.push(...BUFFER_QUEUE);
        console.log("HERE AT FINALLY, ", MAIN_BUFFER.length)
        BUFFER_QUEUE.length = 0;
        IS_CREATING_BLOB = false;
      }
    } else {
      res.json("ok")
    }
  }

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`live @ ${PORT}`);
});



