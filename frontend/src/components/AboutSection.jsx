import {
  DocumentCheckIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import AboutPicture from "../assets/About.jpg";

const features = [
  {
    name: "Instant IP Registration",
    description:
      "Securely register your intellectual property with blockchain-backed timestamping and IPFS storage.",
    icon: DocumentCheckIcon,
  },
  {
    name: "Proof of Ownership",
    description:
      "Every asset is cryptographically signed and permanently recorded to prove authenticity and authorship.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Easy Transfer & Licensing",
    description:
      "Transfer ownership or issue usage rights with full transparency and automated smart contract enforcement.",
    icon: ArrowRightOnRectangleIcon,
  },
  {
    name: "Dispute Resolution",
    description:
      "Handle conflicts fairly with traceable dispute history, accessible only by authorized roles on the network.",
    icon: ExclamationTriangleIcon,
  },
];

export const AboutSection = () => {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-[#7886c7] text-left">
                Why Choose IPGuardian
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl text-left">
                A better way to manage your IP
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 text-left">
                From registration to dispute resolution — IPGuardian offers a
                reliable, secure, and transparent platform built on blockchain
                technology.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none text-left">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-[#7886c7]"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src={AboutPicture}
            className="w-3xl max-auto rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0 "
          />
        </div>
      </div>
    </div>
  );
};
