import CryptoJS from "crypto-js"
import { NextApiRequest, NextApiResponse } from "next"

const readParam = (value: string | string[] | undefined): string => {
    if(Array.isArray(value)) return value[0] ?? ''
    return value ?? ''
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        const {plaintext, v} = req.query
        const plaintextValue = readParam(plaintext)
        const variant = readParam(v)

        try{
            let hash: CryptoJS.lib.WordArray

            switch(variant){
                case '1':
                    hash = CryptoJS.SHA1(plaintextValue)
                    break;
                case '3':
                    hash = CryptoJS.SHA3(plaintextValue)
                    break;
                case '224':
                    hash = CryptoJS.SHA224(plaintextValue)
                    break;
                case '384':
                    hash = CryptoJS.SHA384(plaintextValue)
                    break;
                case '512':
                    hash = CryptoJS.SHA512(plaintextValue)
                    break;
                default:
                    hash = CryptoJS.SHA256(plaintextValue)
                    break;
            }

            res.status(200).json({
                plaintext: plaintextValue,
                hash: hash.toString()
            })
        }catch(e){
            console.log(e)
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
