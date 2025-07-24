var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userRepository } from "../repository/userRepository";
import { userCreateSchema, userLoginSchema, userUpdatePassword } from "../schemas/Users.schema";
import { cryptorPass, comparePass } from "./CryptorPass/cryptorPass";
import { jwtToken, jwtInfo } from "./JwtUser/jwtUser";
import { ZodError } from "zod";
const createUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // verifica no zod
            const userCorpo = userCreateSchema.parse(req.body);
            // criptografia a senha
            userCorpo.senha = yield cryptorPass(userCorpo.senha);
            //envia para o banco 
            const newUser = yield new userRepository().createUser(userCorpo);
            //retorna o usuario criado
            res.status(201).json(newUser);
        }
        catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ erro: "erro no tipo" });
            }
            res.status(400).json({ erro: "erro de Criacao verifique os campos estao corretos" });
        }
    });
};
const loginUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // recebe o email e a senha e compara com a do banco 
        // devolve um jwt que permite o acesso a lista
        try {
            const userLogin = userLoginSchema.parse(req.body);
            const userInfo = yield new userRepository().findUniqueUser(userLogin.email);
            const comparePassUser = yield comparePass(userLogin.senha, userInfo === null || userInfo === void 0 ? void 0 : userInfo.senha);
            if (!comparePassUser) {
                res.status(400).json({ erro: "senha errada" });
            }
            const token = jwtToken(userInfo === null || userInfo === void 0 ? void 0 : userInfo.email, userInfo === null || userInfo === void 0 ? void 0 : userInfo.id);
            res.status(200).json({ message: `Autenticação realizado com sucesso : ${token}` });
        }
        catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ erro: `${err.issues[0].message}` });
            }
            res.status(400).json({ erro: "erro" });
        }
    });
};
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // recebe as informacoes pelo jwt 
    // procura e atualiza o as informacoes do usuario
    try {
        const userInfo = jwtInfo(req);
        const userBody = userUpdatePassword.parse(req.body);
        if (userBody.senha) {
            const passCryptor = yield cryptorPass(userBody.senha);
            if (passCryptor) {
                userBody.senha = passCryptor;
            }
        }
        yield new userRepository().updateUser(userInfo.emailUser, userBody);
        res.status(201).json({ message: `Informacoes alteradas com sucesso` });
    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ erro: `${err.issues[0].message}` });
        }
        res.status(400).json({ erro: 'Erro ao atualiza usuario' });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userBody = req.body;
        const userInfo = jwtInfo(req);
        const userInfoData = yield new userRepository().findUniqueUser(userInfo.emailUser);
        const PassValidator = yield comparePass(userBody.senha, userInfoData === null || userInfoData === void 0 ? void 0 : userInfoData.senha);
        if (!PassValidator) {
            res.status(400).json({ erro: "verifique a senha" });
        }
        const deleteResult = yield new userRepository().deleteUser(userInfo.emailUser, userInfo.idUser);
        if (!deleteResult) {
            res.status(400).json({ erro: "verifique a senha" });
        }
        res.status(200).json({ message: "Usuario deletado com sucesso" });
    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ erro: `${err.issues[0].message}` });
        }
        res.status(400).json({ erro: 'verifique a senha esta correta' });
    }
});
export { createUser, loginUser, updateUser, deleteUser };
