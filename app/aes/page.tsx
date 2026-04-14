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
  const searchBits: string | null = searchParams?.get("bits") ?? null;
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
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

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
    setIsEncrypting(true);
    setEncryptBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const res = await fetch(
        `/api/aes?plaintext=${encodeURIComponent(plaintext)}&key=${encodeURIComponent(key)}`
      );
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
    setIsEncrypting(false);
  };

  const handleDecryptBtnClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setIsDecrypting(true);
    setDecryptBtnContent(<Loader />);
    setErrorMessage("");

    try {
      const res = await fetch(
        `/api/aes?ciphertext=${encodeURIComponent(ciphertext)}&key=${encodeURIComponent(key)}`
      );
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
    setIsDecrypting(false);
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

      <div className="section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-5 md:gap-x-7 xl:gap-x-9 gap-y-7 p-1 md:p-10">
          <div className="item col-span-5">
            <label htmlFor="aes-plaintext" className="form-label">
              Plaintext (128 bit blocks)
            </label>
            <input
              id="aes-plaintext"
              name="plaintext"
              type="text"
              value={plaintext}
              onChange={handlePlaintextChange}
               className="form-control"
            />
          </div>

          <div className="item col-span-4">
            <label htmlFor="aes-key" className="form-label">
              Key ({variant} bit)
            </label>
            <input
              id="aes-key"
              name="key"
              type="text"
              value={key}
              onChange={handleKeyChange}
               className="form-control"
            />
          </div>

          <div className="item col-span-1">
            <label htmlFor="aes-variant" className="form-label">Variant</label>
            <select
              id="aes-variant"
              value={variant}
              onChange={handleVariantChange}
              className="form-control"
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
            className="btn-primary block md:inline m-auto mt-10 md:mt-0"
            disabled={isEncrypting || !plaintext || !key}
          >
            {encryptBtnContent}
          </button>

          <button
            onClick={handleDecryptBtnClick}
            className="btn-secondary block md:inline md:ml-5 m-auto mt-4 md:mt-0"
            disabled={isDecrypting || !ciphertext || !key}
          >
            {decryptBtnContent}
          </button>

          {errorMessage}
        </div>

        <div className="flex justify-center">
          <div className="mt-9">
            <label htmlFor="aes-ciphertext" className="form-label">
              Ciphertext (Encoded in Base64)
            </label>
            <input
              id="aes-ciphertext"
              name="ciphertext"
              value={ciphertext}
              onChange={handleCiphertextChange}
              type="text"
              className="form-control w-[80vw] md:w-[40vw]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
