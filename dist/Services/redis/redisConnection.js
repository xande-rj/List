var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createClient } from "redis";
import "dotenv/config";
const client = await createClient({
    url: `redis://:${process.env.redisPass}@127.0.0.1:6379`
});
client.on('error', (err) => console.log('Error Redis', err));
await client.connect();
const redisCreate = (list, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.set(`${id}`, JSON.stringify(list), { EX: 300 }); //expira apos 5 minutos ou 300 seg
    }
    catch (e) {
        return false;
    }
});
const redisListAll = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield client.get(`${id}`);
    if (data) {
        const array = JSON.parse(data);
        return array;
    }
    return false;
});
export { redisCreate, redisListAll };
