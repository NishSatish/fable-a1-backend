import {ref} from "firebase/storage";
import {createBlobAndUpload} from "../util/createBlobAndUpload.js";

export const flushBufferToBlob = async (MAIN_BUFFER, BUFFER_QUEUE, storage) => {
  const fbRef = ref(storage, `blobs/new_${Date.now().toString()}.txt`)

  try {
    const response = await createBlobAndUpload(MAIN_BUFFER, fbRef);
    if (response) {
      console.log("1 file uploaded")
    }
  } catch (e) {
    console.log("Error:", e)
  } finally {
    // Load queued messages and reset everything for the next file
    MAIN_BUFFER.length = 0;
    MAIN_BUFFER.push(...BUFFER_QUEUE);
    BUFFER_QUEUE.length = 0;
  }
}