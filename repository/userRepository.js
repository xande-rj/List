import {PrismaClient} from "@prisma/client"

export class userRepository{
  constructor(){
    this.prisma = new PrismaClient()
  }

  // funcoa que cria um usuario
async createUser(data){
    return await this.prisma.user.create({data})
  
  }
// funcao que acha um usuario de senha unica
  async findUniqueUser(data){
      return await this.prisma.user.findUnique({
      where:{
        email: data,
      },
      select:{
        id:true,
        email:true,
        senha:true,

      }
    })
  }
}
