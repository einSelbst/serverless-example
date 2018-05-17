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
