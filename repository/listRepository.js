import {PrismaClient} from "@prisma/client"

export class listRepository{
constructor (){
    this.prisma = new PrismaClient()
  }
  
  async findAll(){
    return await this.prisma.list.findMany()

  }
  async createList(data){
    console.log(data)
    return await this.prisma.list.create({
      data:{
        name:data.name,
        telefone:data.telefone,
        describe: data.describe,
        authorId: data.author
      }
    })

  }

  async findUniqueTelephone(data){

    return await this.prisma.list.findFirst({
      where:{
        telefone: data
      }
    })

  }
}

