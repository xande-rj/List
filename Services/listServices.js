
import {arrayInfoList, infoList} from "../schemas/Lista.schema.js"
import {listRepository} from "../repository/listRepository.js"


import {jwtInfo} from "./JwtUser/jwtUser.js"
// pegar o email do jwt
//  olhar no banco a lista
//  com base no email 
const listAll = async function (req,res){

  const list =  new listRepository()
 
  const emailJwt = jwtInfo(req)

  const listRepo = await list.findAll(emailJwt.emailUser)
 
  const listArraySchema = arrayInfoList.parse(listRepo)

  res.status(200).json({Lista:listArraySchema})
}

// cria um contato na lista com base no id do Usario logado, vindo do token
// verificar se o numero existe nos contatos do usuario
const registerList = async function (req,res){
  const list = new listRepository()

  const contactList = infoList.parse(req.body)

  const userInfoJwt =  jwtInfo(req)

   await list.createList(contactList,userInfoJwt.idUser).then(

  (value)=>{

      return res.status(201).json({Contato: value})
    
    },
  (error)=>{
      return res.status(400).json({mensage:"Erro ao cadastra o contato"})
    
    }

  )
  }


const listOne =async (req,res)=>{
  // estancia a classe 
  const list = new listRepository()
  // recebe o paramametro na requisicao 
   
// pega as informacoes no jwt 
  const userInfoJwt =  jwtInfo(req)
 // procura no banco com base no telefone e no jwt  
 await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser).then(
    (value)=>{

      try {
        const contato = infoList.parse(value)
      return res.status(200).json({Contato:contato})    
      } catch (error) {
        res.status(400).json({mensage: "erro na busca verifique se as informacoes estao certas"})
      }
      
    }
    
  )


}


const updateList = async(req,res)=>{

// estancia a classe 
  const list = new listRepository()
  // recebe o paramametro na requisicao 
   
// pega as informacoes no jwt 
  const userInfoJwt =  jwtInfo(req)
 // procura no banco com base no telefone e no jwt  
 await list.updateUniqueTelephone(req.body.describe, userInfoJwt.idUser, req.params.telefone).then(
    (value)=>{

      console.log(value)
    }
    
  )


}

export {listAll, registerList, listOne, updateList}
