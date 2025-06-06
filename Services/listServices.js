
import {arrayInfoList, infoList} from "../schemas/Lista.schema.js"
import {listRepository} from "../repository/listRepository.js"

// pegar o email do jwt
//  olhar no banco a lista 
const listAll = async function (req,res){
  const list =  new listRepository()

  const listRepo = await list.findAll()


  res.status(200).json({messa:listRepo})
}

const registerList = async function (req,res){
  const list = new listRepository()

  if( await list.findUniqueTelephone(parseInt(req.body.telefone)) == null){
console.log(req.body)


      const listBody = infoList.parse(req.body)
    //aqui eu posso registra no banco 
      const newList = await list.createList(listBody)

      return res.status(201).send(listBody)

  }
  //TESTE FUTURO TELEFONE >= 9
  res.status(409).json({mensage:"Telefone duplicado"})
  }



export {listAll, registerList}
