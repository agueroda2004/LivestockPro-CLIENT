import Overlay from "@/components/ui/Overlay";
import PageHeader from "@/components/ui/PageHeader";
import { useState } from "react";
import Form from "../components/Form";
import MovementForm from "../components/MovementForm";
import useCattle from "../hooks/useCattle";
import type { Cattle } from "../cattle";
import DeleteForm from "../components/DeleteForm";
import CustomDropDown from "@/components/ui/CustomDropDown";
import useRace from "@/features/race/hooks/useRace";
import useLand from "@/features/land/hooks/useLand";

export default function Cattle() {
  const {
    cattles,
    pagination,
    isLoadingCattle,
    GENDER_OPTIONS,
    filters,
    setFilters,
    handleApplyFilters,
    handleClearFilters,
  } = useCattle();
  const { getRacesToDropdown } = useRace();
  const { getLandsToDropdown } = useLand();

  const [forms, setForms] = useState({
    create: false,
    edit: false,
    delete: false,
    movement: false,
  });

  const [selectedCattle, setSelectedCattle] = useState<Cattle | null>(null);

  const handleOpenForm = (form: keyof typeof forms, open: boolean) => {
    setForms({ ...forms, [form]: open });
  };

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-container-padding-desktop">
      <PageHeader
        Title="Listado de Ganado"
        Description="Administra y monitorea el estado de tu ganado en tiempo real."
        buttonText="Crear"
        onClick={() => handleOpenForm("create", true)}
      />

      {/* Begin: Filters */}
      <div className="w-full rounded-lg border border-gray-200 mb-4 grid grid-cols-2 2xl:grid-cols-5 gap-2 p-4 items-center">
        {/* Begin: Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 text-text-primary -translate-y-1/2 top-1/2">
            search
          </span>
          <input
            className=" border border-gray-200 rounded-lg bg-gray-50 py-2 focus:border-primary outline-none transition-colors pl-10 w-full"
            placeholder="Buscar por arete..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        {/* End: Search Input */}

        <div>
          <CustomDropDown
            options={GENDER_OPTIONS}
            placeholder="Seleccionar género..."
            selectedValue={filters.gender}
            onChange={(value) => setFilters({ ...filters, gender: value })}
          />
        </div>
        <div>
          <CustomDropDown
            options={getRacesToDropdown?.data.map((race) => ({
              text: race.name,
              value: race.id,
            }))}
            placeholder="Seleccionar raza..."
            selectedValue={filters.raceId}
            onChange={(value) => setFilters({ ...filters, raceId: value })}
          />
        </div>
        <div>
          <CustomDropDown
            options={getLandsToDropdown?.data.map((land) => ({
              text: land.name,
              value: land.id,
            }))}
            placeholder="Seleccionar finca..."
            selectedValue={filters.landId}
            onChange={(value) => setFilters({ ...filters, landId: value })}
          />
        </div>
        <div className="flex flex-row gap-2 h-full">
          <button
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all text-sm h-full active:scale-[0.98] cursor-pointer"
            onClick={handleApplyFilters}
          >
            Aplicar
          </button>
          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm h-full active:scale-[0.98] cursor-pointer"
            onClick={handleClearFilters}
          >
            Limpiar
          </button>
        </div>
      </div>
      {/* End: Filters */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 p-1">
        {isLoadingCattle ? (
          <div className="col-span-full h-full flex items-center justify-center p-4">
            <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cattles && cattles.length > 0 ? (
          cattles.map((cattle) => (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
              <div className="p-6">
                {/* Begin: Cattle Information */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg text-primary mb-1">
                      Arete:{" "}
                      <span className="font-semibold">{cattle.name}</span>
                    </h3>
                    <span
                      className={`items-center px-2 py-1 rounded-full text-[10px]  text-black uppercase tracking-wider font-bold ${cattle.gender === "FEMALE" ? "bg-green-500/20" : "bg-orange-500/20"}`}
                    >
                      {cattle.gender === "FEMALE" ? "Hembra" : "Macho"}
                    </span>
                  </div>
                </div>
                {/* End: Cattle Information */}

                {/* Begin: Cattle Information */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-[10px] text-text-primary uppercase font-semibold">
                      Finca Asignada
                    </p>
                    <p className="text-md text-text-primary font-bold mt-1 text-nowrap overflow-hidden text-ellipsis">
                      {cattle.land.name}{" "}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-primary uppercase font-semibold">
                      Raza
                    </p>
                    <p className="text-md text-text-primary font-bold mt-1">
                      {cattle.race.name}{" "}
                    </p>
                  </div>
                </div>
                {/* End: Cattle Information */}

                {/* Begin: Action Buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <div></div>
                  <div className="flex flex-row gap-2">
                    <button
                      className="text-primary/20 hover:text-primary transition-all font-bold text-sm flex items-center cursor-pointer"
                      title="Mover / Dar de baja"
                      onClick={() => {
                        handleOpenForm("movement", true);
                        setSelectedCattle(cattle);
                      }}
                    >
                      <span className="material-symbols-outlined">
                        compare_arrows
                      </span>
                    </button>
                    <button
                      className="text-primary/20 hover:text-primary transition-all font-bold text-sm flex items-center cursor-pointer"
                      title="Editar"
                      onClick={() => {
                        handleOpenForm("edit", true);
                        setSelectedCattle(cattle);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="text-red-500/20 hover:text-red-500 transition-all font-bold text-sm flex items-center cursor-pointer"
                      title="Eliminar"
                      onClick={() => {
                        handleOpenForm("delete", true);
                        setSelectedCattle(cattle);
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
                No hay ganado registrado
              </h3>
              <p className="text-sm text-gray-400 mt-2 text-center">
                Comienza creando animales para monitorear su estado y
                administrar tu finca de manera eficiente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Begin: Pagination */}
      <div className="p-4 border border-gray-200 rounded-lg mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Mostrando {pagination?.total || 0} animales de{" "}
            {pagination?.totalPages || 0} paginas.
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
              disabled={pagination?.hasPrevPage === false}
            >
              Anterior
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-200 disabled:hover:bg-transparent"
              disabled={pagination?.hasNextPage === false}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
      {/* End: Pagination */}

      {forms.create ||
      forms.edit ||
      forms.delete ||
      forms.movement ? (
        <Overlay>
          {forms.create && (
            <Form onClose={() => handleOpenForm("create", false)} />
          )}
          {forms.edit && (
            <Form
              onClose={() => handleOpenForm("edit", false)}
              editedCattle={selectedCattle}
            />
          )}
          {forms.delete && (
            <DeleteForm
              onClose={() => handleOpenForm("delete", false)}
              cattleName={selectedCattle?.name || ""}
              id={selectedCattle?.id || ""}
            />
          )}
          {forms.movement && selectedCattle && (
            <MovementForm
              cattle={selectedCattle}
              onClose={() => handleOpenForm("movement", false)}
            />
          )}
        </Overlay>
      ) : null}
    </main>
  );
}
