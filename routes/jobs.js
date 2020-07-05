const express = require('express')
const router = new express.Router()
const Company = require('../models/company')
const ExpressError = require('../helpers/expressError')
const Job = require('../models/job')

router.get('/', async (req, res, next) => {
    try {
        const jobs = await Job.all()
        return res.json({ jobs: jobs })
    } catch (e) {
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { title, salary, equity, company_handle } = req.body
        const job = await Job.create(title, salary, equity, company_handle)
        return res.status(201).json(job)
    } catch (e) {
        next(e)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const items = req.body
        const job = await Job.update(items, req.params.id)
        return res.status(202).json(job)
    } catch (e) {
        next(e)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Job.delete(req.params.id)
        return res.status(202).json({ message: 'DELETED' })
    } catch (e) {
        next(e)
    }
})

module.exports = router