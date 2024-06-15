const router = require("express").Router();
const handler = require("../../../../controller/v1/common");
const validator = require("../../../validators/");
const plugins = require("../../../../plugins/contentType");

router.post(
  "/balance-sheet-extractor",
  plugins.multipart,
  (req, res, next) =>
    fileUpload({
      req,
      res,
      next,
      uploadType: "any",
      moduleName: "balance-sheet",
      fileValidator: validator.fileValidator,
      fileSizeObject: {
        file: [10 * 1024 * 1024, "File Size is too large"],
      },
      storagePath: handler.storageFile,
    }),
  validator.numberOfFileCheck,
  multerBodyParser,
  validator.postBalanceSheetValidator,
  handler.postBalanceSheetHandler
);
