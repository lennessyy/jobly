const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field",
    async function () {

      let table = 'companies';
      let items = {
        name: 'Adobe',
        code: 'adb',
        staff: 128
      }
      let key = 'code'
      let id = 1
      const { query, values } = sqlForPartialUpdate(table, items, key, id)
      expect(query).toEqual('UPDATE companies SET name=$1, code=$2, staff=$3 WHERE code=$4 RETURNING *');
      expect(values).toEqual(['Adobe', 'adb', 128, 1])
    });
});
