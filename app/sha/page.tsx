"use client";

import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AlgorithmHeader from "../../components/ui/AlgorithmHeader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";
import * as Constants from "../../utils/constants";

  export default function SHA() {
  const searchParams = useSearchParams();
  const searchV: string | null = searchParams?.get("v") ?? null;
  const [shaVariant, setShaVariant] = useState<string>(Constants.SHAVariants[0]);

  useEffect(() => {
    if (!searchV) return;
    setShaVariant(
      Constants.SHAVariants.includes(searchV)
        ? searchV
        : Constants.SHAVariants[1]
    );
  }, [searchV]);

  const [plaintext, setPlaintext] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>("");
  const [hashBtnContent, setHashBtnContent] = useState<string | JSX.Element>(
    "Hash"
  );
  const [isHashing, setIsHashing] = useState<boolean>(false);

  const handleHashBtnClick = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setErrorMessage("");
    setIsHashing(true);
    setHashBtnContent(<Loader />);

    const request = `/api/sha?plaintext=${encodeURIComponent(
      plaintext
    )}&v=${shaVariant.replace("SHA-", "")}`;

    try {
      const res = await fetch(request);
      const data = await res.json();

      if (res.ok) {
        setHash(data.hash);
      } else {
        setErrorMessage(<ErrorMessage>{data.message}</ErrorMessage>);
      }
    } catch (e: any) {
      setErrorMessage(<ErrorMessage>{e.toString()}</ErrorMessage>);
    }

    setHashBtnContent("Hash");
    setIsHashing(false);
  };

  const handlePlaintextChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setPlaintext(event.target.value);

  const handleHashChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setHash(event.target.value);

  const handleShaVersionChange = (event: {
    target: { value: SetStateAction<string> };
  }) => setShaVariant(event.target.value);

  return (
      <Layout>
        <AlgorithmHeader name="SHA">
          <p>
            SHA stands for Secure Hashing Algorithm. SHA is a modified version
            of MD5 and used for hashing data and certificates. When learning
            about SHA forms, several different types of SHA are referenced.
            Examples of SHA names used are SHA-1, SHA-2, SHA-256, SHA-512,
            SHA-224, and SHA-384, but in actuality there are only two types:
            SHA-1 and SHA-2. The other larger numbers, like SHA-256, are just
            versions of SHA-2 that note the bit lengths of the SHA-2.
            <br />
            <br />
            At this point in time, SHA-2 is the industry standard for hashing
            algorithms, though SHA-3 may eclipse this in the future. SHA-3 was
            released by the NIST, which also created SHA-1 and SHA-2, in 2015
            but was not made the industry standard for many reasons.
          </p>
        </AlgorithmHeader>

        <div className="section-shell max-w-3xl">
          <label htmlFor="sha-plaintext" className="form-label">Plaintext</label>

          <textarea
            id="sha-plaintext"
            className="form-control h-28 max-h-52 mb-5"
            value={plaintext}
            onChange={handlePlaintextChange}
          />

          <div className="text-center">
            <select
              className="form-control inline w-auto mr-3 mb-5 md:mb-0"
              value={shaVariant}
              onChange={handleShaVersionChange}
            >
              {Constants.SHAVariants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>

            <button
              className="btn-primary inline m-auto mt-5 mb-5"
              onClick={handleHashBtnClick}
              disabled={isHashing || !plaintext}
            >
              {hashBtnContent}
            </button>
          </div>

          {errorMessage}

          <label htmlFor="sha-hash" className="form-label">Hash</label>

          <textarea
            id="sha-hash"
            className="form-control h-28 max-h-52 mb-5"
            value={hash}
            onChange={handleHashChange}
          />
        </div>
      </Layout>
  );
}
