import {PrismaClient} from "@prisma/client"

export class listRepository{
constructor (){
    this.prisma = new PrismaClient()
  }
  
  async findAll(){
    return await this.prisma.list.findMany()

  }
  async createList(data){
    return await this.prisma.list.create({data})

  }

  async findUniqueTelephone(data){

    return await this.prisma.list.findFist({
      where:{
        telefone: data
      }
    })

  }
}

