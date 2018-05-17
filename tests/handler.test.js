import * as handler from "../handler";

test("ping", async () => {
  const e = "e";
  const ctx = "ctx";
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("object");
  };

  await handler.ping(e, ctx, callback);
});
