"use client";

import type { ReactNode } from "react";

type AppIconProps = {
  children: ReactNode;
  bg: string;
};

function AppTile({ children, bg }: AppIconProps) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div
        className={`grid h-[72px] w-[72px] place-items-center rounded-2xl bg-surface shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:h-[80px] sm:w-[80px] ${bg}`}
      >
        {children}
      </div>
    </div>
  );
}

function IconAccounting() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#9C6BAA" opacity="0.2" />
      <text x="24" y="31" textAnchor="middle" fill="#714B67" fontSize="22" fontWeight="700">%</text>
    </svg>
  );
}

function IconInvoicing() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="12" y="8" width="24" height="32" rx="3" fill="#5B8DEF" />
      <rect x="16" y="14" width="16" height="2" rx="1" fill="white" />
      <rect x="16" y="20" width="12" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="16" y="26" width="14" height="2" rx="1" fill="white" opacity="0.7" />
    </svg>
  );
}

function IconGST() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="8" y="14" width="32" height="20" rx="4" fill="#2EAD6F" />
      <text x="24" y="29" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">GST</text>
    </svg>
  );
}

function IconInventory() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <path d="M10 20 L24 12 L38 20 L38 36 L10 36 Z" fill="#F5A623" />
      <path d="M10 20 L24 28 L38 20" fill="#E8941A" />
      <rect x="18" y="26" width="12" height="10" rx="1" fill="#FFF3D6" />
    </svg>
  );
}

function IconSales() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="20" cy="22" r="10" fill="#E85D75" />
      <path d="M28 30 C32 26 36 28 38 32" stroke="#E85D75" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="36" cy="34" r="4" fill="#F5A623" />
    </svg>
  );
}

function IconPurchase() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="10" y="16" width="28" height="20" rx="3" fill="#00A09D" />
      <path d="M16 16 V12 C16 9 19 7 24 7 C29 7 32 9 32 12 V16" stroke="#00A09D" strokeWidth="3" fill="none" />
      <circle cx="24" cy="28" r="4" fill="white" />
    </svg>
  );
}

function IconBanking() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <path d="M8 20 L24 10 L40 20" stroke="#5B8DEF" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="12" y="22" width="6" height="14" fill="#5B8DEF" />
      <rect x="21" y="22" width="6" height="14" fill="#5B8DEF" />
      <rect x="30" y="22" width="6" height="14" fill="#5B8DEF" />
      <rect x="8" y="36" width="32" height="3" rx="1" fill="#5B8DEF" />
    </svg>
  );
}

function IconReports() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="12" y="10" width="8" height="28" rx="2" fill="#9C6BAA" />
      <rect x="22" y="18" width="8" height="20" rx="2" fill="#714B67" />
      <rect x="32" y="14" width="8" height="24" rx="2" fill="#C4A0D0" />
    </svg>
  );
}

function IconCRM() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="18" cy="20" r="8" fill="#F5A623" />
      <circle cx="32" cy="20" r="8" fill="#E8941A" />
      <path d="M12 36 C14 30 22 28 24 28 C26 28 34 30 36 36" fill="#F5A623" />
    </svg>
  );
}

function IconPayroll() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <circle cx="24" cy="18" r="8" fill="#00A09D" />
      <path d="M10 40 C12 32 18 30 24 30 C30 30 36 32 38 40" fill="#00A09D" />
      <rect x="30" y="8" width="12" height="8" rx="2" fill="#2EAD6F" />
      <text x="36" y="14" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">₹</text>
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="10" y="10" width="14" height="14" rx="3" fill="#714B67" />
      <rect x="26" y="10" width="14" height="14" rx="3" fill="#9C6BAA" />
      <rect x="10" y="26" width="14" height="14" rx="3" fill="#C4A0D0" />
      <rect x="26" y="26" width="14" height="14" rx="3" fill="#714B67" opacity="0.6" />
    </svg>
  );
}

function IconDocuments() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
      <rect x="14" y="8" width="18" height="24" rx="2" fill="#5B8DEF" transform="rotate(-6 23 20)" />
      <rect x="18" y="12" width="18" height="24" rx="2" fill="#7BA7F7" transform="rotate(4 27 24)" />
      <rect x="16" y="16" width="18" height="24" rx="2" fill="white" stroke="#5B8DEF" strokeWidth="1.5" />
      <rect x="20" y="22" width="10" height="2" rx="1" fill="#5B8DEF" opacity="0.5" />
      <rect x="20" y="28" width="8" height="2" rx="1" fill="#5B8DEF" opacity="0.5" />
    </svg>
  );
}

const APPS = [
  { label: "Accounting", icon: IconAccounting },
  { label: "Invoicing", icon: IconInvoicing },
  { label: "GST", icon: IconGST },
  { label: "Inventory", icon: IconInventory },
  { label: "Sales", icon: IconSales },
  { label: "Purchase", icon: IconPurchase },
  { label: "Banking", icon: IconBanking },
  { label: "Reports", icon: IconReports },
  { label: "CRM", icon: IconCRM },
  { label: "Payroll", icon: IconPayroll },
  { label: "Dashboard", icon: IconDashboard },
  { label: "Documents", icon: IconDocuments },
];

export function TalleyAppGrid() {
  return (
    <section id="apps" className="relative bg-[#F0F0F0] pb-16 pt-4">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-6 md:gap-x-6">
          {APPS.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <AppTile bg="">
                <Icon />
              </AppTile>
              <span className="text-center text-[13px] text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
