import {uploadString} from "firebase/storage";

export const createBlobAndUpload = async (array, ref) => {
  let blob = new Blob(
    [array.join('\n')],
    {type: 'text/plain'}
  )
  uploadString(ref, await blob.text(), 'raw').then(() => {
    console.log("FILE UPLOADED")
    // !!!! CRUCIAL MEMORY FIX
    // Clearing it before the GC does
    blob = null;
  }).catch(e => {
    throw e
  });
}