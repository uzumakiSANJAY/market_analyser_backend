const SQL = require("@nearform/sql");

/**
 * @module selectWithAnd - SELECT query with "AND" condition in between all the keys of condition
 * @param {string[]} requiredFields - Fields that are required as a result of the query.
 * @param {string} table - Name of the table on which to perform the query.
 * @param {Object} condition - Filter results based on this condition, given as key value pair.
 * @returns {Object} - Query object
 * @example param example - (["id","name"],"resident_details",{status:true, is_deleted:false})
 */

const selectWithAnd = (requiredFields, table, condition) => {
  try {
    const empty = null;
    const columns = requiredFields.map((key) => SQL`${SQL.quoteIdent(key)}`);
    const whereCondition = Object.keys(condition).map((key) =>
      condition[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.unsafe(key)} = ${condition[key]}`
    );
    return SQL` SELECT ${SQL.glue(columns, " , ")}
                FROM ${SQL.quoteIdent(table)}
                WHERE ${SQL.glue(whereCondition, " AND ")}
                          `;
  } catch (error) {
    throw error;
  }
};

/**
 * @module selectWithInAndOR - SELECT query with "IN" and "AND" clause joined with "OR"
 * @param {string[]} requiredFields - Fields that are required as a result of the query.
 * @param {string} table - Name of the table on which to perform the query.
 * @param {Object[]} inCondition
 * @param {*} whereCondition
 * @example Params :-
 * (
 *  requiredFields = ["email"],
 *  table = "users_details",
 *  inCondition = [
 *  {
 *   email:["test1@email.com","test2@email.com"],
 *   sec_email:["test1@email.com","test2@email.com"]
 * },
 * {id:[1,2,3]}
 * ],
 * whereCondition = {role_id:1, is_deleted = false})
 * @example Query made and sent in response :-
 * SELECT
 *        "email"
 * FROM
 *        "users_details"
 * WHERE
 *         (
 *           (
 *              email IN ('test1@email.com','test2@email.com')
 *              AND
 *              secondary_email IN ('test1@email.com','test2@email.com'))
 *           OR
 *           (id IN (1,2,3))
 *         )
 * AND
 *         (role_id = 1 AND is_deleted = false)
 * @returns {Object} - Query object
 */

const selectWithInAndOR = (
  requiredFields,
  table,
  inCondition,
  whereCondition
) => {
  try {
    const empty = null;

    const columns = requiredFields.map((key) => SQL`${SQL.quoteIdent(key)}`);

    const inOrConditionArr = inCondition.map((conditions) => {
      const inCond = Object.keys(conditions).map((key) => {
        let valStr = conditions[key].join(", ");
        return SQL`${SQL.unsafe(key)} IN (${SQL.unsafe(valStr)})`;
      });

      return SQL`(${SQL.glue(inCond, " AND ")})`;
    });

    const whereConditionArr = Object.keys(whereCondition).map((key) =>
      whereCondition[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.unsafe(key)} = ${whereCondition[key]}`
    );

    return SQL` SELECT ${SQL.glue(columns, " , ")}
                FROM ${SQL.quoteIdent(table)}
                WHERE
                     ${SQL.glue(inOrConditionArr, " OR ")}   
                AND 
                      ${SQL.glue(whereConditionArr, " AND ")}
                            `;
  } catch (error) {
    throw error;
  }
};

const insertOne = (table, data) => {
  try {
    const empty = null;
    const columns = Object.keys(data).map((key) => SQL`${SQL.quoteIdent(key)}`);
    const values = Object.keys(data).map((key) =>
      data[key] === "" ? SQL`${empty}` : SQL`${data[key]}`
    );
    return SQL`
                INSERT INTO ${SQL.quoteIdent(table)}
                (${SQL.glue(columns, " , ")})
                VALUES(${SQL.glue(values, " , ")});
                            `;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ insertOne ~ error:", error);
    throw new Error(error);
  }
};

