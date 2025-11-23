import React from "react";
import { ShieldCheck, Lock, FileText } from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

const LegalPage = ({ title, date, children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-100">
    <Navbar />
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="border-b border-slate-100 pb-10 mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-slate-500 font-medium">Last updated: {date}</p>
          </div>
          <div className="prose prose-slate prose-lg max-w-none hover:prose-a:text-blue-600 prose-headings:font-bold prose-headings:tracking-tight text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

// --- EXPORTS ---

export const Privacy = () => (
  <LegalPage title="Privacy Policy" date="November 24, 2025">
    <p>At Taskify, we take your privacy seriously. This policy describes how we collect, use, and handle your data...</p>
    <h3>1. Information We Collect</h3>
    <p>We collect information directly from you when you register, such as your name, email, and organization details.</p>
    {/* Add more dummy content here */}
  </LegalPage>
);

export const Terms = () => (
  <LegalPage title="Terms of Service" date="November 24, 2025">
    <p>By accessing or using Taskify, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
    <h3>1. Account Terms</h3>
    <p>You are responsible for maintaining the security of your account and password. Taskify cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
  </LegalPage>
);

export const Security = () => (
  <LegalPage title="Security Overview" date="November 24, 2025">
    <div className="flex gap-4 mb-8 not-prose">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold"><ShieldCheck size={16}/> SOC2 Compliant</div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold"><Lock size={16}/> 256-bit Encryption</div>
    </div>
    <p>Security is the bedrock of our platform. We use enterprise-grade encryption for data in transit and at rest.</p>
    <h3>Infrastructure</h3>
    <p>Our infrastructure is hosted on AWS data centers that have been certified as ISO 27001, PCI DSS Level 1, and SOC 2 compliant.</p>
  </LegalPage>
);