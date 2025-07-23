import { arrayInfoList, infoList } from "../schemas/List.schema"

import { listRepository } from "../repository/listRepository"

import { jwtInfo } from "./JwtUser/jwtUser"

import { redisCreate, redisListAll } from "./redis/redisConnection"

import { Response, Request } from "express"

import { z } from "zod"
// pegar o email do jwt
//  olhar no banco a lista
//  com base no email 
//
//
interface UserJwt {
  emailUser: string,
  idUser: number
}

type InfoList = z.infer<typeof infoList>

const listAll = async function (req: Request, res: Response): Promise<void> {

  try {
    const emailJwt: UserJwt = jwtInfo(req)
    // verificar se existe no red

    const redisAll: readonly [{ name: string, telefone: string, describe: string }] = await redisListAll(emailJwt.idUser)
    if (redisAll) {
      res.status(200).json({ Contato: redisAll })
      return
    }

    const listRepo = await new listRepository().findAll(emailJwt.emailUser)
    await redisCreate(arrayInfoList.parse(listRepo), emailJwt.idUser)

    res.status(200).json({ Contatos: listRepo })
  } catch (e) {
    res.status(400).json({ message: "Erro no recebimento das informacoes" })
  }

}

// cria um contato na lista com base no id do Usario logado, vindo do token
const registerList = async function (req: Request, res: Response): Promise<void> {

  try {

    const contactList: InfoList = infoList.parse(req.body)

    const userInfoJwt: UserJwt = jwtInfo(req)
    const createList = await new listRepository().createList(contactList, userInfoJwt.idUser)

    res.status(201).json(createList)

  }

  catch (e) {
    res.status(400).json({ message: "Verifique se as informacoes estao corretas" })
  }



}


const listOne = async (req, res) => {
  // estancia a classe 
  const list = new listRepository()
  // recebe o paramametro na requisicao 

  // pega as informacoes no jwt 
  const userInfoJwt = jwtInfo(req)
  // procura no banco com base no telefone e no jwt  
  await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser).then(
    (value) => {

      try {
        const contato = infoList.parse(value)
        return res.status(200).json({ Contato: contato })
      } catch (error) {
        res.status(400).json({ mensage: "erro na busca verifique se as informacoes estao certas" })
      }

    }

  )


}


const updateList = async (req, res) => {

  // estancia a classe 
  const list = new listRepository()
  // pega as informacoes no jwt 
  const userInfoJwt = jwtInfo(req)
  // pega as informacoes do contato desejado 
  const contatoInfo = await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)
  if (contatoInfo == null) {// verifica se ele existe
    return res.status(400).json({ message: "verifique se os dados estao corretos" })
  }


  // procura no banco com base no telefone e no jwt  
  await list.updateUniqueTelephone(req.body, contatoInfo.id).then(
    (value) => {
      try {
        const contatoInfo = infoList.parse(value)
        res.status(200).json({ message: contatoInfo })
      }
      catch (e) {
        res.status(400).json({ message: " Erro na execucao" })
      }

    },
    (error) => {
      res.status(400).json({ message: "verifique se os dados estao corretos" })
    }

  )
}


const listDelete = async (req, res) => {
  const list = new listRepository()
  const userInfoJwt = jwtInfo(req)

  const contatoInfo = await list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)
  if (contatoInfo == null) {// verifica se ele existe
    return res.status(400).json({ message: "verifique se os dados estao corretos" })
  }


  await list.deleteUniqueTelephone(contatoInfo.id).then(
    (value) => {
      res.status(200).json({ message: "Deletado com sucesso" })

    }
  )

}


export { listAll, registerList, listOne, updateList, listDelete }
