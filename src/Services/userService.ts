import { Request, Response } from "express"

import { userRepository } from "../repository/userRepository"

import { userCreateSchema, userLoginSchema, userUpdatePassword, userInfoData, userUpdate } from "../schemas/Users.schema"

import { cryptorPass, comparePass } from "./CryptorPass/cryptorPass"

import { jwtToken, jwtInfo } from "./JwtUser/jwtUser"

import { z, ZodError } from "zod";

type Usuario = z.infer<typeof userCreateSchema>

type usuarioLoginSchema = z.infer<typeof userLoginSchema>

type userUpdate = z.infer<typeof userUpdatePassword>

interface UserJwt {
  emailUser: string,
  idUser: number
}

interface Password {
  senha: string
}

const createUser = async function (req: Request, res: Response<Usuario | { message: string } | { erro: string }>): Promise<void> {

  try {

    // verifica no zod
    const userCorpo: Usuario = userCreateSchema.parse(req.body)

    // criptografia a senha
    userCorpo.senha = await cryptorPass(userCorpo.senha)

    //envia para o banco 
    const newUser: Usuario = await new userRepository().createUser(userCorpo)

    //retorna o usuario criado
    res.status(201).json(newUser)
  }
  catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ erro: "erro no tipo" })
    }
    console.log(err)
    res.status(400).json({ erro: "erro de Criacao" })
  }

}


const loginUser = async function (req: Request, res: Response<{ message: string } | { erro: string }>): Promise<void> {
  // recebe o email e a senha e compara com a do banco 
  // devolve um jwt que permite o acesso a lista


  try {
    const userLogin: usuarioLoginSchema = userLoginSchema.parse(req.body)
    const userInfo: userInfoData | null = await new userRepository().findUniqueUser(userLogin.email)
    const comparePassUser: boolean = await comparePass(userLogin.senha, userInfo?.senha)


    if (!comparePassUser) {
      res.status(400).json({ erro: "senha errada" })
    }

    const token: string = jwtToken(userInfo?.email, userInfo?.id)

    res.status(200).json({ message: `Autenticação realizado com sucesso : ${token}` })
  }
  catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ erro: `${err.issues[0].message}` })
    }
    res.status(400).json({ erro: "erro" })
  }

}

const updateUser = async (req: Request, res: Response<{ message: string } | { erro: string }>): Promise<void> => {


  // recebe as informacoes pelo jwt 
  // procura e atualiza o as informacoes do usuario


  try {
    const userInfo: UserJwt = jwtInfo(req)

    const userBody: userUpdate = userUpdatePassword.parse(req.body)
    if (userBody.senha) {
      const passCryptor = await cryptorPass(userBody.senha)
      if (passCryptor) {
        userBody.senha = passCryptor
      }
    }

    await new userRepository().updateUser(userInfo.emailUser, userBody)
    res.status(201).json({ message: `Informacoes alteradas com sucesso` })
  }
  catch (err) {

    if (err instanceof ZodError) {
      res.status(400).json({ erro: `${err.issues[0].message}` })
    }
    res.status(400).json({ erro: 'verifique a senha esta correta' })
  }

}


const deleteUser = async (req: Request, res: Response<{ message: string } | { erro: string }>): Promise<void> => {

  try {
    const userBody: Password = req.body

    const userInfo: UserJwt = jwtInfo(req)

    const userInfoData = await new userRepository().findUniqueUser(userInfo.emailUser)

    // verificar se a senha esta corretamente digitada
    await comparePass(userBody.senha, userInfoData.senha)
      .then((valor) => {
        // verifica a volta da funcao de criptografia
        if (!valor) return res.status(406).json({ message: "senha ou usuario incorretos" })
      })

    await User.deleteUser(userInfo.emailUser, userInfo.idUser).then((valor) => {
      return res.status(200).json({ message: "Usuario deletado com sucesso" })
    })
  }

}
export { createUser, loginUser, updateUser, deleteUser }
