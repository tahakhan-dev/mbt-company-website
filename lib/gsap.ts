"use client";

/**
 * Single GSAP entry point — plugins registered exactly once, imported only
 * by client components. GSAP owns scroll choreography; Motion (motion/react)
 * owns component-level springs. Never both on one element.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Custom curves (the design law bans linear/ease-in-out for transitions). */
export const EASE_OUT = "expo.out";
export const EASE_SWIFT = "power3.inOut";

export { gsap, ScrollTrigger, SplitText, useGSAP };
