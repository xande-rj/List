
import bcrypt from "bcrypt";

const saltRounds = 10;

const cryptorPass = async (password) => {
  try {
    const passHash = await bcrypt.hash(password, saltRounds);
    return passHash;
  } catch (err) {
    console.error("Erro ao gerar hash da senha:", err);
    throw err;
  }
};


export {cryptorPass}
