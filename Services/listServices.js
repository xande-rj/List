
import {arrayInfoList, infoList} from "../schemas/Lista.schema.js"
import {listRepository} from "../repository/listRepository.js"


const listAll = async function (req,res){
  const list =  new listRepository()

  const listRepo = await list.findAll()

  const listRepoZod = arrayInfoList.parse(listRepo)

  res.status(200).send(listRepoZod)
}

const registerList = async function (req,res){
  const list = new listRepository()

  if( await list.findUniqueTelephone(parseInt(req.body.telefone)) == null){
    //aqui eu posso registra no banco 
      const newList = await list.createList(req.body)

      const listBody = infoList.parse(newList)

      return res.status(201).send(listBody)

  }
  //TESTE FUTURO TELEFONE >= 9
  res.status(409).json({mensage:"Telefone duplicado"})
  }



export {listAll, registerList}
