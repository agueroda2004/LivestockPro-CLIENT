import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Custom hook to detect clicks outside of a specified element and trigger a callback function.
 * @param ref - A React ref object pointing to the element to detect outside clicks for.
 * @param isOpen - A boolean indicating whether the element is currently open/visible. The click listener will only be active when this is true.
 * @param onClose - A callback function to be called when a click outside the element is detected.
 */
export default function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, isOpen, onClose]);
}
