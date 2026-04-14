//api/des
import { NextApiRequest, NextApiResponse } from 'next'
import * as Constants from '../../utils/constants'
import CryptoJS from 'crypto-js'
import { readParam } from '../../utils/readParam'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'GET'){
        const query = req.query
        const {plaintext, key, mode, triple, ciphertext, iv} = query
        const plaintextValue = readParam(plaintext)
        const keyValue = readParam(key)
        const modeValue = readParam(mode) || 'ECB'
        const ciphertextValue = readParam(ciphertext)
        const ivValue = readParam(iv)
        const cryptoObj = triple === 'true' ? CryptoJS.TripleDES : CryptoJS.DES
        
        if(modeValue && !Constants.modesMap.has(modeValue)){
            res.status(400).send({
                message: `Specified mode '${modeValue}' not supported by DES`
            })
        }else{
            const keyHex = CryptoJS.enc.Utf8.parse(keyValue)
            const ivHex = ivValue ? CryptoJS.enc.Hex.parse(CryptoJS.enc.Utf8.parse(ivValue).toString(CryptoJS.enc.Hex)) 
                            : CryptoJS.enc.Hex.parse('0000')
            const modeObj = Constants.modesMap.get(modeValue) ?? Constants.modesMap.get('ECB')
            
            try{
                if(!ciphertextValue){ //we have to encrypt
                    const encrypted = cryptoObj.encrypt(plaintextValue, keyHex, {
                        iv: ivHex,
                        mode: modeObj,
                        padding: CryptoJS.pad.Pkcs7
                    })
        
                    res.status(200).json({ 
                        'plaintext': plaintextValue, 
                        'key': keyValue, 
                        'ciphertext': encrypted.ciphertext.toString(),
                        'mode': modeValue,
                        'padding': 'Pkcs7'
                    })
                }else{ //we have to decrypt
                    const decrypted = cryptoObj.decrypt({
                        ciphertext: CryptoJS.enc.Hex.parse(ciphertextValue)
                    }, keyHex, {
                        iv: ivHex,
                        mode: modeObj,
                        padding: CryptoJS.pad.Pkcs7
                    })
    
                    res.status(200).json({
                        'plaintext': decrypted.toString(CryptoJS.enc.Utf8),
                        'key': keyValue,
                        'ciphertext': ciphertextValue,
                        'mode': modeValue,
                        'padding': 'Pkcs7'
                    })
                }
            }catch(error){
                res.status(500).send({
                    message: error.toString()
                })
            }
        }
    }else if(req.method == 'POST'){
        res.status(405).send({
            message: "Method POST Not Allowed"
        })
    }
}
