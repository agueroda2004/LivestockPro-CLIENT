import type { Toast } from "react-hot-toast";

type CustomToastProps = {
  t: Toast;
  title: string;
  message: string;
  success?: boolean;
};
export default function CustomToast({
  t,
  title,
  message,
  success,
}: CustomToastProps) {
  return (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-sm w-full flex pointer-events-auto shadow-lg rounded-lg ring-1 ring-black/5 
        bg-white `}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-stretch">
          <div
            className={`w-1 rounded-full ${success ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500 ">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
