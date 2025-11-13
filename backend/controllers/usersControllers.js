const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const login = asyncHandler (async(req,res) => {
    const {email, password} = req.body

    //verificamos que el usuario existe
    const user = await User.findOne({email})

    //si el usuario existe verifico el hash
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            token: generarToken(user.id)
        })
    }
})

const register = asyncHandler (async(req,res) => {
    //desestructuramos el bosy
    const {nombre, email, password} = req.body

    //verifcamos 
    if (!nombre || !email || !password) {
        res.status(400)
        throw new Error ('Faltan datos')
    }

    //verificamos que ese usuario 
    const userExists = await User.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error ('Faltan datos')
    } else {
        // hash al pasword
        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password, salt)

        //crear el usuario
        const user = await User.create({
            nombre,
            email,
            password: passwordHashed
        })

        //si el usiario se creo coreectamente lo muestr0
        if (user) {
            res.status(201).json({
                _id: user.id,
                nombre: user.email,
                password: user.password
            })
        } else {
            res.status(400)
            throw new Error ('No se pudieron guardar los datos')
        }
    }
})

const data = asyncHandler (async(req,res) => {
    res.status(200).json(req.user)
})

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30 d'
    })
}

module.exports = {
    login, register, data
}   