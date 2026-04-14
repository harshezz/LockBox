"use client";

import { SetStateAction, useState } from "react";
import Layout from "../../components/layout/Layout";
import AlgorithmHeader from "../../components/ui/AlgorithmHeader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loader from "../../components/ui/Loader";

export default function MD5() {
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

    try {
      const encodedText = encodeURIComponent(plaintext);
      const res = await fetch(`/api/md5?plaintext=${encodedText}`);
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

  return (
      <Layout>
        <AlgorithmHeader name="MD5">
          <p>
            The MD5 message-digest algorithm is a cryptographically broken but
            still widely used hash function producing a 128-bit hash value.{" "}
            <br />
            Although MD5 was initially designed to be used as a cryptographic
            hash function, it has been found to suffer from extensive
            vulnerabilities. <br />
            It can still be used as a checksum to verify data integrity, but
            only against unintentional corruption; collision attacks are
            possible when malice is introduced. <br />
            It remains suitable for other non-cryptographic purposes, for
            example for determining the partition for a particular key in a
            partitioned database, and may be preferred due to lower
            computational requirements than more recent Secure Hash Algorithms.
            <br /> <br />
            MD5 was designed by Ronald Rivest in 1991 to replace an earlier hash
            function MD4, and was specified in 1992 as RFC 1321.
          </p>
        </AlgorithmHeader>

        <div className="section-shell max-w-3xl">
          <label htmlFor="md5-plaintext" className="form-label">Plaintext</label>

          <textarea
            id="md5-plaintext"
            className="form-control h-28 max-h-52 mb-5"
            value={plaintext}
            onChange={handlePlaintextChange}
          />

          <button
            className="btn-primary block m-auto mt-5 mb-5"
            onClick={handleHashBtnClick}
            disabled={isHashing || !plaintext}
          >
            {hashBtnContent}
          </button>

          {errorMessage}

          <label htmlFor="md5-hash" className="form-label">Hash</label>

          <textarea
            id="md5-hash"
            className="form-control h-28 max-h-52 mb-5"
            value={hash}
            onChange={handleHashChange}
          />
        </div>
      </Layout>
  );
}