const insertMany = (table, data) => {
  try {
    const columns = Object.keys(data[0]).map(
      (key) => SQL`${SQL.quoteIdent(key)}`
    );
    const values = data.map(
      (item) =>
        SQL`(${SQL.glue(
          Object.keys(item).map((key) => SQL`${item[key]}`),
          " , "
        )})`
    );
    return SQL`
                INSERT INTO ${SQL.quoteIdent(table)}
                (${SQL.glue(columns, " , ")})
                VALUES ${SQL.glue(values, " , ")};
            `;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ insertMany ~ error:", error);
    throw new Error(error);
  }
};

const insertOneOnDuplicate = (table, data, setData) => {
  try {
    const empty = null;
    const columns = Object.keys(data).map((key) => SQL`${SQL.quoteIdent(key)}`);
    const values = Object.keys(data).map((key) =>
      data[key] === "" ? SQL`${empty}` : SQL`${data[key]}`
    );
    const setOnDuplicate = Object.keys(setData).map((key) =>
      setData[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.quoteIdent(key)} = ${setData[key]}`
    );
    return SQL`
            INSERT INTO ${SQL.quoteIdent(table)}
            (${SQL.glue(columns, " , ")})
            VALUES(${SQL.glue(values, " , ")})
            ON DUPLICATE KEY UPDATE ${SQL.glue(setOnDuplicate, " , ")};`;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ insertOne ~ error:", error);
    throw new Error(error);
  }
};
const insertManyOnDuplicate = (table, data, setData) => {
  try {
    const empty = null;
    const columns = Object.keys(data[0]).map(
      (key) => SQL`${SQL.quoteIdent(key)}`
    );
    const values = data.map(
      (item) =>
        SQL`(${SQL.glue(
          Object.keys(item).map((key) => SQL`${item[key]}`),
          " , "
        )})`
    );
    const setOnDuplicate = Object.keys(setData).map((key) =>
      setData[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.quoteIdent(key)} = ${SQL.unsafe(setData[key])}`
    );
    return SQL`
            INSERT INTO ${SQL.quoteIdent(table)} 
            (${SQL.glue(columns, " , ")}) 
            VALUES ${SQL.glue(values, " , ")} 
            ON DUPLICATE KEY UPDATE ${SQL.glue(setOnDuplicate, " , ")};`;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ insertMany ~ error:", error);
    throw new Error(error);
  }
};
const updateOne = (table, data, condition) => {
  try {
    const empty = null;
    const columns = Object.keys(data).map((key) =>
      data[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.quoteIdent(key)} = ${data[key]}`
    );
    const whereCondition = Object.keys(condition).map((key) =>
      condition[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.quoteIdent(key)} = ${condition[key]}`
    );

    return SQL`
            UPDATE ${SQL.quoteIdent(table)}
            SET ${SQL.glue(columns, " , ")}
            WHERE ${SQL.glue(whereCondition, " AND ")};
          `;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ updateOne ~ error:", error);
    throw new Error(error);
  }
};
const updateMany = (table, data, conditions) => {
  try {
    const empty = null;
    const columns = Object.keys(data).map((key) =>
      data[key] === ""
        ? SQL`${SQL.quoteIdent(key)} = ${empty}`
        : SQL`${SQL.quoteIdent(key)} = ${data[key]}`
    );
    const whereConditionColumn = Object.keys(conditions[0]).map(
      (key) => SQL`${SQL.quoteIdent(key)}`
    );
    const whereCondition = conditions.map(
      (item) =>
        SQL`${SQL.glue(
          Object.keys(item).map((key) => SQL`${item[key]}`),
          " , "
        )}`
    );
    return SQL`
            UPDATE ${SQL.quoteIdent(table)}
            SET ${SQL.glue(columns, " , ")}
            WHERE ${SQL
              // @ts-ignore
              .glue(whereConditionColumn)} IN (${SQL.glue(
      whereCondition,
      " , "
    )});
          `;
  } catch (error) {
    console.log("plugin ~ dbQuery ~ updateMany ~ error:", error);
    throw new Error(error);
  }
};

module.exports = {
  selectWithAnd,
  selectWithInAndOR,
  insertOne,
  insertMany,
  insertOneOnDuplicate,
  insertManyOnDuplicate,
  updateOne,
  updateMany,
};
