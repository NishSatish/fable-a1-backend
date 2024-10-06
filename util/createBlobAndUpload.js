import {uploadString} from "firebase/storage";

export const createBlobAndUpload = async (array, ref) => {
  const blob = new Blob(
    [array.map(log => JSON.stringify(log)).join('\n')],
    {type: 'text/plain'}
  )
  uploadString(ref, await blob.text(), 'raw').then(() => {
    console.log("FILE UPLOADED")
  }).catch(e => {
    throw e
  });
}