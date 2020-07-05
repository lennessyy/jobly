const db = require('../db')
const ExpressError = require('../helpers/expressError')
const sqlForPartialUpdate = require('../helpers/partialUpdate')

class Company {
    constructor(handle, name) {
        this._handle = handle
        this.name = name
    }

    static async all() {
        const results = await db.query(`
        SELECT * FROM companies`)
        return results.rows
    }

    static async get(handle) {
        const results = await db.query(`
        SELECT * from companies WHERE handle = $1`, [handle])
        if (results.rows.length === 0) {
            throw new ExpressError('Not found', 400)
        }
        return results.rows[0]
    }

    static async update(handle, items) {
        const { query, values } = sqlForPartialUpdate('companies', items, 'handle', handle)
        const results = await db.query(query, values)
        if (results.rows.length === 0) {
            throw new ExpressError('Not found', 400)
        }
        return results.rows[0]
    }

    static async create(handle, name, num_employees = null, description = null, logo_url = null) {
        const results = await db.query(`
        INSERT INTO companies (handle, name, num_employees, description, logo_url)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`, [handle, name, num_employees, description, logo_url])
        return results.rows[0]
    }

    static async delete(handle) {
        await db.query('DELETE FROM companies WHERE handle = $1', [handle])
        return 'DELETED'
    }
}

module.exports = Company