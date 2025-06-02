
import bcrypt from "bcrypt";

const saltRounds = 10;
// funcao async 
const cryptorPass = async (password) => {
 // esse try catch e se houver algum erro 
  try {
    //bcrypt.hash e uma promise 
    const passHash = await bcrypt.hash(password, saltRounds);
    return passHash;
  } catch (err) {
    console.error("Erro ao gerar hash da senha:", err);
    throw err;
  }
};
// funcao retorna uma promise que precisa de then e catch

export {cryptorPass}
