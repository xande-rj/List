import {z} from "zod"

const infoList = z.object({
  name :z.string().min(2),
  telefone:z.number().int(),
  describe:z.string().optional()
})

const arrayInfoList = z.array(infoList)


export {infoList, arrayInfoList}
