import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema} from "../schemas/Users.schema.js"

import {cryptorPass} from "./CryptorPass/cryptorPass.js"

const createUser = async function (req,res){
  const Users = new userRepository()

  const User = req.body
  const {senha} = req.body
console.log(User.senha)

cryptorPass("minhaSenhaSegura")
  .then((hash) => {
    console.log(hash);
  })
  .catch((err) => {
    console.error("Erro ao gerar hash da senha:", err);
  });
  
   //pegar as informacaos do body e vericar se sao necessarias ou nao
  let userCorpo 
  try{
     userCorpo = userCreateSchema.parse(User)
  }
  catch(err){
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
