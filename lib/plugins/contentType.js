const { resSchema } = require(".");

const multipart = (req, res, next) => {
  try {
    if (!req.headers["content-type"]) {
      return resSchema.BAD({
        res,
        errors: "Invalid Body",
      });
    }

    const contentType = req.headers["content-type"]?.split(";")[0] ?? "";
    if (contentType === "multipart/form-data") {
      next();
    } else {
      return resSchema.BAD({
        res,
        errors: "Invalid content-type " + contentType,
      });
    }
  } catch (error) {
    console.log("AT content-type multipart....", error);
    return resSchema.RESPONSE_ERROR(res);
  }
};

const rawJson = (req, res, next) => {
  try {
    const contentType = req.headers["content-type"]?.split(";")[0] ?? "";
    if (contentType === "application/json") {
      next();
    } else {
      return resSchema.BAD({
        res,
        errors: "Invalid content-type " + contentType,
      });
    }
  } catch (error) {
    console.log("AT content-type rawJson....", error);
    return resSchema.RESPONSE_ERROR(res);
  }
};

module.exports = {
  multipart,
  rawJson,
};
