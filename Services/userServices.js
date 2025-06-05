import {userRepository} from "../repository/userRepository.js"

import {userCreateSchema, userLoginSchema} from "../schemas/Users.schema.js"

import {cryptorPass, comparePass} from "./CryptorPass/cryptorPass.js"

import {jwtToken} from "./JwtUser/jwtUser.js"


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


 await cryptorPass(userCorpo.senha)
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
  
  const Users = new userRepository()
 let User
  // verifica se o as informacao sao as certas 
  try{
      User = userLoginSchema.parse(req.body)
  }
  catch(e){
    res.status(404).send("verifique se os campos estao digitados corretamente")
  }

 let userInfo
    // pega as informacoes do banco se existir o usuario
   await Users.findUniqueUser(User.email)
  .then((value)=>{
// banco retorna null se nao existir usuario
    if(value == null){
      return res.status(404).send("senha ou usuario incorretos")
    }
    userInfo = value
  }
  )


// verificar se a senha esta corretamente digitada
  // retorna true se sim e um token jwt
  // retorna false se nao e um erro 
  await comparePass(User.senha,userInfo.senha)
  .then((valor)=>{
    // verifica a volta da funcao de criptografia
    if(!valor) return res.status(406).send("senha ou usuario incorretos")
    //retorna o jwt 
  
    const token = jwtToken(userInfo.email)
    return res.setHeader('Authorization',`Bearer${token}`).status(200).send("sucesso")

  })

}
export {createUser, loginUser}
