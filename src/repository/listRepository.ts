import {PrismaClient} from "@prisma/client"

export class listRepository{
constructor (){
    this.prisma = new PrismaClient()
  }

  //fazer esse sql ao procura todas os telefone salvos pelo email 
  async findAll(email){
    return await this.prisma.$queryRaw`SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = ${email};`
} 



  async createList(data,Id){
    return await this.prisma.list.create({
      data:{
        name:data.name,
        telefone:data.telefone,
        describe: data.describe,
        authorId: Id
      }
    })

  }

  async findUniqueTelephone(data, Id){

    return await this.prisma.list.findFirst({
      where:{
        telefone: data,
        authorId: Id
      },
    })

  }

  async updateUniqueTelephone(dados,Id){
   return await this.prisma.list.update({
      where:{
        id:Id
      },
      data:dados
    })
  }

  async deleteUniqueTelephone(Id){
    return await this.prisma.list.delete({
      where:{
        id:Id
      }
    })
  }
}

