import jwt from "jsonwebtoken"

import "dotenv/config"
//segredo
//passa pelo .env

const secret = process.env.secretJwt

const jwtToken =(emailUser)=>{
try{
const result = jwt.sign(emailUser,secret)
    return result
  console.log(result)
  }
  catch(e){
    console.log(e)
    throw err
  }
}

export {jwtToken}
