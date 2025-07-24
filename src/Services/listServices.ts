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
      res.status(200).json({ Contatos: redisAll })
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


const listOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfoJwt: UserJwt = jwtInfo(req)

    const ContatoUnico: { name: string, telefone: string, describe: string | null, authorId: number } | null = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)


    if (ContatoUnico == null) {
      res.status(400).json({ message: "Erro no banco de dados" })
      return
    }
    res.status(200).json({ ContatoUnico })
  }
  catch (err) {
    res.status(400).json({ message: 'Erro no Servico' })
  }
}


const updateList = async (req: Request, res: Response): Promise<void> => {

  try {
    const userInfoJwt: UserJwt = jwtInfo(req)

    const ContatoInfo: { name: string, telefone: string, describe: string | null, authorId: number, id: number } | null = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)

    if (ContatoInfo == null) {
      res.status(400).json({ message: "Erro no Banco de dados verifique as informacoes" })
      return
    }

    const AttContato: { name: string, updateAt: Date, telefone: string, describe: string | null } = await new listRepository().updateUniqueTelephone(req.body, ContatoInfo.id)

    res.status(200).json({ AttContato })
  }
  catch (err) {
    res.status(400).json({ message: "Erro ao atualizar as informacoes" })
  }


}


const listDelete = async (req: Request, res: Response): Promise<void> => {
  try {

    const userInfoJwt: UserJwt = jwtInfo(req)

    const ContatoInfo: { name: string, telefone: string, describe: string | null, authorId: number, id: number } | null = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser)

    if (ContatoInfo == null) {
      res.status(400).json({ message: "Erro no Banco de dados" })
      return
    }

    const deleteContato = await new listRepository().deleteUniqueTelephone(ContatoInfo.id)

    res.status(200).json({ deleteContato })
  }
  catch (err) {
    res.status(400).json({ message: "Erro " })
  }
}


export { listAll, registerList, listOne, updateList, listDelete }
