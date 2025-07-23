import { PrismaClient } from "@prisma/client"

import { infoList } from "../schemas/List.schema"

import { z } from "zod"

type InfoList = z.infer<typeof infoList>


export class listRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  //fazer esse sql ao procura todas os telefone salvos pelo email 
  async findAll(email: string): Promise<InfoList> {
    return await this.prisma.$queryRaw`SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = ${email};`
  }


  async createList(data: InfoList, Id: number): Promise<{ name: string, telefone: string, describe: string | null }> {
    return await this.prisma.list.create({
      data: {
        name: data.name,
        telefone: data.telefone,
        describe: data.describe,
        authorId: Id
      },
      omit: {
        authorId: true,
        id: true,
        updateAt: true,
        createdAt: true
      }
    })

  }

  async findUniqueTelephone(data, Id) {

    return await this.prisma.list.findFirst({
      where: {
        telefone: data,
        authorId: Id
      },
    })

  }

  async updateUniqueTelephone(dados, Id) {
    return await this.prisma.list.update({
      where: {
        id: Id
      },
      data: dados
    })
  }

  async deleteUniqueTelephone(Id) {
    return await this.prisma.list.delete({
      where: {
        id: Id
      }
    })
  }
}

