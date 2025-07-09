import express from "express"

import "dotenv/config"

import { listAll, registerList, listOne, updateList, listDelete } from '../Services/listServices.js'
import { createUser, loginUser, updateUser, deleteUser } from '../Services/userService.ts'

import { jwtProtect } from '../Services/JwtUser/jwtUser.js'

const app = express()
const port = process.env.Port || 3000


// app.use(express.json()) habilita pegar o json que e enviado no post
app.use(express.json())

// rotas de usuario 
app.post('/user', createUser)
app.post('/users/login', loginUser)
app.put('/users', jwtProtect, updateUser)
app.delete('/users', jwtProtect, deleteUser)

/*
// rota de lista de contatos
app.get('/users/list', jwtProtect, listAll)
app.post('/users/list', jwtProtect, registerList)
app.get('/users/list/:telefone', jwtProtect, listOne)
app.put('/users/list/:telefone', jwtProtect, updateList)
app.delete('/users/list/:telefone', jwtProtect, listDelete)
*/

app.listen(port, (): void => {
  console.log(`rodando na porta${port}`)
})
