import {
  ArrowUpOnSquareIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const howItWorks = [
  {
    title: "Upload Your IP",
    description:
      "Securely store your work via IPFS with content-based hashing.",
    icon: ArrowUpOnSquareIcon,
  },
  {
    title: "Blockchain Registration",
    description:
      "Record your IP metadata and authorship with time-stamped proof.",
    icon: DocumentCheckIcon,
  },
  {
    title: "Manage Ownership",
    description:
      "Transfer or license your IP through secure smart contract actions.",
    icon: UserGroupIcon,
  },
  {
    title: "Verify and Share",
    description:
      "Generate tamper-proof proof of ownership for verification or sharing.",
    icon: ShieldCheckIcon,
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg mb-16 mt-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">How IPGuardian Works</h2>
        <p className="mt-4 text-gray-300">
          Simple steps to register and manage your intellectual property
          securely.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {howItWorks.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <step.icon className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
