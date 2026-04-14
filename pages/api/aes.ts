import { NextApiRequest, NextApiResponse } from "next"
import CryptoJS from 'crypto-js'
import { readParam } from "../../utils/readParam"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        const {plaintext, key, iv, ciphertext} = req.query
        const plaintextValue = readParam(plaintext)
        const keyValue = readParam(key)
        const ivValue = readParam(iv) || '0000'
        const ciphertextValue = readParam(ciphertext)
        
        const ivHex = CryptoJS.enc.Utf8.parse(ivValue)
        const keyHex = CryptoJS.enc.Utf8.parse(keyValue)
        
        const options = {
            iv: ivHex, 
            mode: CryptoJS.mode.CTR,
            padding: CryptoJS.pad.Pkcs7
        }
        
        try{
            if(!ciphertextValue){
                const encrypted = CryptoJS.AES.encrypt(plaintextValue, keyHex, options)

                res.status(200).json({
                    plaintext: plaintextValue,
                    ciphertext: encrypted.toString(),
                    key: keyValue,
                    iv: ivHex.toString(),
                    mode: 'CTR'
                })
            }else{
                const encrypted = CryptoJS.enc.Base64.parse(ciphertextValue)

                const decrypted  = CryptoJS.AES.decrypt({
                    ciphertext: encrypted
                }, keyHex, options)

                res.status(200).json({
                    plaintext: decrypted.toString(CryptoJS.enc.Utf8),
                    ciphertext: ciphertextValue,
                    key: keyValue,
                    iv: ivHex.toString(),
                    mode: 'CTR'
                })
            } 
        }catch(error){
            console.log(error)
            res.status(500).send({
                message: error.toString()
            })
        }
    }else if(req.method == 'POST'){
        res.status(405).json({
            message: "Method POST Not Allowed"
        })
    }
}
