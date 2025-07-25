import { createClient } from "redis"


import "dotenv/config"

import { arrayInfoList } from "../../schemas/List.schema"
import z from "zod"

type ArrayContato = z.infer<typeof arrayInfoList>



const client = createClient({
  url: `redis://:${process.env.redisPass}@127.0.0.1:6379`
})

client.on('error', (err) => console.log('Error Redis', err))

await client.connect()

const redisListAll = async (id: number): Promise<[{ name: string, telefone: string, describe: string }] | boolean> => {

  const data = await client.get(`${id}`)

  if (data) {
    return JSON.parse(data)
  }
  return false
}


const redisCreate = async (list: ArrayContato, id: number):
  Promise<[{ name: string, telefone: string, describe: string }] | boolean> => {

  try {
    const test = await client.set(`${id}`, JSON.stringify(list), { EX: 300 })//expira apos 5 minutos ou 300 seg

    console.log(test)
    if (test) {
      return await redisListAll(id)
    }
    else {

      throw new Error
    }
  }
  catch (e) {
    return false
  }

}
export { redisCreate, redisListAll }
