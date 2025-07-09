var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userRepository } from "../repository/userRepository.ts";
import { userCreateSchema, userLoginSchema, userUpdatePassword } from "../schemas/Users.schema.ts";
import { cryptorPass, comparePass } from "./CryptorPass/cryptorPass.ts";
import { jwtToken, jwtInfo } from "./JwtUser/jwtUser.ts";
import { ZodError } from 'zod';
const createUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // verifica no zod
            const userBody = userCreateSchema.parse(req.body);
            // criptografia a senha
            userBody.senha = yield cryptorPass(userBody.senha);
            //envia para o banco 
            const newUser = yield new userRepository().createUser(userBody);
            //retorna o usuario criado
            res.status(201).json(newUser);
        }
        catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ message: "erro no tipo" });
            }
            res.status(400).json({ message: "erro de Criacao" });
        }
    });
};
const loginUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // recebe o email e a senha e compara com a do banco 
        // devolve um jwt que permite o acesso a lista
        const Users = new userRepository();
        let User;
        // verifica se o as informacao sao as certas 
        try {
            User = userLoginSchema.parse(req.body);
        }
        catch (e) {
            res.status(404).send("verifique se os campos estao digitados corretamente");
        }
        let userInfo;
        // pega as informacoes do banco se existir o usuario
        yield Users.findUniqueUser(User.email)
            .then((value) => {
            // banco retorna null se nao existir usuario
            if (value == null) {
                return res.status(404).send("senha ou usuario incorretos");
            }
            userInfo = value;
        });
        // verificar se a senha esta corretamente digitada
        // retorna true se sim e um token jwt
        // retorna false se nao e um erro 
        yield comparePass(User.senha, userInfo.senha)
            .then((valor) => {
            // verifica a volta da funcao de criptografia
            if (!valor)
                return res.status(406).send("senha ou usuario incorretos");
            //retorna o jwt 
            const token = jwtToken(userInfo.email, userInfo.id);
            return res.status(200).json({ message: `Autenticação realizado com sucesso ${token} ` });
        });
    });
};
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // pegar o email do usuario
    const userInfo = jwtInfo(req);
    const User = new userRepository();
    let userBody = req.body;
    // verifica se tem senha para altera
    if (userBody.senha) {
        try {
            userBody.senha = userUpdatePassword.parse(userBody.senha);
        }
        catch (e) {
            return res.status(400).json({ message: 'verifique a senha esta correta' });
        }
        yield cryptorPass(userBody.senha)
            .then((hash) => {
            userBody.senha = hash;
        })
            .catch((err) => {
            return res.status(500).json({ message: "Erro no servidor tente novamente mais tarde" });
        });
    }
    yield User.updateUser(userInfo.emailUser, req.body).then((value) => {
        res.status(200).json({ message: "Sucesso" });
    });
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = new userRepository();
    const userBody = req.body;
    const userInfo = jwtInfo(req);
    let userInfoData;
    // pega as informacoes do banco se existir o usuario
    yield User.findUniqueUser(userInfo.emailUser)
        .then((value) => {
        // banco retorna null se nao existir usuario
        if (value == null) {
            return res.status(404).json({ message: "senha ou usuario incorretos" });
        }
        userInfoData = value;
    });
    // verificar se a senha esta corretamente digitada
    yield comparePass(userBody.senha, userInfoData.senha)
        .then((valor) => {
        // verifica a volta da funcao de criptografia
        if (!valor)
            return res.status(406).json({ message: "senha ou usuario incorretos" });
    });
    yield User.deleteUser(userInfo.emailUser, userInfo.idUser).then((valor) => {
        return res.status(200).json({ message: "Usuario deletado com sucesso" });
    });
});
export { createUser, loginUser, updateUser, deleteUser };
