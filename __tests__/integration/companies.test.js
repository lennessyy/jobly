process.env.NODE_ENV = 'test'

const request = require('supertest')
const app = require('../../app')
const db = require('../../db')

let testComany
beforeEach(async () => {
    const result = await db.query(`
    INSERT INTO companies (handle, name, description) VALUES (
        'microsoft', 'Microsoft', 'leading consumer software company') RETURNING *`)
    testComany = result.rows[0]
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end()
})

describe('company routes', () => {
    test('/GET should get a list of companies', async () => {
        const res = await request(app).get('/companies')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            companies: [
                {
                    handle: 'microsoft',
                    name: 'Microsoft',
                    description: 'leading consumer software company',
                    logo_url: null,
                    num_employees: null
                }
            ]
        })
    })

    test('/:handle GET should get one company', async () => {
        const res = await request(app).get('/companies/microsoft')
        expect(res.status).toBe(200)
        expect(res.body).toEqual(testComany)
    })

    test('/POST should create a new company and return the created company', async () => {
        const res = await request(app).post('/companies').send({
            handle: 'midd',
            name: 'Middlebury',
            description: 'Higher ed non-profit'
        })
        const midd = {
            handle: 'midd',
            name: 'Middlebury',
            description: 'Higher ed non-profit',
            logo_url: null,
            num_employees: null
        }
        expect(res.status).toBe(201)
        expect(res.body).toEqual(midd)

        const res2 = await request(app).get('/companies/midd')
        expect(res2.status).toBe(200)
        expect(res.body).toEqual(midd)
    })

    test('/:handle PUT should update a company', async () => {
        const res = await request(app).put('/companies/microsoft').send({
            logo_url: 'https://logos-download.com/wp-content/uploads/2016/02/Microsoft_logo.png'
        })
        expect(res.status).toBe(202)
        expect(res.body.logo_url).toBe('https://logos-download.com/wp-content/uploads/2016/02/Microsoft_logo.png')
    })

    test('/:handle delete should delete a company, invalid handle should return 400', async () => {
        const res = await request(app).delete('/companies/microsoft')
        expect(res.status).toBe(202)
        expect(res.body.message).toBe('DELETED')

        const res2 = await request(app).get('/companies/microsoft')
        expect(res2.status).toBe(400)
    })
})