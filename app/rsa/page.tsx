"use client";

import React, { useState } from "react";
import Head from "next/head";
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

  // fallback keys if Constants.bitsMap is not present
  const keys: string[] = Array.from(
    (Constants as any).bitsMap
      ? Array.from((Constants as any).bitsMap.keys())
      : ["1024", "2048", "4096"]
  );

  const handleGenerateKeysBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
  };

  const handleEncryptBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setErrorMessage("");
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
  };

  const handleDecryptBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
  };

  return (
    <>
      <Head>
        <title>RSA | encryptia</title>
      </Head>

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

        <div className="max-w-5xl m-auto">
          <div className="grid grid-cols-0 sm:grid-cols-2 gap-6 mb-5">
            <div className="item">
              <label className="block mb-3 text-slate-300">Public Key</label>
              <textarea
                className="bg-transparent border border-solid rounded-lg border-slate-500 w-full p-2 h-28 max-h-52"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>
            <div className="item">
              <label className="block mb-3 text-slate-300">Private Key</label>
              <textarea
                className="bg-transparent border border-solid rounded-lg border-slate-500 w-full p-2 h-28 max-h-52"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center">
            <select
              className="inline text-slate-200 px-1 py-2 border border-solid border-slate-500 rounded-lg bg-slate-900 mr-3 mb-5 md:mb-0"
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
              className="inline border border-solid border-gray-600 rounded-lg bg-gray-800 hover:text-white hover:bg-gray-700 px-3 sm:px-10 py-2 font-medium m-auto"
              onClick={handleGenerateKeysBtnClick}
            >
              {generateKeysBtnContent}
            </button>
          </div>

          <div className="mt-7">
            <label className="block mb-3 text-slate-300">Plaintext</label>
            <textarea
              className="bg-transparent border border-solid rounded-lg border-slate-500 w-full p-2 h-28 max-h-52 mb-5"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
            />

            <div className="text-center mb-5 grid grid-cols-1 md:grid-cols-3 w-2/3 lg:w-1/2 m-auto gap-y-5">
              <select
                className="inline text-slate-200 px-1 py-2 border border-solid border-slate-500 mx-3 rounded-lg bg-slate-900"
                value={encryptMethod}
                onChange={(e) => setEncryptMethod(e.target.value)}
              >
                <option>Public Key</option>
                <option>Private Key</option>
              </select>

              <button
                className="inline border border-solid border-gray-600 rounded-lg bg-gray-800 hover:text-white hover:bg-gray-700 px-10 py-2 font-medium m-auto"
                onClick={handleEncryptBtnClick}
              >
                {encryptBtnContent}
              </button>

              <button
                className="inline border border-solid border-gray-600 rounded-lg bg-gray-800 hover:text-white hover:bg-gray-700 px-10 py-2 font-medium m-auto"
                onClick={handleDecryptBtnClick}
              >
                {decryptBtnContent}
              </button>
            </div>

            {errorMessage}

            <label className="block mb-3 text-slate-300">Ciphertext</label>
            <textarea
              className="bg-transparent border border-solid rounded-lg border-slate-500 w-full p-2 h-28 max-h-52 mb-5"
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
