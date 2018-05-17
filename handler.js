import uuid from "uuid";

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
    callback(null, done({ pong: "pong", id: uuid.v1() }));
  } catch (e) {
    callback(fail(e));
  }
};
