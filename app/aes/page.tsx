"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AlgorithmHeader from "../../components/ui/AlgorithmHeader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import * as Constants from "../../utils/constants";

type Event = {
  target: {
    value: React.SetStateAction<string>;
  };
};

export default function AES() {
  const searchParams = useSearchParams();
  const searchBits: string | null = searchParams.get("bits");
  const [variant, setVariant] = useState<string>("128");

  useEffect(() => {
    if (!searchBits) return;
    const bits = Constants.AESVariants.includes(searchBits)
      ? searchBits
      : Constants.AESVariants[0];
    setVariant(bits);
  }, [searchBits]);

  const [ciphertext, setCiphertext] = useState<string>("");
  const [plaintext, setPlaintext] = useState<string>("");
  const [key, setKey] = useState<string>("");

  const [encryptBtnContent, setEncryptBtnContent] = useState<
    string | JSX.Element
  >("Encrypt");
  const [decryptBtnContent, setDecryptBtnContent] = useState<
    string | JSX.Element
  >("Decrypt");
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>("");

  const handleCiphertextChange = (event: Event) =>
    setCiphertext(event.target.value);
  const handlePlaintextChange = (event: Event) =>
    setPlaintext(event.target.value);
  const handleKeyChange = (event: Event) => setKey(event.target.value);
  const handleVariantChange = (event: Event) => setVariant(event.target.value);

  const handleEncryptBtnClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setEncryptBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/aes?plaintext=${plaintext}&key=${key}`);
      const data = await res.json();

      if (res.status === 200) {
        // --- FIX ---
        // Ensure data.ciphertext is never null or undefined
        setCiphertext(data.ciphertext ?? "");
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error) {
      setErrorMessage(<ErrorMessage>{String(error)}</ErrorMessage>);
    }

    setEncryptBtnContent("Encrypt");
  };

  const handleDecryptBtnClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setDecryptBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/aes?ciphertext=${ciphertext}&key=${key}`);
      const data = await res.json();

      if (res.status === 200) {
        // --- FIX ---
        // Ensure data.plaintext is never null or undefined
        setPlaintext(data.plaintext ?? "");
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error) {
      setErrorMessage(<ErrorMessage>{String(error)}</ErrorMessage>);
    }

    setDecryptBtnContent("Decrypt");
  };

  return (
    <Layout>
      <AlgorithmHeader name="Advanced Encryption Standard">
        The Advanced Encryption Standard (AES), also known by its original name
        Rijndael, is a specification for the encryption of electronic data
        established by the U.S. National Institute of Standards and Technology
        (NIST) in 2001.
        <br />
        AES has been adopted by the U.S. government. It supersedes the Data
        Encryption Standard (DES), which was published in 1977. The algorithm
        described by AES is a symmetric-key algorithm, meaning the same key is
        used for both encrypting and decrypting the data.
        <br />
        AES is based on a design principle known as a substitution–permutation
        network, and is efficient in both software and hardware. Unlike its
        predecessor DES, AES does not use a Feistel network.
      </AlgorithmHeader>

      <div className="max-w-5xl m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-5 md:gap-x-7 xl:gap-x-9 gap-y-7 p-1 md:p-10">
          <div className="item col-span-5">
            <label className="block mb-3 text-slate-300">
              Plaintext (128 bit blocks)
            </label>
            <input
              name="plaintext"
              type="text"
              value={plaintext}
              onChange={handlePlaintextChange}
              className="bg-slate-900 border rounded-lg p-2 w-full border-slate-500"
            />
          </div>

          <div className="item col-span-4">
            <label className="block mb-3 text-slate-300">
              Key ({variant} bit)
            </label>
            <input
              name="key"
              type="text"
              value={key}
              onChange={handleKeyChange}
              className="bg-slate-900 border rounded-lg p-2 w-full border-slate-500"
            />
          </div>

          <div className="item col-span-1">
            <label className="block mb-3 text-slate-300">Variant</label>
            <select
              value={variant}
              onChange={handleVariantChange}
              className="text-slate-200 w-full px-1 py-2 border border-solid border-slate-500 rounded-lg bg-slate-900"
            >
              <option>128</option>
              <option>192</option>
              <option>256</option>
            </select>
          </div>
        </div>

        <div className="block text-center">
          <button
            onClick={handleEncryptBtnClick}
            className="block md:inline border border-solid border-gray-600 rounded-lg bg-gray-800 hover:text-white hover:bg-gray-700 px-20 py-2 mt-10 md:mt-0 font-medium m-auto"
          >
            {encryptBtnContent}
          </button>

          <button
            onClick={handleDecryptBtnClick}
            className="block md:inline md:ml-5 border border-solid border-gray-600 rounded-lg bg-gray-800 hover:text-white hover:bg-gray-700 px-20 py-2 mt-10 md:mt-0 font-medium m-auto"
          >
            {decryptBtnContent}
          </button>

          {errorMessage}
        </div>

        <div className="flex justify-center">
          <div className="mt-9">
            <label className="block mb-3 text-slate-300">
              Ciphertext (Encoded in Base64)
            </label>
            <input
              name="ciphertext"
              value={ciphertext}
              onChange={handleCiphertextChange}
              type="text"
              className="bg-slate-900 border rounded-lg p-2 border-slate-500 w-[80vw] md:w-[40vw]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
