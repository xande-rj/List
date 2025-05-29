import NodeMailer from "nodemailer"


import 'dotenv/config'

const emailUser = process.env.emailUser



function verificarEmail  (email){
if (emailUser) {
   console.log("asdasdas")
  } 


  return true 
}

export {verificarEmail}
