var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { arrayInfoList, infoList } from "../schemas/List.schema";
import { listRepository } from "../repository/listRepository";
import { jwtInfo } from "./JwtUser/jwtUser";
import { redisCreate, redisListAll } from "./redis/redisConnection";
const listAll = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emailJwt = jwtInfo(req);
            // verificar se existe no red
            const redisAll = yield redisListAll(emailJwt.idUser);
            if (redisAll) {
                res.status(200).json({ Contatos: redisAll });
                return;
            }
            const listRepo = yield new listRepository().findAll(emailJwt.emailUser);
            yield redisCreate(arrayInfoList.parse(listRepo), emailJwt.idUser);
            res.status(200).json({ Contatos: listRepo });
        }
        catch (e) {
            res.status(400).json({ message: "Erro no recebimento das informacoes" });
        }
    });
};
// cria um contato na lista com base no id do Usario logado, vindo do token
const registerList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contactList = infoList.parse(req.body);
            const userInfoJwt = jwtInfo(req);
            const createList = yield new listRepository().createList(contactList, userInfoJwt.idUser);
            res.status(201).json(createList);
        }
        catch (e) {
            res.status(400).json({ message: "Verifique se as informacoes estao corretas" });
        }
    });
};
const listOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoUnico = yield new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoUnico == null) {
            res.status(400).json({ message: "Erro no banco de dados" });
            return;
        }
        res.status(200).json({ ContatoUnico });
    }
    catch (err) {
        res.status(400).json({ message: 'Erro no Servico' });
    }
});
const updateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoInfo = yield new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoInfo == null) {
            res.status(400).json({ message: "Erro no Banco de dados verifique as informacoes" });
            return;
        }
        const AttContato = yield new listRepository().updateUniqueTelephone(req.body, ContatoInfo.id);
        res.status(200).json({ AttContato });
    }
    catch (err) {
        res.status(400).json({ message: "Erro ao atualizar as informacoes" });
    }
});
const listDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoInfo = yield new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoInfo == null) {
            res.status(400).json({ message: "Erro no Banco de dados" });
            return;
        }
        const deleteContato = yield new listRepository().deleteUniqueTelephone(ContatoInfo.id);
        res.status(200).json({ deleteContato });
    }
    catch (err) {
        res.status(400).json({ message: "Erro " });
    }
});
export { listAll, registerList, listOne, updateList, listDelete };
