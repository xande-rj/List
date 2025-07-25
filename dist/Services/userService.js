import { userRepository } from "../repository/userRepository";
import { userCreateSchema, userLoginSchema, userUpdatePassword } from "../schemas/Users.schema";
import { cryptorPass, comparePass } from "./CryptorPass/cryptorPass";
import { jwtToken, jwtInfo } from "./JwtUser/jwtUser";
import { ZodError } from "zod";
const createUser = async function (req, res) {
    try {
        // verifica no zod
        const userCorpo = userCreateSchema.parse(req.body);
        // criptografia a senha
        userCorpo.senha = await cryptorPass(userCorpo.senha);
        //envia para o banco 
        const newUser = await new userRepository().createUser(userCorpo);
        //retorna o usuario criado
        res.status(201).json(newUser);
    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ erro: "erro no tipo" });
        }
        res.status(400).json({ erro: "erro de Criacao verifique os campos estao corretos" });
    }
};
const loginUser = async function (req, res) {
    // recebe o email e a senha e compara com a do banco 
    // devolve um jwt que permite o acesso a lista
    try {
        const userLogin = userLoginSchema.parse(req.body);
        const userInfo = await new userRepository().findUniqueUser(userLogin.email);
        const comparePassUser = await comparePass(userLogin.senha, userInfo === null || userInfo === void 0 ? void 0 : userInfo.senha);
        if (!comparePassUser) {
            res.status(400).json({ erro: "senha errada" });
            return;
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
};
const updateUser = async (req, res) => {
    // recebe as informacoes pelo jwt 
    // procura e atualiza o as informacoes do usuario
    try {
        const userInfo = jwtInfo(req);
        const userBody = userUpdatePassword.parse(req.body);
        if (userBody.senha) {
            const passCryptor = await cryptorPass(userBody.senha);
            if (passCryptor) {
                userBody.senha = passCryptor;
            }
        }
        await new userRepository().updateUser(userInfo.emailUser, userBody);
        res.status(201).json({ message: `Informacoes alteradas com sucesso` });
    }
    catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ erro: `${err.issues[0].message}` });
        }
        res.status(400).json({ erro: 'Erro ao atualiza usuario' });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userBody = req.body;
        const userInfo = jwtInfo(req);
        const userInfoData = await new userRepository().findUniqueUser(userInfo.emailUser);
        const PassValidator = await comparePass(userBody.senha, userInfoData === null || userInfoData === void 0 ? void 0 : userInfoData.senha);
        if (!PassValidator) {
            res.status(400).json({ erro: "verifique a senha" });
        }
        const deleteResult = await new userRepository().deleteUser(userInfo.emailUser, userInfo.idUser);
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
};
export { createUser, loginUser, updateUser, deleteUser };
