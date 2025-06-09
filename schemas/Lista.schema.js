import {z} from "zod"

const infoList = z.object({
  name :z.string().min(2),
  telefone:z.string().min(8),
  describe:z.string().optional().default("")
})

const arrayInfoList = z.array(infoList)


export {infoList, arrayInfoList}
