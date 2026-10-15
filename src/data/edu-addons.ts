import type { IconName } from "@/components/ui/Icon";

/**
 * Optional capabilities that are not part of the standard Aison Edu platform.
 * They are scoped and developed per institution, on request, so none of these
 * should be described as already available.
 */

export type EduAddon = { icon: IconName; title: string; body: string };
export type EduAddonGroup = { id: string; label: string; icon: IconName; items: EduAddon[] };

export const eduAddonGroups: EduAddonGroup[] = [
  {
    id: "payments",
    label: "Payments and finance",
    icon: "CreditCard",
    items: [
      { icon: "CreditCard", title: "Payment gateway integration", body: "Families pay fees online through the institution's chosen payment gateway, and payments post straight to the fee records." },
      { icon: "QrCode", title: "UPI and QR collection", body: "Collect fees at the counter or from home with QR and UPI, reconciled against daily collections." },
      { icon: "Calculator", title: "Accounting integration", body: "Send collections and expenses to the institution's accounting software." },
      { icon: "Landmark", title: "Scholarships and concessions", body: "Rules for concessions, waivers and scholarships applied to fee plans automatically." },
    ],
  },
  {
    id: "campus",
    label: "Campus automation",
    icon: "Fingerprint",
    items: [
      { icon: "Fingerprint", title: "Biometric and RFID attendance", body: "Capture attendance for students and staff from devices at the gate or in the classroom." },
      { icon: "IdCard", title: "ID cards and certificates", body: "Generate ID cards, bonafide and transfer certificates in the institution's own format." },
      { icon: "Utensils", title: "Canteen and mess", body: "Meal plans, attendance and accounts for the canteen or hostel mess." },
      { icon: "Users", title: "Visitor management", body: "Record who visits, whom they meet and when they leave." },
    ],
  },
  {
    id: "learning",
    label: "Learning and admissions",
    icon: "MonitorPlay",
    items: [
      { icon: "UserPlus", title: "Online admissions", body: "An enquiry and application flow that feeds straight into the student records." },
      { icon: "MonitorPlay", title: "Online classes and content", body: "Share lessons, assignments and learning material with each class." },
      { icon: "ClipboardList", title: "Online exams", body: "Question banks and exams taken on screen, with results flowing into the marks." },
      { icon: "PanelsTopLeft", title: "Student and parent web portal", body: "A browser portal for families and students alongside the mobile app." },
      { icon: "Award", title: "Board-specific report cards", body: "Report card layouts and grading rules shaped to the board and institution." },
    ],
  },
  {
    id: "people",
    label: "People and wellbeing",
    icon: "Briefcase",
    items: [
      { icon: "Briefcase", title: "Staff HR and payroll", body: "Staff records, leave and salary processing alongside the rest of the system." },
      { icon: "UserSearch", title: "Staff recruitment", body: "Openings, applicants and hiring steps for the institution's own staff." },
      { icon: "HeartPulse", title: "Health records", body: "Student health information and infirmary visits, with the right access controls." },
      { icon: "CalendarDays", title: "Events and meetings", body: "School calendar, events and parent-teacher meeting scheduling." },
      { icon: "BellRing", title: "SMS and email alerts", body: "Alerts through an SMS or email provider the institution already uses." },
    ],
  },
  {
    id: "administration",
    label: "Administration and compliance",
    icon: "Workflow",
    items: [
      { icon: "Workflow", title: "Approval workflows", body: "Requests such as leave, purchases and gate passes routed to the right approver." },
      { icon: "ShoppingCart", title: "Procurement", body: "Purchase requests, orders and vendors tied to inventory and accounts." },
      { icon: "FileCheck", title: "Compliance reports", body: "Reports laid out for the returns and audits an institution has to file." },
      { icon: "MessageSquareHeart", title: "Feedback and polls", body: "Surveys and polls for parents, students and staff, with the results collected." },
      { icon: "Handshake", title: "Alumni and placement", body: "Alumni records and placement tracking for institutions that need them." },
      { icon: "ShieldCheck", title: "Device and access security", body: "Control which devices and locations can reach the system." },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: "Plug",
    items: [
      { icon: "Plug", title: "Third-party integrations", body: "Connect Aison Edu to the other systems an institution already depends on." },
      { icon: "Globe", title: "Institution website link", body: "Show notices, admissions and results on the institution's own website." },
      { icon: "Blocks", title: "Anything else you need", body: "If a requirement is not here, we scope it with you and build it." },
    ],
  },
];
