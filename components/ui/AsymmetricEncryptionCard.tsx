import React from "react";
import Link from "next/link";
import LockIcon from "../icons/LockIcon";
import RightArrowIcon from "../icons/RightArrowIcon";
import KeyIcon from "../icons/KeyIcon";
import ShieldIcon from "../icons/ShieldIcon";
import BookIcon from "../icons/BookIcon";

type Props = {
  destination:
    | string
    | {
        pathname: string;
        query: any;
      };
  shortName: string;
  name: string;
  keyBits: string;
  securityLevel: string;
};

export default function AsymmetricEncryptionCard({
  destination,
  shortName,
  name,
  keyBits,
  securityLevel,
}: Props) {
  return (
    <Link href={destination} className="card-link">
      <article>
        <div className="card-link-header">
          <LockIcon />

          <div className="card-link-title">
            {shortName}
          </div>

          <RightArrowIcon />
        </div>

        <div className="my-3 font-semibold text-slate-100">{name}</div>

        <div className="font-semibold text-slate-300">
          <div className="mb-2">
            <KeyIcon />

            <span className="align-middle">{keyBits}</span>
          </div>
          <div className="mb-2">
            <ShieldIcon />

            <span className="align-middle">{securityLevel}</span>
          </div>
          <div className="mb-2">
            <BookIcon />

            <span className="align-middle">Asymmetric</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
