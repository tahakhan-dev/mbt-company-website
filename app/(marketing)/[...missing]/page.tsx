import { notFound } from "next/navigation";

/**
 * Catch-all that routes every unknown public path to the designed 404
 * inside the marketing shell (nav + footer). Real routes always win.
 */
export default function MissingPage() {
  notFound();
}
