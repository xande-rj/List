import {z} from "zod"

// dois schemas, o primeiro verificacao
// o segundo e de informacos que ira retornar ao usuario ao cadastro 


const userCreateSchema = z.object({
  nome :z.string("aqui").min(3), //senha antes de criptografia
  senha: z.string().min(8),
  email : z.string().email(),
  telefone : z.number().int(),
  sexo : z.string().optional(),
  idade : z.number().int().optional(),
  cidade : z.string().optional()
}) 

export {userCreateSchema}
