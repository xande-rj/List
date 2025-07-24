
import bcrypt from "bcrypt";

const saltRounds: number = 10;
// funcao async 
const cryptorPass = async (password: string): Promise<string> => {
  // esse try catch e se houver algum erro 
  try {
    //bcrypt.hash e uma promise 
    const passHash: string = await bcrypt.hash(password, saltRounds);
    return passHash;
  } catch (err) {
    console.error("Erro ao gerar hash da senha:", err);
    throw err;
  }
};

// funcao retorna uma promise que precisa de then e catch
//
const comparePass = async (password: string, passwordHash: string): Promise<boolean> => {
  try {
    const result: boolean = await bcrypt.compare(password, passwordHash)
    return result
  }
  catch (err) {
    console.log("erro na comparacao" + err)
    throw err
  }
}

export { cryptorPass, comparePass }
