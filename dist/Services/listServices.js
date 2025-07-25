import { arrayInfoList, infoList } from "../schemas/List.schema";
import { listRepository } from "../repository/listRepository";
import { jwtInfo } from "./JwtUser/jwtUser";
import { redisCreate, redisListAll } from "./redis/redisConnection";
const listAll = async function (req, res) {
    try {
        const emailJwt = jwtInfo(req);
        // verificar se existe no red
        const redisAll = await redisListAll(emailJwt.idUser);
        if (redisAll) {
            res.status(200).json({ Contatos: redisAll });
            return;
        }
        const listRepo = await new listRepository().findAll(emailJwt.emailUser);
        const listRedis = await redisCreate(arrayInfoList.parse(listRepo), emailJwt.idUser);
        res.status(200).json({ Contatos: listRedis });
    }
    catch (e) {
        res.status(400).json({ message: "Erro no recebimento das informacoes" });
    }
};
// cria um contato na lista com base no id do Usario logado, vindo do token
const registerList = async function (req, res) {
    try {
        const contactList = infoList.parse(req.body);
        const userInfoJwt = jwtInfo(req);
        const createList = await new listRepository().createList(contactList, userInfoJwt.idUser);
        res.status(201).json(createList);
    }
    catch (e) {
        res.status(400).json({ message: "Verifique se as informacoes estao corretas" });
    }
};
const listOne = async (req, res) => {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoUnico = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoUnico == null) {
            res.status(400).json({ message: "Erro no banco de dados" });
            return;
        }
        res.status(200).json({ ContatoUnico });
    }
    catch (err) {
        res.status(400).json({ message: 'Erro no Servico' });
    }
};
const updateList = async (req, res) => {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoInfo = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoInfo == null) {
            res.status(400).json({ message: "Erro no Banco de dados verifique as informacoes" });
            return;
        }
        const AttContato = await new listRepository().updateUniqueTelephone(req.body, ContatoInfo.id);
        res.status(200).json({ AttContato });
    }
    catch (err) {
        res.status(400).json({ message: "Erro ao atualizar as informacoes" });
    }
};
const listDelete = async (req, res) => {
    try {
        const userInfoJwt = jwtInfo(req);
        const ContatoInfo = await new listRepository().findUniqueTelephone(req.params.telefone, userInfoJwt.idUser);
        if (ContatoInfo == null) {
            res.status(400).json({ message: "Erro no Banco de dados" });
            return;
        }
        const deleteContato = await new listRepository().deleteUniqueTelephone(ContatoInfo.id);
        res.status(200).json({ deleteContato });
    }
    catch (err) {
        res.status(400).json({ message: "Erro " });
    }
};
export { listAll, registerList, listOne, updateList, listDelete };
