const express = require('express')
const router = new express.Router()
const Company = require('../models/company')
const ExpressError = require('../helpers/expressError')

router.get('/', async (req, res, next) => {
    try {
        const companies = await Company.all()
        return res.json({ companies: companies })
    } catch (e) {
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { handle, name, description, num_employees, logo_url } = req.body
        if (!handle || !name) {
            throw new ExpressError('Must have a company handle and name', 400)
        }
        const company = await Company.create(handle, name, num_employees, description, logo_url)
        return res.status(201).json(company)

    } catch (e) {
        next(e)
    }
})

router.get('/:handle', async (req, res, next) => {
    try {
        const handle = req.params.handle
        const company = await Company.get(handle)
        return res.json(company)
    } catch (e) {
        next(e)
    }
})

router.put('/:handle', async (req, res, next) => {
    try {
        const handle = req.params.handle
        const items = req.body
        const company = await Company.update(handle, items)
        return res.status(202).json(company)
    } catch (e) {
        next(e)
    }
})

router.delete('/:handle', async (req, res, next) => {
    try {
        const handle = req.params.handle
        const message = await Company.delete(handle)
        return res.status(202).json({ message: message })
    } catch (e) {
        next(e)
    }
})

module.exports = router