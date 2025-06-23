import {z} from "zod"

// dois schemas, o primeiro verificacao
// o segundo e de informacos que ira retornar ao usuario ao cadastro 

// ERRO : {invalid_type_error: mensagem }
const userCreateSchema = z.object({ nome :z.string({invalid_type_error: "Por favor verifique que o nome esta escrito de forma correta"})
  .min(3), 
  //senha antes de criptografia
  senha: z.string({invalid_type_error: "verifique se a senha esta correta"}).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,"A senha e fraca").min(8),
  email : z.string({invalid_type_error: "Verique se o email digitado esta correto"}).email(),
  telefone : z.string({invalid_type_error: "Por favor se o telefone digitado esta correto"}).min(11),
  sexo : z.string({invalid_type_error: "verifique se o sexo digita esta correto"}).min(3),
  idade : z.number({ invalid_type_error: "Por favor digite a idade corretamente"}).int(),
  cidade : z.string({invalid_type_error: "verifique se a cidade esta correta"}).min(10,"Verifique se a cidade digitada esta com o nome completo")
}) 

const userLoginSchema = z.object({
  email : z.string({invalid_type_error: "Verique se o email digitado esta correto"}).email(),
  senha: z.string({invalid_type_error: "verifique se a senha esta correta"}).min(8),
})

const userUpdatePassword = z.string({
  senha:z.string({invalid_type_error:"Verique se a senha esta digitada corretamente"}).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,"A senha e fraca").min(8),
})

export {userCreateSchema, userLoginSchema, userUpdatePassword}
