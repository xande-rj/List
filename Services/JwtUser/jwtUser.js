import jwt from "jsonwebtoken"

import "dotenv/config"
//segredo
//passa pelo .env

const secret = process.env.secretJwt

const jwtToken =(emailUser)=>{
try{
const result = jwt.sign(emailUser,secret)
    return result
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
    jwt.verify(token,secret)
    next()
  }
  catch(e){
    res.status(400).json({message: "O Token é inválido!" })
  }
  
}

const jwtInfo = (req)=>{
   const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const info = jwt.verify(token,secret)
  console.log(info)

}

export {jwtToken,jwtProtect,jwtInfo}
