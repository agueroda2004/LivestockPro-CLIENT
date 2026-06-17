import PageHeader from "@/components/ui/PageHeader";
import useRace from "../hooks/useRace";
import { useState } from "react";
import type { Race } from "../race";
import Overlay from "@/components/ui/Overlay";
import Form from "../components/Form";
import DeleteForm from "../components/DeleteForm";

export default function Race() {
  const { getRaces, isLoadingRaces } = useRace();

  const [forms, setForms] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleOpenForm = (form: keyof typeof forms, open: boolean) => {
    setForms({ ...forms, [form]: open });
  };
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-container-padding-desktop">
      <PageHeader
        Title="Listado de Razas"
        Description="Administra y monitorea el estado las razas de tu ganado en tiempo real."
        buttonText="Crear"
        onClick={() => handleOpenForm("create", true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 p-1">
        {isLoadingRaces ? (
          // Begin: Loading State
          <div className="col-span-full h-full flex items-center justify-center p-4">
            <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : // End: Loading State
        getRaces && getRaces.data.length > 0 ? (
          getRaces.data.map((race) => (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
              <div className="p-6">
                {/* Begin: Race Information */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg text-primary mb-1">{race.name}</h3>
                    <span
                      className={`items-center px-2 py-1 rounded-full text-[10px]  text-black uppercase tracking-wider font-bold ${race.active ? "bg-green-500/20" : "bg-gray-300"}`}
                    >
                      {race.active ? "Activa" : "Inactiva"}
                    </span>
                    {/* <span
                      className={`items-center px-2 py-1 rounded-full text-[10px] font-bold  text-on-tertiary uppercase tracking-wider ml-2 ${land.isRented ? "bg-yellow-500/20" : "bg-orange-500/20"}`}
                    >
                      {land.isRented ? "Alquilada" : "Propia"}
                    </span>
                    <p className="flex items-center gap-1 text-text-primary text-sm mt-2">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "16px" }}
                      >
                        location_on
                      </span>
                      {land.ubication}
                    </p> */}
                  </div>
                </div>
                {/* End: Land Information */}

                {/* Begin: Cattle Count */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-[10px] text-text-primary uppercase font-semibold">
                      Ganado Total
                    </p>
                    <p className="text-xl text-text-primary font-bold mt-1">
                      {race._count.Cattles}{" "}
                      <span className="text-sm font-normal text-text-primary">
                        Cabezas
                      </span>
                    </p>
                  </div>
                </div>
                {/* End: Cattle Count */}

                {/* Begin: Action Buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <div></div>
                  <div className="flex flex-row gap-2">
                    <button
                      className="text-primary/20 hover:text-primary transition-all font-bold text-sm flex items-center cursor-pointer"
                      onClick={() => {
                        handleOpenForm("edit", true);
                        setSelectedRace(race);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="text-red-500/20 hover:text-red-500 transition-all font-bold text-sm flex items-center cursor-pointer"
                      onClick={() => {
                        handleOpenForm("delete", true);
                        setSelectedRace(race);
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                {/* End: Action Buttons */}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
            <div className="p-6 flex flex-col items-center justify-center">
              <span
                className="material-symbols-outlined text-gray-400"
                style={{ fontSize: "48px" }}
              >
                grass
              </span>
              <h3 className="text-lg text-gray-400 mt-4">
                No hay razas registradas
              </h3>
              <p className="text-sm text-gray-400 mt-2 text-center">
                Agrega una nueva raza para clasificar y gestionar tu ganado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Begin: Forms */}
      {forms.create || forms.edit || forms.delete ? (
        <Overlay>
          {forms.create && (
            <Form onClose={() => handleOpenForm("create", false)} />
          )}
          {forms.delete && (
            <DeleteForm
              raceName={selectedRace?.name || ""}
              id={selectedRace?.id || ""}
              onClose={() => handleOpenForm("delete", false)}
            />
          )}
          {forms.edit && selectedRace && (
            <Form
              editedRace={selectedRace}
              onClose={() => handleOpenForm("edit", false)}
            />
          )}
        </Overlay>
      ) : null}
      {/* End: Forms */}
    </main>
  );
}
