import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, type LoginFormData } from "@/features/auth/login.schema";
import Button from "@/components/ui/Button";
import InputText from "@/components/ui/InputText";
import InputPassword from "@/features/auth/components/InputPassword";

interface LoginFormProps {
  expired?: boolean;
}

export default function LoginForm({ expired = false }: LoginFormProps) {
  const { login, isPending, globalError } = useLogin();

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    login(result.data);
  }

  return (
    <section className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex items-center justify-center p-8">
      <div className="w-full max-w-110 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: "48px", fontWeight: "200" }}
            >
              agriculture
            </span>
          </div>
          <h1 className="text-3xl font-normal mt-4 text-center">
            ¡Bienvenido!
          </h1>
          <p className="mt-1 text-sm opacity-80">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full border border-primary/20 shadow-xs shadow-primary/20 rounded-lg p-8 mt-8"
        >
          {expired && (
            <div className="p-3 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg">
              Tu sesión expiró. Iniciá sesión nuevamente.
            </div>
          )}

          {globalError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {globalError}
            </div>
          )}

          <div>
            <label className="flex items-center gap-1 mb-1 text-sm font-normal">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "24px" }}
              >
                person
              </span>
              Usuario
            </label>
            <InputText
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              error={fieldErrors.email}
            />
          </div>

          <div>
            <label className="flex items-center gap-1 mb-1 text-sm font-normal">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "24px" }}
              >
                lock
              </span>
              Contraseña
            </label>
            <InputPassword
              name="password"
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
          </div>

          <Button isLoading={isPending}>Ingresar</Button>
        </form>
      </div>
    </section>
  );
}
