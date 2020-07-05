const db = require('../db')
const ExpressError = require('../helpers/expressError')
const sqlForPartialUpdate = require('../helpers/partialUpdate')

class Job {
    static async all() {
        const results = await db.query(`
        SELECT * FROM jobs`)
        return results.rows
    }

    static async get(id) {
        const result = await db.query(`SELECT * FROM jobs WHERE id=$1`, [id])
        if (result.rows.length === 0) {
            throw new ExpressError('Not found', 400)
        }
        return result.rows[0]
    }

    static async create(title, salary, equity, company_handle) {
        const result = await db.query(`INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) RETURNING *`, [title, salary, equity, company_handle])
        return result.rows[0]
    }

    static async update(items, id) {
        const { query, values } = sqlForPartialUpdate('jobs', items, 'id', id)
        const result = await db.query(query, values)
        if (result.rows.length === 0) {
            throw new ExpressError('Not found', 400)
        }
        return result.rows[0]
    }

    static async delete(id) {
        await db.query(`DELETE FROM jobs WHERE id = $1`, [id])
        return 'DELETED'
    }
}

module.exports = Job