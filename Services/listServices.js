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
 
  try{
  const listArraySchema = arrayInfoList.parse(listRepo)
  }catch(e){
    res.status(400).json({message: "Erro no recebimento das informacoes"})
  }

  res.status(200).json({Lista:listArraySchema})
}

// cria um contato na lista com base no id do Usario logado, vindo do token
const registerList = async function (req,res){

  const list = new listRepository()
  
  try{
  const contactList = infoList.parse(req.body)
  }
  catch(e){
    res.status(400).json({message: "Verifique se as informacoes estao corretas"})
  }

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
// pega as informacoes no jwt 
  const userInfoJwt =  jwtInfo(req)
  // pega as informacoes do contato desejado 
    const contatoInfo = await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)
    if(contatoInfo == null){// verifica se ele existe
  return  res.status(400).json({message:"verifique se os dados estao corretos"})
  }

  
 // procura no banco com base no telefone e no jwt  
  await list.updateUniqueTelephone(req.body,contatoInfo.id).then(
    (value)=>{
      try{
      const contatoInfo = infoList.parse(value)
      res.status(200).json({message: contatoInfo})
      }
      catch(e){
        res.status(400).json({message:" Erro na execucao"})
      }

    },
    (error)=>{
      res.status(400).json({message:"verifique se os dados estao corretos"})
    }
    
  )
}


  const listDelete = async (req,res)=>{
    const list = new listRepository()
      const userInfoJwt =  jwtInfo(req)

    const contatoInfo = await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)
    if(contatoInfo == null){// verifica se ele existe
  return  res.status(400).json({message:"verifique se os dados estao corretos"})
  }


    await list.deleteUniqueTelephone(contatoInfo.id).then(
      (value)=>{
        res.status(200).json({message:"Deletado com sucesso"})
      
      }
    )

  } 


export {listAll, registerList, listOne, updateList, listDelete}
