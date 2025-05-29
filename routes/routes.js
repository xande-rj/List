import express from "express"

import "dotenv/config"

import {listAll, registerList} from '../Services/listServices.js'
import {createUser} from '../Services/userServices.js'


const app = express()
const port = process.env.Port
// app.use(express.json()) habilita pegar o json que e enviado no post
app.use(express.json())

app.post('/user',createUser)




app.get('/lista',listAll)
app.post('/cadastro',registerList)

app.listen(port,()=>{
  console.log(`rodando na porta${port}`)
})
