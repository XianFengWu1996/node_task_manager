const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const User = require('../models/user')

//TASK ROUTES
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, 
        owner: req.user.id
        
    })

    try {
        const taskResult = await task.save()
        res.status(201).send(taskResult)
    } catch (error) {
        res.status(400).send(error)
    }
})


// GET /tasks?completed=true   filtering
// Get /tasks?limit=10&skip=20  pagination
// GET /tasks?sortBy=createdAt_asc


router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = sort[parts[1]] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.status(200).send(req.user.tasks)

    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.id)
        const task_id = req.params.id

        const task = await Task.findOne({ _id: task_id, owner: req.user._id })

        if(!task){
            res.status(404).send()
        }
        res.status(200).send(task)

    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid Updates'})
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id})

        if(!task){
            return res.status(404).send()
        } 
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        
        res.status(200).send(task)

    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id})

        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router
