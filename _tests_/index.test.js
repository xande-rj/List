import {listAll} from './index.js'
import request from 'supertest'
describe("Get /lista",()=>{
  it("retorna todas as listas",async ()=>{
    return(listAll)
    .get("/list")
    .expected("Content-Type",/json/)
    .expected(200)
    .then((res)=>{
        expected(res.statusCode).toBe(200)
      })
  })
})
