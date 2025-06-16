import {createClient} from "redis"

import "dotenv/config"

const client = await createClient({
  url: `redis://:${process.env.redisPass}@127.0.0.1:6379`
})

client.on('error', (err)=>console.log('Error Redis',err))

const redisListAll = async ()=>{
await client.connect()

const lista = [
  { name: "aleax", telefone: "33160961", describe: "" },
  { name: "aleax", telefone: "33160962", describe: "" },
  /* ... */
];

await client.set('minhalista', JSON.stringify(lista))


const data = await client.get('minhalista')

const array = JSON.parse(data)
console.log(array)

await client.quit()
}

redisListAll()
