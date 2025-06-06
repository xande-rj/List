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

const jwtProtect = (req,res,next)=>{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token)return res.status(401).json({ message: "Acesso negado!" });
try{
   const test= jwt.verify(token,secret)
    console.log(test)
    next()
  }
  catch(e){
    res.status(400).json({message: "O Token é inválido!" })
  }
  
}

export {jwtToken,jwtProtect}
