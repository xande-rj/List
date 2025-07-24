var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
export class listRepository {
    constructor() {
        this.prisma = new PrismaClient();
    }
    //fazer esse sql ao procura todas os telefone salvos pelo email 
    findAll(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$queryRaw `SELECT "List"."name", "List"."telefone", "List"."describe" FROM "List" INNER JOIN "User"  ON "List"."authorId" = "User"."id"  WHERE "User".email = ${email};`;
        });
    }
    createList(data, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.list.create({
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
        });
    }
    findUniqueTelephone(data, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.list.findFirst({
                where: {
                    telefone: data,
                    authorId: Id
                }, omit: {
                    createdAt: true,
                    updateAt: true,
                }
            });
        });
    }
    updateUniqueTelephone(dados, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.list.update({
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
        });
    }
    deleteUniqueTelephone(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.list.delete({
                where: {
                    id: Id
                },
                omit: {
                    authorId: true
                }
            });
        });
    }
}
