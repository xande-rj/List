import { PrismaClient } from "@prisma/client"

import { userCreateSchema, userInfoData } from "../schemas/Users.schema"

import { z } from 'zod'

type userCreateSchema = z.infer<typeof userCreateSchema>

export class userRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  // funcoa que cria um usuario
  async createUser(data: userCreateSchema): Promise<userCreateSchema> {
    return await this.prisma.user.create({ data })

  }
  // funcao que acha um usuario de senha unica
  async findUniqueUser(data: any): Promise<userInfoData | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: data,
      },
      select: {
        id: true,
        email: true,
        senha: true,

      }
    })
  }

  async updateUser(userEmail: string, data) {
    return await this.prisma.user.update({
      where: {
        email: userEmail
      },
      data: data
    })
  }

  async deleteUser(userEmail, userId) {
    await this.prisma.list.deleteMany({
      where: {
        authorId: userId,
      }
    })
    return await this.prisma.user.delete({
      where: {
        email: userEmail
      }
    })
  }
}
