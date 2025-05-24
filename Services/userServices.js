import {userRepository} from "../repository/userRepository.js"

const createUser = async function (req,res){
  const Users = new userRepository()
   
  console.log(req.body)
  Users.createUser(req.body)

  res.status(201).json({mensage: "criado com sucesso"})
  
}

export {createUser}
