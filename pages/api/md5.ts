import CryptoJS from "crypto-js"
import { NextApiRequest, NextApiResponse } from "next"
import { readParam } from "../../utils/readParam"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        const {plaintext} = req.query
        const plaintextValue = readParam(plaintext)

        try{
            res.status(200).json({
                plaintext: plaintextValue,
                hash: CryptoJS.MD5(plaintextValue).toString()
            })
        }catch(e){
            res.status(400).send({
                message: e.toString()
            })
        }  
    }else if(req.method == 'POST'){
        res.status(405).json({
            message: "Method POST Not Allowed"
        })
    }
}
