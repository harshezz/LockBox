import { NextApiRequest, NextApiResponse } from "next";
import rsa from "node-rsa";
import { readParam } from "../../../utils/readParam";

const decodeQueryParam = (value: string): string =>
  decodeURIComponent(value).replace(/%2b/g, "+");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    try {
      const plaintext = readParam(req.query.plaintext);
      const ciphertext = readParam(req.query.ciphertext);
      const publicKey = readParam(req.query.publicKey);
      const privateKey = readParam(req.query.privateKey);

      if (!plaintext && !ciphertext) {
        return res.status(400).send({
          message: "You must specify either plaintext or ciphertext",
        });
      }

      if (publicKey && privateKey) {
        return res.status(400).send({
          message: "You must specify either private or public key",
        });
      }

      if (publicKey) {
        const publicKeyObj = new rsa().importKey(decodeQueryParam(publicKey));

        if (plaintext) {
          return res.status(200).json({
            plaintext: decodeQueryParam(plaintext),
            ciphertext: publicKeyObj.encrypt(decodeQueryParam(plaintext), "base64"),
            publicKey: publicKeyObj.exportKey("public"),
          });
        }

        return res.status(200).json({
          plaintext: publicKeyObj.decryptPublic(decodeQueryParam(ciphertext), "utf8"),
          ciphertext: decodeQueryParam(ciphertext),
          publicKey: publicKeyObj.exportKey("public"),
        });
      }

      if (privateKey) {
        const privateKeyObj = new rsa().importKey(decodeQueryParam(privateKey));

        if (plaintext) {
          return res.status(200).json({
            plaintext: decodeQueryParam(plaintext),
            ciphertext: privateKeyObj.encryptPrivate(
              decodeQueryParam(plaintext),
              "base64"
            ),
            privateKey: privateKeyObj.exportKey("private"),
          });
        }

        return res.status(200).json({
          plaintext: privateKeyObj.decrypt(decodeQueryParam(ciphertext), "utf8"),
          ciphertext: decodeQueryParam(ciphertext),
          privateKey: privateKeyObj.exportKey("private"),
        });
      }

      return res.status(400).send({
        message: "No key specified",
      });
    } catch (error) {
      return res.status(500).send({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  } else if (req.method == "POST") {
    return res.status(405).json({
      message: "Method POST Not Allowed",
    });
  }

  return res.status(405).json({
    message: `Method ${req.method} Not Allowed`,
  });
}
