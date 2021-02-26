const { handler } = require("./test");

describe("basic tests", () => {
  test("handler function exists", () => {
    expect(typeof handler).toBe("function");
  });
});
