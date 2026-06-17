export default function FirstPanel() {
  return (
    <section className="hidden md:block md:w-1/2 lg:w-3/5 xl:w-2/3 relative bg-cover">
      <div className="absolute inset-0 bg-black z-10 opacity-30"></div>
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsWl6j2UtjRP0llyxXxC68kNA28CZWy1ytU-kwh9A_viJpBKaKWcAzaZKEr-Ysheoi3Vny8T5-0lW3QXMHgCuHrbJaZHqPUvg6bx2g3J2hJRto9resgylVEbWWOHJADCpry3EzFJ_bbl6UFxk_UyOYLI7amrBay5jC7yx8PGnneauNDQqz77hx10KnD_QG8NfvAeKJLCd2ghF_aqE2Vk31G0XgeiUACK8D0smzb7pYrFjEdB51eFXlfJZQ2PaBFS0HWqXEAgQKDQ"
        className="w-full h-full object-cover object-center absolute inset-0"
      />
      <div className="absolute top-12 left-12 flex items-center space-x-3 text-white z-20">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "48px", fontWeight: "200" }}
        >
          agriculture
        </span>
        <span className="text-2xl font-bold">LivestockPro</span>
      </div>
      <div className="absolute bottom-12 left-12 text-white z-20">
        <h2 className="mb-2 text-lg">Excelencia en Gestión Ganadera</h2>
        <p className="opacity-90 text-sm max-w-md">
          Herramientas precisas para el control total de su producción bovina,
          desde el potrero hasta la oficina.
        </p>
      </div>
    </section>
  );
}
