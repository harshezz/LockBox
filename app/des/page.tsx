"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AlgorithmHeader from "../../components/ui/AlgorithmHeader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import * as Constants from "../../utils/constants";

// REMOVE THIS BLOCK:
// export const metadata = {
//   title: 'DES | encryptia', // TODO: implement dynamic DES/TDES title
// }

export default function DES() {
  const [triple, setTriple] = useState<boolean>(false);

  useEffect(() => {
    const isTriple = new URLSearchParams(window.location.search).get("triple");
    if (!isTriple) return;
    setTriple(isTriple == "true");
  }, []);

  const [ciphertext, setCiphertext] = useState<string>("");
  const [plaintext, setPlaintext] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [mode, setMode] = useState<string>("ECB");
  const [IV, setIV] = useState<string>("");
  const [encryptBtnContent, setEncryptBtnContent] = useState<
    string | JSX.Element
  >("Encrypt");
  const [decryptBtnContent, setDecryptBtnContent] = useState<
    string | JSX.Element
  >("Decrypt");
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>("");
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  const handleEncryptBtnClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setIsEncrypting(true);
    setEncryptBtnContent(<Loader />);
    setErrorMessage("");

    let requestString: string = `plaintext=${encodeURIComponent(plaintext)}&key=${encodeURIComponent(key)}&mode=${encodeURIComponent(mode)}`;
    if (mode != "ECB") requestString += `&iv=${encodeURIComponent(IV)}`;
    if (triple) requestString += "&triple=true";

    try {
      const res: Response = await fetch(`/api/des?${requestString}`);
      const data = await res.json();
      const status: number = res.status;

      if (status == 200) {
        setCiphertext(data.ciphertext);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error) {
      setErrorMessage(<ErrorMessage>{error.toString()}</ErrorMessage>);
    }

    setEncryptBtnContent("Encrypt");
    setIsEncrypting(false);
  };

  const handleDecryptBtnClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setPlaintext("");
    setIsDecrypting(true);
    setDecryptBtnContent(<Loader />);
    setErrorMessage("");

    let requestString: string = `key=${encodeURIComponent(key)}&mode=${encodeURIComponent(mode)}&ciphertext=${encodeURIComponent(ciphertext)}`;
    if (mode != "ECB") requestString += `&iv=${encodeURIComponent(IV)}`;
    if (triple) requestString += "&triple=true";

    try {
      const res: Response = await fetch(`/api/des?${requestString}`);
      const data = await res.json();
      const status: number = res.status;

      if (status == 200) {
        setPlaintext(data.plaintext);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (error) {
      setErrorMessage(<ErrorMessage>{error.toString()}</ErrorMessage>);
    }

    setDecryptBtnContent("Decrypt");
    setIsDecrypting(false);
  };

  const handleCiphertextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setCiphertext(event.target.value);
  const handlePlaintextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setPlaintext(event.target.value);
  const handleKeyChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setKey(event.target.value);
  const handleModeChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setMode(event.target.value);
  const handleIVChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setIV(event.target.value);

  return (
    <Layout>
      <AlgorithmHeader
        name={
          triple ? "Triple Data Encryption System" : "Data Encryption System"
        }
      >
        {triple ? (
          <p>
            Triple DES is a block cipher based on repeating the Data Encryption
            Standard (DES) three times. <br />
            When it was discovered that the DES 56-bit key was not long enough
            to provide security against brute force attacks, TDES was chosen as
            an easy way to increase the length of the key without changing the
            algorithm. Using three steps is essential to prevent
            meet-in-the-middle attacks that work against DES double encryption.
          </p>
        ) : (
          <p>
            The Data Encryption Standard (DES) is a symmetric-key algorithm
            developed in early 1970s for the encryption of digital data. <br />
            Although its short key length of 56 bits makes it too insecure for
            modern applications, it has been highly influential in the
            advancement of cryptography. Despite the criticisms, DES was
            approved as a federal standard in November 1976, and published on 15
            January 1977 as FIPS PUB 46, authorized for use on all unclassified
            data.
          </p>
        )}
      </AlgorithmHeader>

      <div className="section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-5 md:gap-x-7 xl:gap-x-9 gap-y-7 p-1 md:p-10">
          <div className="item col-span-5">
            <label htmlFor="des-plaintext" className="form-label">
              Plaintext (64 bit blocks)
            </label>

            <input
              id="des-plaintext"
              name="plaintext"
              type="text"
              value={plaintext}
              onChange={handlePlaintextChange}
              className="form-control"
            />
          </div>

          <div className="item col-span-4">
            <label htmlFor="des-key" className="form-label">
              Key ({triple ? 168 : 56} bit)
            </label>

            <input
              id="des-key"
              name="key"
              type="text"
              value={key}
              onChange={handleKeyChange}
              maxLength={triple ? undefined : 8}
              className="form-control"
            />
          </div>

          <div className="item col-span-1">
            <label htmlFor="des-mode" className="form-label">Mode</label>

            <select
              id="des-mode"
              value={mode}
              onChange={handleModeChange}
              className="form-control"
            >
              {Constants.modes.map((mode) => {
                return (
                  <option key={mode.toString()} value={mode.toString()}>
                    {mode}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {mode != "ECB" && (
          <div className="flex justify-center">
            <div className="mb-0 md:mb-10 mt-6 md:mt-0">
              <label htmlFor="des-iv" className="form-label">
                Initialization Vector (IV)
              </label>
              <input
                id="des-iv"
                name="iv"
                value={IV}
                onChange={handleIVChange}
                type="text"
                className="form-control w-[80vw] md:w-[40vw]"
              />
            </div>
          </div>
        )}

        <div className="block text-center">
          <button
            onClick={handleEncryptBtnClick}
            className="btn-primary block md:inline m-auto mt-10 md:mt-0"
            disabled={isEncrypting || !plaintext || !key || (mode !== "ECB" && !IV)}
          >
            {encryptBtnContent}
          </button>

          <button
            onClick={handleDecryptBtnClick}
            className="btn-secondary block md:inline md:ml-5 m-auto mt-4 md:mt-0"
            disabled={isDecrypting || !ciphertext || !key || (mode !== "ECB" && !IV)}
          >
            {decryptBtnContent}
          </button>

          {errorMessage}
        </div>

        <div className="flex justify-center">
          <div className="mt-9">
            <label htmlFor="des-ciphertext" className="form-label">
              Ciphertext (Hex)
            </label>
            <input
              id="des-ciphertext"
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
