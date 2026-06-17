import PageHeader from "@/components/ui/PageHeader";
import useTransaction, {
  TRANSACTION_TYPE_OPTIONS,
} from "../hooks/useTransaction";
import CustomDropDown from "@/components/ui/CustomDropDown";
import { useState } from "react";
import type { Transaction, TransactionTypes } from "../transaction";
import Overlay from "@/components/ui/Overlay";
import Form from "../components/Form";
import DeleteForm from "../components/DeleteForm";
import toast from "react-hot-toast";
import CustomToast from "@/components/ui/CustomToast";

const isValidDateFormat = (dateStr: string | undefined): boolean => {
  if (!dateStr || dateStr.length !== 10) return false;

  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [year, month, day] = dateStr.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const parseDate = (dateStr: string | undefined): Date => {
  const [year, month, day] = (dateStr || "").split("/").map(Number);
  return new Date(year, month - 1, day);
};

export default function Transaction() {
  const {
    TRANSACTION_TYPE_EXPENSE,
    TRANSACTION_TYPE_INCOME,
    filters,
    handleFilterChange,
    handleApplyFilters,
    handleClearFilters,
    transactions,
    pagination,
    isLoadingTransactions,
  } = useTransaction();

  const [forms, setForms] = useState({
    create: false,
    edit: false,
    delete: false,
  });

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleOpenForm = (form: keyof typeof forms, open: boolean) => {
    setForms({ ...forms, [form]: open });
  };

  const handleOnChangeDate = (value: string): string => {
    const onlyNumbers = value.replace(/\D/g, "");

    const limited = onlyNumbers.slice(0, 8);

    let formatted = "";
    if (limited.length > 0) {
      formatted = limited.slice(0, 4);
    }
    if (limited.length > 4) {
      formatted += "/" + limited.slice(4, 6);
    }
    if (limited.length > 6) {
      formatted += "/" + limited.slice(6, 8);
    }

    return formatted;
  };

  const getCategoryName = (category: string, type: TransactionTypes) => {
    if (type === "INCOME") {
      return TRANSACTION_TYPE_INCOME.find((option) => option.value === category)
        ?.text;
    } else if (type === "EXPENSE") {
      return TRANSACTION_TYPE_EXPENSE.find(
        (option) => option.value === category,
      )?.text;
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleValidateFilters = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (!isValidDateFormat(filters.dateFrom)) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Fecha inicio inválida"
          message="El formato invalido (YYYY/MM/DD) o fecha invalida."
          success={false}
        />
      ));
      return;
    }

    if (!isValidDateFormat(filters.dateTo)) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Fecha fin inválida"
          message="El formato invalido (YYYY/MM/DD) o fecha invalida."
          success={false}
        />
      ));
      return;
    }

    const begin = parseDate(filters.dateFrom);
    const end = parseDate(filters.dateTo);

    if (begin > today) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Fecha inicio inválida"
          message="La fecha inicio no puede ser futura a la fecha de hoy."
          success={false}
        />
      ));
      return;
    }

    if (end > today) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Fecha fin inválida"
          message="La fecha fin no puede ser futura a la fecha inicio"
          success={false}
        />
      ));
      return;
    }

    if (end < begin) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Rango de fechas inválido"
          message="La fecha fin no puede ser menor que la fecha inicio"
          success={false}
        />
      ));
      return;
    }
    handleApplyFilters();
  };

  return (
    <main className="flex-1 h-full">
      <PageHeader
        Title="Listado de Transacciones"
        Description="Administra y monitorea el estado de tus transacciones en tiempo real."
        buttonText="Crear"
        onClick={() => handleOpenForm("create", true)}
      />

      {/* Begin: Filters */}
      <div className="w-full rounded-lg border border-gray-200 mb-4 grid grid-cols-2 2xl:grid-cols-5 gap-2 p-4 items-center">
        {/* Begin: Begin Date */}
        <div className="relative">
          <span className="text-sm text-gray-500 absolute -translate-y-1/2 top-1/2 left-3 bg-white px-1">
            Fecha inicio
          </span>
          <input
            type="text"
            placeholder={filters.dateFrom}
            className="pl-28 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-11"
            value={filters.dateFrom}
            onChange={(e) => {
              const formatted = handleOnChangeDate(e.target.value);
              handleFilterChange("dateFrom", formatted);
            }}
            maxLength={10}
          />
        </div>
        {/* End: Begin Date */}

        {/* Begin: End Date */}
        <div className="relative">
          <span className="text-sm text-gray-500 absolute -translate-y-1/2 top-1/2 left-3 bg-white px-1">
            Fecha fin
          </span>
          <input
            type="text"
            placeholder={filters.dateTo}
            className="pl-22 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm h-11"
            value={filters.dateTo}
            onChange={(e) => {
              const formatted = handleOnChangeDate(e.target.value);
              handleFilterChange("dateTo", formatted);
            }}
            maxLength={10}
          />
        </div>
        {/* End: End Date */}

        {/* Begin: Transaction Type */}
        <div>
          <CustomDropDown
            options={TRANSACTION_TYPE_OPTIONS}
            placeholder="Seleccionar tipo..."
            selectedValue={filters.type}
            onChange={(value) =>
              handleFilterChange("type", value as TransactionTypes)
            }
          />
        </div>
        {/* End: Transaction Type */}

        {/* Begin: Category */}
        {filters.type && filters.type !== "ALL" ? (
          <div>
            <CustomDropDown
              options={
                filters.type === "INCOME"
                  ? TRANSACTION_TYPE_INCOME
                  : TRANSACTION_TYPE_EXPENSE
              }
              placeholder="Seleccionar categoría..."
              selectedValue={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
            />
          </div>
        ) : (
          <div className="text-xs bg-gray-50 p-2 rounded-lg text-text-primary h-full flex items-center justify-center">
            <p>Por favor seleccione un tipo de transacción.</p>
          </div>
        )}
        {/* End: Category */}

        {/* Begin: Action Buttons */}
        <div className="flex flex-row gap-2 h-full">
          <button
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all text-sm h-full active:scale-[0.98] cursor-pointer"
            onClick={handleValidateFilters}
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
        {/* End: Action Buttons */}
      </div>
      {/* End: Filters */}

      {/* Begin: Transaction List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-2 p-1">
        {isLoadingTransactions ? (
          <div className="col-span-full h-full flex items-center justify-center p-4">
            <span className="inline-block size-15 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
              <div className="p-6">
                {/* Begin: Transaction Information */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`items-center px-2 py-1 rounded-full text-[10px]  text-black uppercase tracking-wider font-bold ${transaction.type === "INCOME" ? "bg-green-500/20" : "bg-red-500/20"}`}
                    >
                      {transaction.type === "INCOME" ? "Ingreso" : "Gasto"}
                    </span>
                    <span
                      className={`items-center px-2 py-1 rounded-full text-[10px] font-bold  text-on-tertiary uppercase tracking-wider ml-2 bg-blue-500/20`}
                    >
                      {getCategoryName(transaction.category, transaction.type)}
                    </span>
                  </div>
                </div>
                {/* End: Transaction Information */}

                {/* Begin: Date */}
                <div>
                  <p className="text-[10px] text-text-primary uppercase font-semibold">
                    Fecha
                  </p>
                  <p className="text-xs text-text-primary font-bold mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                {/* End: Date */}

                {/* Begin: Description */}
                <div className="mt-2 overflow-hidden">
                  <p className="text-[10px] text-text-primary uppercase font-semibold">
                    Descripción
                  </p>
                  <p className="text-xs text-text-primary font-bold mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                    {transaction.description}
                  </p>
                </div>
                {/* End: Description */}

                {/* Begin: Amount */}
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <p className="text-[10px] text-text-primary uppercase font-semibold">
                    Monto
                  </p>
                  <p className="text-2xl text-text-primary font-bold mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                    ₡{transaction.amount.toLocaleString("en-US")}
                  </p>
                </div>
                {/* End: Amount */}

                {/* Begin: Action Buttons */}
                <div className=" flex items-center justify-between">
                  <div></div>
                  <div className="flex flex-row gap-2">
                    <button
                      className="text-primary/20 hover:text-primary transition-all font-bold text-sm flex items-center cursor-pointer"
                      onClick={() => {
                        handleOpenForm("edit", true);
                        setSelectedTransaction(transaction);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="text-red-500/20 hover:text-red-500 transition-all font-bold text-sm flex items-center cursor-pointer"
                      onClick={() => {
                        handleOpenForm("delete", true);
                        setSelectedTransaction(transaction);
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
                No hay transacciones registradas
              </h3>
              <p className="text-sm text-gray-400 mt-2 text-center">
                Comienza creando tu primera transacción para monitorear tus
                ingresos y gastos de manera eficiente.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* End: Transaction List */}

      {/* Begin: Pagination */}
      <div className="p-4 border border-gray-200 rounded-lg mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Mostrando {pagination?.total || 0} transacciones de{" "}
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

      {/* Begin: Forms */}
      {forms.create || forms.edit || forms.delete ? (
        <Overlay>
          {forms.create && (
            <Form onClose={() => handleOpenForm("create", false)} />
          )}
          {forms.delete && (
            <DeleteForm
              id={selectedTransaction?.id || ""}
              onClose={() => handleOpenForm("delete", false)}
            />
          )}
          {forms.edit && selectedTransaction && (
            <Form
              editedTransaction={selectedTransaction}
              onClose={() => handleOpenForm("edit", false)}
            />
          )}
        </Overlay>
      ) : null}
      {/* End: Forms */}
    </main>
  );
}
