"use client";

import { Button } from "@/components/ui/button";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full p-4 md:p-6 lg:p-10 bg-linear-to-b from-white via-[#f8fbff] to-background">
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-4xl shadow-2xl">
        {/* Gradient Background with Shine Effect */}
        <div className="absolute inset-0 bg-linear-to-b from-[#1e2235] via-[#2a1f3d] to-[#1a1f35]" />
        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(129,143,195,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(91,104,166,0.2),transparent_50%)]" />

        {/* Shine overlay effect */}
        <div className="absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

        {/* Content */}
        <div className="relative z-10 py-8 text-white md:py-12 lg:py-16 xl:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-10 xl:px-40">
            {/* Title + CTA copy */}
            <div className="mb-10 text-center md:mb-14 lg:mb-16">
              <h2 className="text-white text-2xl font-bold animate-gradient md:text-3xl lg:text-4xl">
                Turning Ideas into Executable
                <br />
                4-Week Ventures
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 bg-linear-to-r from-transparent via-primary to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 md:gap-6 lg:gap-8">
              {/* Column 1: Branding & micro-CTA + socials */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg bg-primary/30 blur-xl" />
                    <Image
                      src="/logo.svg"
                      alt="SprintPlanner logo"
                      width={40}
                      height={40}
                      className="relative h-10 w-10"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    SprintPlanner
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-white">
                  Simplifying Planning,
                  <br />
                  Amplifying Productivity.
                </p>

                <p className="text-xs text-white">
                  Turn raw ideas into execution-ready 4-week sprints — with
                  structure, accountability and investor-ready outputs baked in.
                </p>

                <div className="mt-1">
                  <Button className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-primary/70 hover:shadow-primary/30 rounded-full px-6 text-sm font-medium">
                    Start free
                  </Button>

                  <div className="mt-4 flex flex-wrap items-center justify-start gap-3 text-xs text-white">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      No credit card for first sprint
                    </div>
                    <span className="text-white opacity-40">•</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Built for solo builders & small teams
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-all duration-300 hover:scale-110 hover:rotate-3 hover:text-primary"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-all duration-300 hover:scale-110 hover:rotate-3 hover:text-primary"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-all duration-300 hover:scale-110 hover:rotate-3 hover:text-primary"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-all duration-300 hover:scale-110 hover:rotate-3 hover:text-primary"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Right side: Links */}
              <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-end gap-8 sm:gap-12 md:gap-16">
                {/* Company */}
                <div className="flex flex-col gap-5">
                  <h3 className="relative mb-1 inline-block text-base font-bold text-white">
                    Company
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                  </h3>
                  <ul className="flex flex-col gap-3.5">
                    <li>
                      <Link
                        href="/about"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white"
                      >
                        <span className="relative z-10">About us</span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/careers"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white"
                      >
                        <span className="relative z-10">Careers</span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/pricing"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white"
                      >
                        <span className="relative z-10">Pricing</span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Talk to us */}
                <div className="flex flex-col gap-5">
                  <h3 className="relative mb-1 inline-block text-base font-bold text-white">
                    Talk to us
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                  </h3>
                  <ul className="flex flex-col gap-3.5">
                    <li>
                      <Link
                        href="mailto:hiteshsolanki4623@gmail.com"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white break-all"
                      >
                        <span className="relative z-10">
                          hiteshsolanki4623@gmail.com
                        </span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="tel:+919004713782"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white"
                      >
                        <span className="relative z-10">+91 9004713782</span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="group relative inline-block text-sm text-white transition-all duration-300 hover:text-white"
                      >
                        <span className="relative z-10">Contact us</span>
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-linear-to-r from-primary to-transparent transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom mini-strip */}
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white md:flex-row">
              <p>
                © {new Date().getFullYear()} SprintPlanner. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/terms" className="text-white hover:text-white">
                  Terms
                </Link>
                <Link href="/privacy" className="text-white hover:text-white">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
