var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
const saltRounds = 10;
// funcao async 
const cryptorPass = (password) => __awaiter(void 0, void 0, void 0, function* () {
    // esse try catch e se houver algum erro 
    try {
        //bcrypt.hash e uma promise 
        const passHash = yield bcrypt.hash(password, saltRounds);
        return passHash;
    }
    catch (err) {
        console.error("Erro ao gerar hash da senha:", err);
        throw err;
    }
});
// funcao retorna uma promise que precisa de then e catch
//
const comparePass = (password, passwordHash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bcrypt.compare(password, passwordHash);
        return result;
    }
    catch (e) {
        console.log("erro na comparacao" + e);
        throw err;
    }
});
export { cryptorPass, comparePass };
