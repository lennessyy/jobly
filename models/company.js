const db = require('../db')
const ExpressError = require('../helpers/expressError')
const sqlForPartialUpdate = require('../helpers/partialUpdate')

function handleMaxandMin(min, max) {
    min = Number(min);
    max = Number(max);
    if (isNaN(min) || isNaN(max)) {
        throw new ExpressError('min and max must be numbers', 400)
    }
    if (min > max) {
        throw new ExpressError('min must be smaller than max', 400)
    }
    return [min, max]
}

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

    static async search(query, min_employees, max_employees) {
        if (!min_employees) {
            min_employees = 0
        }
        if (!max_employees) {
            max_employees = 10000000
        }
        if (!query) {
            query = ''
        }
        [min_employees, max_employees] = handleMaxandMin(min_employees, max_employees)
        const results = await db.query(`SELECT * FROM companies WHERE name ILIKE $1 AND num_employees > $2 AND num_employees < $3`, [`%${query}%`, min_employees, max_employees])

        return results.rows
    }
}

module.exports = Company