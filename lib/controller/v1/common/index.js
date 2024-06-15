const plugins = require("../../../plugins");
const { RESPONSE, BAD, RESPONSE_ERROR } = plugins.resSchema;
const { connection } = require("../../../config/db/mysql");
const { env } = require("../../../config/server");
const { db_query, errorLog } = require("../../../decorator");
const crypto = require("crypto");
const moment = require("moment");
const base64Url = require("base64-url");
const commonQuery = require("../../../database/mysql/common/dashboard_common_service");
const data = require("../../../../public/platform_data/data.json");

const postBalanceSheetHandler = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  postBalanceSheetHandler,
};
