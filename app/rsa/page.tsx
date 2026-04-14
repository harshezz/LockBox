"use client";

import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import AlgorithmHeader from "../../components/ui/AlgorithmHeader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import * as Constants from "../../utils/constants";

export default function RSA() {
  const [generateKeysBtnContent, setGenerateKeysBtnContent] = useState<
    string | JSX.Element
  >("Generate Keys");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [bits, setBits] = useState<string | number>("2048");
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [encryptMethod, setEncryptMethod] = useState<string>("Public Key");
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>("");
  const [encryptBtnContent, setEncryptBtnContent] = useState<
    string | JSX.Element
  >("Encrypt");
  const [decryptBtnContent, setDecryptBtnContent] = useState<
    string | JSX.Element
  >("Decrypt");
  const [isGeneratingKeys, setIsGeneratingKeys] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  const keys: string[] = Array.from(Constants.bitsMap.keys());

  const handleGenerateKeysBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsGeneratingKeys(true);
    setGenerateKeysBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/rsa/generate-keys?bits=${bits}`);
      const data = await res.json();

      if (res.ok) {
        setPrivateKey(data.privateKey);
        setPublicKey(data.publicKey);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error: any) {
      setErrorMessage(
        <ErrorMessage>{error?.toString?.() ?? String(error)}</ErrorMessage>
      );
    }

    setGenerateKeysBtnContent("Generate Keys");
    setIsGeneratingKeys(false);
  };

  const handleEncryptBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");
    setIsEncrypting(true);
    setEncryptBtnContent(<Loader />);

    try {
      const encodedPlaintext = encodeURIComponent(plaintext);
      let requestString = `/api/rsa?plaintext=${encodedPlaintext}`;

      if (encryptMethod === "Private Key") {
        const encodedPrivateKey = encodeURIComponent(privateKey);
        requestString += `&privateKey=${encodedPrivateKey}`;
      } else {
        const encodedPublicKey = encodeURIComponent(publicKey);
        requestString += `&publicKey=${encodedPublicKey}`;
      }

      const res = await fetch(requestString);
      const data = await res.json();

      if (res.ok) {
        setCiphertext(data.ciphertext);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error: any) {
      setErrorMessage(
        <ErrorMessage>{error?.toString?.() ?? String(error)}</ErrorMessage>
      );
    }

    setEncryptBtnContent("Encrypt");
    setIsEncrypting(false);
  };

  const handleDecryptBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsDecrypting(true);
    setDecryptBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const encodedCiphertext = encodeURIComponent(ciphertext);
      let requestString = `/api/rsa?ciphertext=${encodedCiphertext}`;

      if (encryptMethod === "Private Key") {
        const encodedPrivateKey = encodeURIComponent(privateKey);
        requestString += `&privateKey=${encodedPrivateKey}`;
      } else {
        const encodedPublicKey = encodeURIComponent(publicKey);
        requestString += `&publicKey=${encodedPublicKey}`;
      }

      const res = await fetch(requestString);
      const data = await res.json();

      if (res.ok) {
        setPlaintext(data.plaintext);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error: any) {
      setErrorMessage(
        <ErrorMessage>{error?.toString?.() ?? String(error)}</ErrorMessage>
      );
    }

    setDecryptBtnContent("Decrypt");
    setIsDecrypting(false);
  };

  return (
      <Layout>
        <AlgorithmHeader name="Rivest-Shamir-Adleman">
          RSA is a public-key cryptosystem that is widely used for secure data
          transmission and is one of the oldest. The acronym "RSA" comes from
          the surnames of Ron Rivest, Adi Shamir and Leonard Adleman, who
          publicly described the algorithm in 1977.
          <br />
          <br />
          In a public-key cryptosystem, the encryption key is public and
          distinct from the decryption key, which is kept secret (private). An
          RSA user creates and publishes a public key based on two large prime
          numbers, along with an auxiliary value. The prime numbers are kept
          secret. Messages can be encrypted by anyone via the public key, but
          can only be decoded by someone who knows the prime numbers.
          <br />
          <br />
          The security of RSA relies on the difficulty of factoring the product
          of two large primes (the "factoring problem"). RSA is relatively slow
          and typically used to encrypt symmetric keys rather than large data
          directly.
        </AlgorithmHeader>

        <div className="section-shell">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <div className="item">
              <label htmlFor="rsa-public-key" className="form-label">Public Key</label>
              <textarea
                id="rsa-public-key"
                className="form-control h-28 max-h-52"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor="rsa-private-key" className="form-label">Private Key</label>
              <textarea
                id="rsa-private-key"
                className="form-control h-28 max-h-52"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center">
            <select
              className="form-control inline w-auto mr-3 mb-5 md:mb-0"
              value={bits}
              onChange={(e) => setBits(e.target.value)}
            >
              {keys.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <button
              className="btn-primary inline px-3 sm:px-10 m-auto"
              onClick={handleGenerateKeysBtnClick}
              disabled={isGeneratingKeys}
            >
              {generateKeysBtnContent}
            </button>
          </div>

          <div className="mt-7">
            <label htmlFor="rsa-plaintext" className="form-label">Plaintext</label>
            <textarea
              id="rsa-plaintext"
              className="form-control h-28 max-h-52 mb-5"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
            />

            <div className="text-center mb-5 grid grid-cols-1 md:grid-cols-3 w-2/3 lg:w-1/2 m-auto gap-y-5">
              <select
                className="form-control inline mx-3"
                value={encryptMethod}
                onChange={(e) => setEncryptMethod(e.target.value)}
              >
                <option>Public Key</option>
                <option>Private Key</option>
              </select>

              <button
                className="btn-primary inline px-10 m-auto"
                onClick={handleEncryptBtnClick}
                disabled={isEncrypting || !plaintext || (encryptMethod === "Public Key" ? !publicKey : !privateKey)}
              >
                {encryptBtnContent}
              </button>

              <button
                className="btn-secondary inline px-10 m-auto"
                onClick={handleDecryptBtnClick}
                disabled={isDecrypting || !ciphertext || (encryptMethod === "Public Key" ? !publicKey : !privateKey)}
              >
                {decryptBtnContent}
              </button>
            </div>

            {errorMessage}

            <label htmlFor="rsa-ciphertext" className="form-label">Ciphertext</label>
            <textarea
              id="rsa-ciphertext"
              className="form-control h-28 max-h-52 mb-5"
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
            />
          </div>
        </div>
      </Layout>
  );
}
