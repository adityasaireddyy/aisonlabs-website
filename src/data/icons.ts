import type { IconName } from "@/components/ui/Icon";
import { eduDashboard, eduScreens, eduTransport, type EduScreen } from "@/data/products";

/** Icon choices for content that lives in other data files, keyed by index, name or id. */

const SERVICE: Record<string, IconName> = {
  "01": "Code", "02": "Globe", "03": "Smartphone", "04": "Building2", "05": "Sparkles", "06": "Cloud",
  "07": "ShieldCheck", "08": "Network", "09": "Compass", "10": "Rocket", "11": "LifeBuoy",
};
export const serviceIcon = (index: string): IconName => SERVICE[index] ?? "Code";

const PROCESS: IconName[] = ["Search", "Layers", "Hammer", "Rocket", "RefreshCw"];
export const processIcon = (i: number): IconName => PROCESS[i] ?? "Layers";

const PRINCIPLE: Record<string, IconName> = { "01": "Target", "02": "Cpu", "03": "Users", "04": "SlidersHorizontal", "05": "Telescope" };
export const principleIcon = (index: string): IconName => PRINCIPLE[index] ?? "Target";

const GROUP: Record<string, IconName> = {
  academics: "GraduationCap", people: "Users", finance: "Wallet", operations: "Boxes", communication: "MessagesSquare", insight: "ChartColumn",
};
export const groupIcon = (id: string): IconName => GROUP[id] ?? "Layers";

const MODULE: Record<string, IconName> = {
  Students: "GraduationCap", "Student lifecycle": "Repeat", "Classes and subjects": "School", Timetable: "CalendarClock", Attendance: "ClipboardCheck",
  "Exams and results": "FileText", "Parents and guardians": "HeartHandshake", Teachers: "NotebookPen", Attenders: "UserCog", "Stationery managers": "Store",
  "Hostel wardens": "Bed", Documents: "FileText", Fees: "Banknote", "Daily collections": "Receipt", "Stationery accounts": "Wallet", Inventory: "Package",
  "Gate pass": "DoorOpen", Library: "Library", Hostel: "BedDouble", Transport: "Bus", "Live buses": "Radio", Messages: "MessageSquare",
  Announcements: "Megaphone", "WhatsApp messages": "Phone", Reports: "FileSpreadsheet", "AI assistant": "Bot",
};
export const moduleIcon = (name: string): IconName => MODULE[name] ?? "Layers";

const CATEGORY: Record<string, IconName> = {
  "Artificial Intelligence": "Brain", "Education Technology": "GraduationCap", "Software Architecture": "Workflow",
  "Product Engineering": "Rocket", "Emerging Technology": "Zap", Systems: "Network", Experiments: "FlaskConical",
};
export const categoryIcon = (c: string): IconName => CATEGORY[c] ?? "Compass";

const ROLE: Record<string, IconName> = { Parents: "HeartHandshake", Teachers: "NotebookPen", "Hostel wardens": "Bed", Attenders: "UserCog", "Bus drivers": "Bus" };
export const roleIcon = (r: string): IconName => ROLE[r] ?? "Users";

/**
 * Real product screens for individual modules. Modules without an entry have no
 * safe screen (the lists show people), so they fall back to the group view.
 */
const find = (id: string): EduScreen => eduScreens.find((s) => s.id === id)!;
export const MODULE_SCREEN: Record<string, EduScreen> = {
  Inventory: find("inventory"),
  Library: find("library"),
  Transport: find("transport"),
  "Live buses": { id: "route-map", label: "Route map", ...eduTransport.map },
  "Daily collections": find("collections"),
  Reports: find("reports"),
  "AI assistant": find("assistant"),
};
export const GROUP_SCREEN: Record<string, EduScreen> = {
  academics: eduDashboard,
  finance: find("collections"),
  operations: find("inventory"),
  insight: find("reports"),
};
