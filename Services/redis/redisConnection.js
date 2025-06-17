import {createClient} from "redis"

import "dotenv/config"

const client = await createClient({
  url: `redis://:${process.env.redisPass}@127.0.0.1:6379`
})

client.on('error', (err)=>console.log('Error Redis',err))

await client.connect()

const redisCreate = async (list,id)=>{

try{
  await client.set(`${id}`,JSON.stringify(list),{EX:300 })//expira apos 5 minutos ou 300 seg
}
catch(e){
  return false
}

}



const redisListAll = async (id)=>{


const data = await client.get(`${id}`)

if(data){
const array = JSON.parse(data)
return array
}
return false
}

export{redisCreate,redisListAll}
