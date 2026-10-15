import {
  Banknote,
  Bed,
  BedDouble,
  Bot,
  Brain,
  Building2,
  Bus,
  CalendarClock,
  ChartColumn,
  ClipboardCheck,
  Cloud,
  Code,
  Compass,
  Cpu,
  DoorOpen,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  HeartHandshake,
  LifeBuoy,
  Layers,
  Layers3,
  Library,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Network,
  NotebookPen,
  Package,
  Phone,
  Radio,
  Receipt,
  RefreshCw,
  Repeat,
  Rocket,
  School,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Store,
  Target,
  Telescope,
  UserCog,
  Users,
  Wallet,
  Workflow,
  Zap,
  Clock,
  Boxes,
  Route,
  Check,
  PanelsTopLeft,
  UserSearch,
  ShoppingCart,
  FileCheck,
  MessageSquareHeart,
  CreditCard,
  QrCode,
  Calculator,
  Landmark,
  Fingerprint,
  IdCard,
  Utensils,
  MonitorPlay,
  UserPlus,
  ClipboardList,
  Award,
  Briefcase,
  HeartPulse,
  CalendarDays,
  BellRing,
  Plug,
  Blocks,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ICONS = {
  Banknote, Bed, BedDouble, Bot, Brain, Building2, Bus, CalendarClock, ChartColumn, ClipboardCheck, Cloud, Code, Compass, Cpu, DoorOpen,
  FileSpreadsheet, FileText, FlaskConical, Globe, GraduationCap, Hammer, Handshake, HeartHandshake, LifeBuoy, Layers, Layers3, Library, Mail,
  MapPin, Megaphone, MessageSquare, MessagesSquare, Network, NotebookPen, Package, Phone, Radio, Receipt, RefreshCw, Repeat, Rocket, School,
  Search, Settings2, ShieldCheck, SlidersHorizontal, Smartphone, Sparkles, Store, Target, Telescope, UserCog, Users, Wallet, Workflow, Zap, Clock,
  Boxes, Route, Check, CreditCard, QrCode, Calculator, Landmark, Fingerprint, IdCard, Utensils, MonitorPlay, UserPlus, ClipboardList, Award, Briefcase, HeartPulse, CalendarDays, BellRing, Plug, Blocks, PanelsTopLeft, UserSearch, ShoppingCart, FileCheck, MessageSquareHeart,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** A single line icon. Decorative by default (aria-hidden). */
export default function Icon({ name, className, size = 24, strokeWidth = 1.6 }: { name: IconName; className?: string; size?: number; strokeWidth?: number }) {
  const C = ICONS[name];
  return <C aria-hidden="true" width={size} height={size} strokeWidth={strokeWidth} className={cn("shrink-0", className)} />;
}

const BOX = {
  sm: { box: "h-9 w-9", icon: 18 },
  md: { box: "h-12 w-12", icon: 24 },
  lg: { box: "h-16 w-16", icon: 30 },
} as const;

const TONE = {
  line: "border border-line-strong text-fg",
  soft: "bg-fg/[0.07] text-fg",
  accent: "bg-accent text-white",
  solid: "bg-fg text-bg",
  current: "border border-current/40",
} as const;

/** An icon in a square tile, the site's standard way of marking a topic. */
export function IconBox({ name, size = "md", tone = "line", className }: { name: IconName; size?: keyof typeof BOX; tone?: keyof typeof TONE; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-center transition-colors duration-200", BOX[size].box, TONE[tone], className)}>
      <Icon name={name} size={BOX[size].icon} />
    </span>
  );
}
