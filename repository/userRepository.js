import {PrismaClient} from "@prisma/client"

export class userRepository{
  constructor(){
    this.prisma = new PrismaClient()
  }
async createUser(data){
    return await this.prisma.user.create({data})

  }
}
