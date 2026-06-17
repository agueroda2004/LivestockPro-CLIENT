import type { ReactNode } from "react";

type OverlayProps = {
  children: ReactNode;
};
export default function Overlay({ children }: OverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
      {children}
    </div>
  );
}
