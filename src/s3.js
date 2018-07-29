// @ts-check
import AWS from 'aws-sdk'
import { config } from './config'
import { rejects } from 'assert';

const defaultParams = (config.s3 && config.s3.params) || {}

export const sourceBucket = new AWS.S3({
  params: { Bucket: config.sourceBucket },
})

export const destinationBucket = new AWS.S3({
  params: { Bucket: config.destinationBucket },
})

export function get (params = {}, bucket = sourceBucket) {
  const s3Params = {
    ...params,
  }

  return bucket.getObject(s3Params, function(err, data) {
   if (err) console.log("An error occured in get ", err, err.stack); // an error occurred
 }).promise()
}

export function upload (data, params = {}, bucket = destinationBucket) {
  const s3Params = {
    ...defaultParams,
    ...params,
    Body: data,
  }

  return new Promise((resolve, reject) => {
    bucket.upload(s3Params, (err, value) => {
      if (err) {
        reject(err)
      }
      resolve(value);
    });
  })
}

export function remove (objects, bucket = destinationBucket) {
  const s3Params = {
    Delete: {
      Objects: objects.map(object => ({ Key: object })),
    },
  }

  return bucket.deleteObjects(s3Params).promise()
}
