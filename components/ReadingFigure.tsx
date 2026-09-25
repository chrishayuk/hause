"use client";
import type { ComponentPropsWithRef } from "react";
import { FigureMotion } from "./FigureMotion";
import { useNotebookEdition } from "./NotebookEdition";

/** Preserve native figure geometry and refs; the edition supplies the surface.
 * Existing playback instruments use motion=false to retain their own controller.
 */
export function ReadingFigure({ children, motion = true, surface = "open", ref, ...props }: ComponentPropsWithRef<"figure"> & { motion?: boolean; surface?: "open" | "instrument" }) {
  const edition = useNotebookEdition();
  const reading = edition ? { "data-reading-figure": surface } : {};
  if (!edition || !motion) return <figure {...props} {...reading} ref={ref}>{children}</figure>;
  return <FigureMotion {...props} {...reading} as="figure" elementRef={ref} reveal="surface">{children}</FigureMotion>;
}
