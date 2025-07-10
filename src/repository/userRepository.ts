import { PrismaClient } from "@prisma/client"

import { userCreateSchema, userInfoData, userUpdatePassword, userCreate } from "../schemas/Users.schema"

import { z } from 'zod'

type userCreateSchema = z.infer<typeof userCreateSchema>

type updatedater = z.infer<typeof userUpdatePassword>

type userCreate = z.infer<typeof userCreate>

export class userRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  // funcoa que cria um usuario
  async createUser(data: userCreateSchema): Promise<userCreate> {
    return await this.prisma.user.create({
      data,
      omit: {
        senha: true,
        createdAt: true,
        updateAt: true,
        id: true
      }
    })

  }
  // funcao que acha um usuario de senha unica
  async findUniqueUser(data: string): Promise<userInfoData | null> {
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

  async updateUser(userEmail: string, data: updatedater): Promise<updatedater> {
    return await this.prisma.user.update({
      where: {
        email: userEmail
      },
      data: data,
      omit: {
        id: true,
        senha: true,
        updateAt: true,
        createdAt: true
      }
    })
  }

  async deleteUser(userEmail: string, userId: number): Promise<userCreate> {
    await this.prisma.list.deleteMany({
      where: {
        authorId: userId,
      }
    })
    return await this.prisma.user.delete({
      where: {
        email: userEmail
      },
      omit: {
        id: true,
        senha: true,
        updateAt: true,
        createdAt: true
      }
    })
  }
}
