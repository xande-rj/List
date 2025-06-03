import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema, userLoginSchema} from "../schemas/Users.schema.js"

import {cryptorPass} from "./CryptorPass/cryptorPass.js"

const createUser = async function (req,res){
  const Users = new userRepository()

 //pegar as informacaos do body e vericar se sao necessarias ou nao
  let userCorpo 
  try{
     userCorpo = userCreateSchema.parse(req.body)
  }
  catch(err){
    return res.status(400).json({menssage:err.errors[0].message})
  }



const hashPassword = await cryptorPass(userCorpo.senha)
  .then((hash) => {
    userCorpo.senha= hash

  })
  .catch((err) => {
      return res.status(500).json({message: "Erro nop servidor tente novamente mais tarde"})
  });

  

// Os unicos erros do banco de dados e o email esta errado e nao conectado
  Users.createUser(userCorpo).then(


  (value)=>{

      return res.status(201).send(value)
    
    },
  (error)=>{
      return res.status(400).json({mensage:"Erro ao cadastra email"})
    
    }

  )
}


const loginUser =  async function(req,res){
// recebe o email e a senha e compara com a do banco 
  // devolve um jwt que permite o acesso a lista
  //
  const Users = new userRepository()
 let User 
  try{
      User = userLoginSchema.parse(req.body)
    res.status(200).send("ok")
  }
  catch(e){
    res.status(404).send("error")
  }

  Users.findUniqueUser(User.email).then(
  (value)=>{
      console.log(value)
    },
    (err)=>{
      console.log(err)
    }

  )
  
}
export {createUser, loginUser}
