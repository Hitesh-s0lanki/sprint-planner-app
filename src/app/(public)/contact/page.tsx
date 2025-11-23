"use client";

import { Mail, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ContactForm from "./_components/contact-form";

const contactItems = [
  {
    label: "Customer Support",
    description: "@sprintplanner_support",
    icon: MessageCircle,
  },
  {
    label: "Business Inquiries",
    description: "+91 9004713782",
    icon: Phone,
  },
  {
    label: "Media & Partnerships",
    description: "hiteshsolanki4623@gmail.com",
    icon: Mail,
  },
];

const ContactPage = () => {
  return (
    <section className="relative w-full min-h-screen border-b bg-linear-to-b from-white via-[#f8fbff] to-white">
      <div className="flex min-h-screen max-w-full flex-col md:flex-row px-4 md:px-10 lg:px-20">
        {/* Left panel - Contact Info */}
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 md:w-1/2 md:px-10 lg:px-20">
          <div className="max-w-xl space-y-8 md:space-y-10">
            {/* Badge */}
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Get in Touch
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Let&apos;s start a conversation
              </h1>
              <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                We&apos;d love to hear from you. Reach out for product
                questions, collaboration ideas, or anything SprintPlanner
                related.
              </p>
            </div>

            {/* Contact blocks */}
            <div className="space-y-6">
              {contactItems.map(({ label, description, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Small note */}
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">
                  Response time:
                </span>{" "}
                We usually respond within 24–48 hours on business days.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - Contact Form */}
        <div className="flex w-full items-center justify-center bg-slate-50/50 px-4 py-12 md:w-1/2 ">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
