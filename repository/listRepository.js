import {PrismaClient} from "@prisma/client"

export class listRepository{
constructor (){
    this.prisma = new PrismaClient()
  }

  //SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = 'dadadad@gmail.com';
  //fazer esse sql ao procura todas os telefone salvos 
  async findAll(email){
    return await this.prisma.$queryRaw`SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = ${email};`
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

