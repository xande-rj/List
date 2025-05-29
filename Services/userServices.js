import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema} from "../schemas/Users.schema.js"

import {verificarEmail} from "./emailValidation/emailValitation.js"
const createUser = async function (req,res){
  const Users = new userRepository()

  const User = req.body
  
  const verivy=  verificarEmail(User.email) 
if(verivy){
    console.log(true)
  }


   //pegar as informacaos do body e vericar se sao necessarias ou nao
  let userCorpo 
  try{
     userCorpo = userCreateSchema.parse(User)
  }
  catch(err){
console.log(err)
    return res.status(400).json({menssage:err.errors[0].message})
  }
    

// O unico erro do banco de dados e o email esta errado 
  Users.createUser(userCorpo).then(

  (value)=>{

      return res.status(201).json({value})
    
    },
  (error)=>{
 
      return res.status(400).json({mensage:"Erro ao cadastra email"})
    
    }

  )
}

export {createUser}
