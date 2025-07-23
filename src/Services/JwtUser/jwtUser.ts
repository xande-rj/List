import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import { Request, Response, NextFunction } from "express"
//passa pelo .env

// cria um token com meu segrdo 
const secret = process.env.secretJwt

const jwtToken = (emailUser?: string, idUser?: number): string => {
  try {
    const result = jwt.sign({ emailUser, idUser }, secret!)
    return result
  }
  catch (err) {
    throw err
  }
}


// Protecao de entrada de rotas 
// verifica se o token foi feito com meu segredo 
const jwtProtect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader: string | undefined = req.headers.authorization;
  const token: string | undefined = authHeader?.split(" ")[1];

  if (token == undefined) res.status(401).json({ message: "Acesso negado!" });
  try {
    jwt.verify(token!, secret!)
    next()
  }
  catch (e) {
    res.status(400).json({ message: "O Token é inválido!" })
  }
}


interface UserJwt extends JwtPayload {
  emailUser: string,
  idUser: number
}
// pega as informacoes do token
// mais facil criar uma funcao para pegar essas informacoes 
const jwtInfo = (req: Request): UserJwt => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    return jwt.verify(token!, secret!) as UserJwt
  }
  catch (err) {
    throw new Error
  }
}
export { jwtToken, jwtProtect, jwtInfo }
