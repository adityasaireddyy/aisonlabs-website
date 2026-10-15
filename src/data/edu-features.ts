import type { IconName } from "@/components/ui/Icon";
import { eduMobile, eduModuleGroups } from "@/data/products";

/**
 * Feature copy for Aison Edu. Everything here describes what the product does;
 * nothing claims results, customer numbers or performance.
 */

export const MODULE_DESC: Record<string, string> = {
  Students: "Admission records and a profile for every student, in one place.",
  "Student lifecycle": "A student's journey through the school, recorded step by step.",
  "Classes and subjects": "The academic structure: classes, sections and the subjects taught in each.",
  Timetable: "Periods and teachers arranged against classes and sections.",
  Attendance: "Daily registers for every class, visible to families.",
  "Exams and results": "Examinations, marks and results, with a marks memo for each student.",
  "Parents and guardians": "Family accounts, linked to each child.",
  Teachers: "Staff records and the accounts teachers sign in with.",
  Attenders: "Accounts and access for attenders.",
  "Stationery managers": "Accounts for the people who run the stationery counter.",
  "Hostel wardens": "Accounts for the staff who look after hostel residents.",
  Documents: "Student and school documents, stored against the right record.",
  Fees: "Fee plans, dues and payments for every student.",
  "Daily collections": "Money taken each day, by method, fee head, class and collector.",
  "Stationery accounts": "Each student's stationery account and its transactions.",
  Inventory: "Stock value, low-stock count and an item ledger.",
  "Gate pass": "Recorded permission for students to leave campus.",
  Library: "Books and copies, issue and return, and what is overdue.",
  Hostel: "Hostel allocation and its residents.",
  Transport: "Buses, routes, seats, and the students assigned to each.",
  "Live buses": "Buses on the map while a trip is running.",
  Messages: "Messages between families and teachers.",
  Announcements: "Notices sent to each role.",
  "WhatsApp messages": "Messages to parents on WhatsApp.",
  Reports: "Reports grouped by area, each downloadable as PDF and spreadsheet.",
  "AI assistant": "Ask a question and get an answer from the school's own records.",
};

export const eduCounts = {
  modules: eduModuleGroups.reduce((n, g) => n + g.modules.length, 0),
  areas: eduModuleGroups.length,
  roles: eduMobile.roles.length,
};

export type EduHighlight = { icon: IconName; title: string; body: string };

export const eduHighlights: EduHighlight[] = [
  { icon: "Layers3", title: "One system, shared records", body: "Academics, people, finance, operations and communication all work from the same records, so a figure is the same everywhere it appears." },
  { icon: "Wallet", title: "Fees and daily collections", body: "Fee plans, payments and the day's collections, calculated from the payments themselves rather than typed in twice." },
  { icon: "Bus", title: "Transport with a live map", body: "Routes drawn on a real map, and live buses on the road while a trip is running." },
  { icon: "Smartphone", title: "A mobile app for every role", body: "Parents, teachers, hostel wardens, attenders and bus drivers each have their own role. Administration stays on the web." },
  { icon: "Bot", title: "An assistant for the school", body: "Ask a question in plain language and get an answer from the school's own records." },
  { icon: "FileSpreadsheet", title: "Reports that download", body: "Reports grouped by area, each one available as a PDF and as a spreadsheet." },
  { icon: "MessagesSquare", title: "Communication built in", body: "Messages from families, announcements to each role, and WhatsApp messages to parents." },
  { icon: "SlidersHorizontal", title: "Customizable by institution", body: "In an institutional build, workflows, modules, roles, reports and the mobile app are shaped around the institution, and optional add-ons such as online payments are built to requirement." },
];

export type EduRole = { icon: IconName; role: string; body: string };

export const eduRoleSummaries: EduRole[] = [
  { icon: "Building2", role: "Administration", body: "Manages the whole institution on the web: academics, people, finance, operations and reports." },
  { icon: "NotebookPen", role: "Teachers", body: "Their own account and mobile role, for the classes they teach." },
  { icon: "HeartHandshake", role: "Parents", body: "Attendance, timetable, results, fees, the bus, library, hostel and notices for each child." },
  { icon: "Bed", role: "Hostel wardens", body: "Their own mobile role, for the hostel they look after." },
  { icon: "UserCog", role: "Attenders", body: "Their own mobile role, for day-to-day work on campus." },
  { icon: "Bus", role: "Bus drivers", body: "Their route and their trips. Location is shared only while a trip is running." },
];
