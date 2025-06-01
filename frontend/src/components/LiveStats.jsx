import {
  DocumentCheckIcon,
  UserIcon,
  GlobeAltIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export const LiveStats = () => {
  const stats = [
    {
      icon: DocumentCheckIcon,
      value: "1.2M+ Verified IPs",
      description:
        "Assets registered and stored immutably using blockchain and decentralized IPFS technology.",
    },
    {
      icon: UserIcon,
      value: "150K+ Global Creators",
      description:
        "Freelancers and institutions use IPGuardian to protect their creative ownership rights.",
    },
    {
      icon: GlobeAltIcon,
      value: "70+ Countries Supported",
      description:
        "Our platform complies with IP laws across more than 70 global jurisdictions.",
    },
    {
      icon: ArrowRightOnRectangleIcon,
      value: "40K+ Ownership Transfers",
      description:
        "Licenses and ownership records are securely transferred with complete on-chain traceability.",
    },
  ];

  return (
    <section className="bg-[#1E2337] py-16 px-4 sm:px-6 lg:px-8 text-white rounded-lg mb-16 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
        {/* Left side */}
        <div>
          <p className="text-[#a9b5df] font-semibold text-sm">
            Trusted Worldwide
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Securing Creativity, Globally
          </h2>
          <p className="mt-4 text-[#7886c7]">
            IPGuardian ensures creators, startups, and enterprises can register,
            manage, and protect their intellectual assets without compromise.
          </p>

          <div className="mt-6 space-y-3 font-medium text-sm underline flex flex-col text-left">
            <a href="#" className="text-[#a9b5df]">
              Explore Legal Frameworks →
            </a>
            <a href="#" className="text-[#a9b5df]">
              View Compliance & Security →
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {stats.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <item.icon className="h-12 w-14 text-[#a9b5df]" />
              <div>
                <h3 className="font-bold">{item.value}</h3>
                <p className="text-sm text-[#7886c7]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
