// @ts-check
import processItem from './src/image'

export async function processImage ({ Records: records }, context, callback) {
  try {
    await Promise.all(records.map(processItem))
  } catch (error) {
    console.error(error)
    return callback(error, { records })
  }

  console.log(`Completed processing ${records.length} event${records.length === 1 ? '' : 's'}`)

  return callback(null)
}

import sharp from "sharp";

const done = body => {
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};

const fail = body => {
  return {
    statusCode: 500,
    body: JSON.stringify(body)
  };
};

export const ping = async (e, ctx, callback) => {
  try {
    callback(null, done({ pong: process.env.EXAMPLE }));
  } catch (e) {
    callback(fail(e));
  }
};
