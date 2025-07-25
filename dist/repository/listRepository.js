import { PrismaClient } from "@prisma/client";
export class listRepository {
    constructor() {
        this.prisma = new PrismaClient();
    }
    //fazer esse sql ao procura todas os telefone salvos pelo email 
    async findAll(email) {
        return await this.prisma.$queryRaw `SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = ${email};`;
    }
    async createList(data, Id) {
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
        });
    }
    async findUniqueTelephone(data, Id) {
        return await this.prisma.list.findFirst({
            where: {
                telefone: data,
                authorId: Id
            }, omit: {
                createdAt: true,
                updateAt: true,
            }
        });
    }
    async updateUniqueTelephone(dados, Id) {
        return await this.prisma.list.update({
            where: {
                id: Id
            },
            data: dados,
            omit: {
                authorId: true,
                createdAt: true,
                id: true
            }
        });
    }
    async deleteUniqueTelephone(Id) {
        return await this.prisma.list.delete({
            where: {
                id: Id
            },
            omit: {
                authorId: true
            }
        });
    }
}
