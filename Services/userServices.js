import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema} from "../schemas/Users.schema.js"


const createUser = async function (req,res){
  const Users = new userRepository()
   //pegar as informacaos do body e vericar se sao necessarias ou nao
  const User = req.body
console.log(User)
  const corpoUser = userCreateSchema.parse(User)
  
if(corpoUser){
  console.log("aaaaaaqui")
  } 
    



// O unico erro do banco de dados e o email esta errado 
  Users.createUser(req.body).then(

  (value)=>{

      return res.status(201).json({value})
    
    },
  (error)=>{
 
      return res.status(400).json({mensage:"Erro ao cadastra email"})
    
    }

  )
  
}

export {createUser}
