import jwt from "jsonwebtoken"

import "dotenv/config"
import { NextFunction } from "express"
//segredo
//passa pelo .env

// cria um token com meu segrdo 
const secret = process.env.secretJwt

const jwtToken = (emailUser?: string, idUser?: number): string => {
  try {
    const result = jwt.sign({ emailUser, idUser }, secret)
    return result
  }
  catch (err) {
    throw err
  }
}


// Protecao de entrada de rotas 
// verifica se o token foi feito com meu segredo 
const jwtProtect = (req: Request, res: Response, next: NextFunction): boolean => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado!" });
  try {
    jwt.verify(token, secret)
    next()
  }
  catch (e) {
    res.status(400).json({ message: "O Token é inválido!" })
  }

}


// pega as informacoes do token
// mais facil criar uma funcao para pegar essas informacoes 
const jwtInfo = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const info = jwt.verify(token, secret)
  return info
}

export { jwtToken, jwtProtect, jwtInfo }
