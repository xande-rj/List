import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema} from "../schemas/Users.schema.js"

import {cryptorPass} from "./CryptorPass/cryptorPass.js"

const createUser = async function (req,res){
  const Users = new userRepository()

  const User = req.body
 //pegar as informacaos do body e vericar se sao necessarias ou nao
  let userCorpo 
  try{
     userCorpo = userCreateSchema.parse(User)
  }
  catch(err){
    console.log("erro zod:"+ err)
    return res.status(400).json({menssage:err.errors[0].message})
  }



const hashPassword = await cryptorPass(userCorpo.senha)
  .then((hash) => {
    userCorpo.senha= hash

  })
  .catch((err) => {
      return res.status(500).json({message: "Erro nop servidor tente novamente mais tarde"})
    console.error("Erro ao gerar hash da senha:", err);
  });

  

// Os unicos erros do banco de dados e o email esta errado e nao conectado
  Users.createUser(userCorpo).then(


  (value)=>{

      return res.status(201).json({value})
    
    },
  (error)=>{
 console.log(error)
      return res.status(400).json({mensage:"Erro ao cadastra email"})
    
    }

  )
}

export {createUser}
