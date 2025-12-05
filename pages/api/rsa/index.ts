import { NextApiRequest, NextApiResponse } from "next";
// Import the constructor function and use it as the type for instances
import NodeRSA from "node-rsa";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    // Handle all non-GET methods concisely
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed. Use GET.`,
    });
  }

  try {
    // 1. Safely retrieve and convert query parameters
    let { plaintext, ciphertext, publicKey, privateKey } = req.query;

    // Use NodeRSA as the type for key objects
    let publicKeyObj: NodeRSA;
    let privateKeyObj: NodeRSA;

    // Convert query values to strings/null
    const getParam = (param: string | string[] | undefined): string | null => {
      if (param) {
        // Decode and replace '+', which often gets URL-encoded as '%20' or simply passed as '+'
        return decodeURI(param.toString()).replace(/%2b/g, "+");
      }
      return null;
    };

    plaintext = getParam(plaintext);
    ciphertext = getParam(ciphertext);
    publicKey = getParam(publicKey);
    privateKey = getParam(privateKey);

    // 2. Input Validation
    if (!plaintext && !ciphertext) {
      return res.status(400).send({
        message: "You must specify either plaintext or ciphertext.",
      });
    }

    if (publicKey && privateKey) {
      return res.status(400).send({
        message:
          "You must specify only one key: either publicKey or privateKey.",
      });
    }

    if (publicKey) {
      // 3. Handle Public Key Operations
      publicKeyObj = new NodeRSA().importKey(publicKey);

      if (plaintext) {
        // Public Encrypt
        return res.status(200).json({
          plaintext: plaintext,
          ciphertext: publicKeyObj.encrypt(plaintext, "base64"),
          publicKey: publicKeyObj.exportKey("public"),
        });
      } else if (ciphertext) {
        // Public Decrypt (should fail if encrypted with private key, but following logic)
        return res.status(200).json({
          plaintext: publicKeyObj.decryptPublic(ciphertext, "utf8"),
          ciphertext: ciphertext,
          publicKey: publicKeyObj.exportKey("public"),
        });
      }
    } else if (privateKey) {
      // 4. Handle Private Key Operations
      privateKeyObj = new NodeRSA().importKey(privateKey);

      if (plaintext) {
        // Private Encrypt (for signing/authentication)
        return res.status(200).json({
          plaintext: plaintext,
          ciphertext: privateKeyObj.encryptPrivate(plaintext, "base64"),
          privateKey: privateKeyObj.exportKey("private"),
        });
      } else if (ciphertext) {
        // Private Decrypt
        return res.status(200).json({
          plaintext: privateKeyObj.decrypt(ciphertext, "utf8"),
          ciphertext: ciphertext,
          privateKey: privateKeyObj.exportKey("private"),
        });
      }
    } else {
      // No key specified
      return res.status(400).send({
        message: "No key specified.",
      });
    }
  } catch (error) {
    // 5. Consolidated Error Handling
    console.error("RSA API Error:", error);
    return res.status(500).send({
      message: `An error occurred during operation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
}
