var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { arrayInfoList, infoList } from "../schemas/Lista.schema.js";
import { listRepository } from "../repository/listRepository.js";
import { jwtInfo } from "./JwtUser/jwtUser.js";
import { redisCreate, redisListAll } from "./redis/redisConnection.js";
// pegar o email do jwt
//  olhar no banco a lista
//  com base no email 
const listAll = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = new listRepository();
        const emailJwt = jwtInfo(req);
        // verificar se existe no red
        const redisAll = yield redisListAll(emailJwt.idUser);
        if (redisAll) {
            return res.status(200).json({ Contato: redisAll });
        }
        const listRepo = yield list.findAll(emailJwt.emailUser);
        let listArraySchema;
        try {
            listArraySchema = arrayInfoList.parse(listRepo);
            yield redisCreate(listArraySchema, emailJwt.idUser);
        }
        catch (e) {
            res.status(400).json({ message: "Erro no recebimento das informacoes" });
        }
        res.status(200).json({ Contatos: listArraySchema });
    });
};
// cria um contato na lista com base no id do Usario logado, vindo do token
const registerList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = new listRepository();
        let contactList;
        try {
            contactList = infoList.parse(req.body);
        }
        catch (e) {
            res.status(400).json({ message: "Verifique se as informacoes estao corretas" });
        }
        const userInfoJwt = jwtInfo(req);
        yield list.createList(contactList, userInfoJwt.idUser).then((value) => {
            return res.status(201).json({ Contato: value });
        }, (error) => {
            return res.status(400).json({ mensage: "Erro ao cadastra o contato" });
        });
    });
};
const listOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // estancia a classe 
    const list = new listRepository();
    // recebe o paramametro na requisicao 
    // pega as informacoes no jwt 
    const userInfoJwt = jwtInfo(req);
    // procura no banco com base no telefone e no jwt  
    yield list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser).then((value) => {
        try {
            const contato = infoList.parse(value);
            return res.status(200).json({ Contato: contato });
        }
        catch (error) {
            res.status(400).json({ mensage: "erro na busca verifique se as informacoes estao certas" });
        }
    });
});
const updateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // estancia a classe 
    const list = new listRepository();
    // pega as informacoes no jwt 
    const userInfoJwt = jwtInfo(req);
    // pega as informacoes do contato desejado 
    const contatoInfo = yield list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
    if (contatoInfo == null) { // verifica se ele existe
        return res.status(400).json({ message: "verifique se os dados estao corretos" });
    }
    // procura no banco com base no telefone e no jwt  
    yield list.updateUniqueTelephone(req.body, contatoInfo.id).then((value) => {
        try {
            const contatoInfo = infoList.parse(value);
            res.status(200).json({ message: contatoInfo });
        }
        catch (e) {
            res.status(400).json({ message: " Erro na execucao" });
        }
    }, (error) => {
        res.status(400).json({ message: "verifique se os dados estao corretos" });
    });
});
const listDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = new listRepository();
    const userInfoJwt = jwtInfo(req);
    const contatoInfo = yield list.findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
    if (contatoInfo == null) { // verifica se ele existe
        return res.status(400).json({ message: "verifique se os dados estao corretos" });
    }
    yield list.deleteUniqueTelephone(contatoInfo.id).then((value) => {
        res.status(200).json({ message: "Deletado com sucesso" });
    });
});
export { listAll, registerList, listOne, updateList, listDelete };
