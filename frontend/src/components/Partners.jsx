export const PartnersSection = () => {
  const partners = [
    { name: "IPFS", logo: "../src/assets/Partners/IPFS.png" },
    { name: "WIPO", logo: "../src/assets/Partners/WIPO.jpg" },
    { name: "Creative Commons", logo: "../src/assets/Partners/CC.png" },
    { name: "MIT OSS", logo: "../src/assets/Partners/MIT.png" },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#2d336b]">
          Trusted by Leaders in IP and Blockchain
        </h2>
        <p className="mt-2 text-[#7886c7]">
          We’re supported by organizations building the future of decentralized
          ownership.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-10">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={partner.name}
              className="h-15 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
