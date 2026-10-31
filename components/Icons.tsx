import type { ReactNode, SVGProps } from "react";

type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "instagram"
  | "compass"
  | "map-pin"
  | "sun"
  | "mountain"
  | "sparkles"
  | "menu"
  | "close"
  | "check"
  | "heart"
  | "calendar"
  | "users"
  | "message"
  | "leaf"
  | "plus"
  | "chevron-down"
  | "copy"
  | "plane"
  | "send";

export default function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  const paths: Record<IconName, ReactNode> = {
    "arrow-right": <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>,
    "arrow-up-right": <><path d="M5 19 19 5" /><path d="M8 5h11v11" /></>,
    instagram: <><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4" /><path d="M17.7 6.3h.01" strokeWidth="3" /></>,
    compass: <><circle cx="12" cy="12" r="9.5" /><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z" /></>,
    "map-pin": <><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.6" /></>,
    sun: <><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    mountain: <><path d="m2 20 7.4-13 4.2 7 2.3-3.7L22 20H2Z" /><path d="m7.7 10.1 2 1.2 1.7-1.2" /></>,
    sparkles: <><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="M5 5 19 19M19 5 5 19" /></>,
    check: <><path d="m4 12 5.5 5.5L20 7" /></>,
    heart: <><path d="M20.8 8.5c0 4.5-8.8 10.5-8.8 10.5S3.2 13 3.2 8.5a4.5 4.5 0 0 1 8.8-1.1 4.5 4.5 0 0 1 8.8 1.1Z" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3H3Z" /><path d="M17 5a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2.5-4.9" /></>,
    message: <><path d="M20 11.5a8 8 0 0 1-8 8 9 9 0 0 1-3.6-.8L4 20l1.3-4.4A8 8 0 1 1 20 11.5Z" /><path d="M8.5 11.5h7" /></>,
    leaf: <><path d="M21 3C10 3 3 7.5 3 15a6 6 0 0 0 6 6c7.5 0 12-7 12-18Z" /><path d="M5 19c3-5 6.8-8.3 12-11" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    "chevron-down": <><path d="m5 9 7 7 7-7" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    plane: <><path d="m21 3-7.7 18-3.6-7.7L2 9.7 21 3Z" /><path d="m21 3-11.3 10.3" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
  };

  return <svg {...common} {...props}>{paths[name]}</svg>;
}
