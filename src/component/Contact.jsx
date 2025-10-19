/**
 * ContactsApp.jsx
 * --------------------------------------------------------------
 * Responsive React contacts application using Vite + Tailwind CSS.
 * Features:
 *  - Fetch & display contacts (JSONPlaceholder + dummy data)
 *  - Search filter by name/email/company
 *  - Clickable contact cards with modal view
 *  - Light/Dark theme toggle with persistence (localStorage)
 *  - Polished corporate UI with accessible colors
 */

import React, { useState, useEffect } from "react";
import {
  Mail, Building2, MapPin, Search,
  Loader2, X, Briefcase, Sun, Moon
} from "lucide-react";

const THEME_KEY = "contacts-theme";

export default function ContactsApp() {
  /* ******** THEME HANDLING ******** */
  const getSystemPrefersDark = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const getInitialDark = () => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) : null;
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return getSystemPrefersDark();
  };

  const [isDark, setIsDark] = useState(getInitialDark);
  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  /* ******************BRAND COLORS****************** */
  const brand = {
    primary: "#0F172A",   // Navy
    secondary: "#6366F1", // Indigo
    text: "#1E293B",
  };

  const bgStyle = isDark
    ? "radial-gradient(circle at 40% 20%, #0B1220 0%, #0F172A 60%, #111827 100%)"
    : "radial-gradient(circle at 40% 20%, #F1F5F9 0%, #E2E8F0 60%, #CBD5E1 100%)";

  const pageText     = isDark ? "#E5E7EB" : brand.text;
  const cardBg       = isDark ? "#0F172A" : "#FFFFFF";
  const cardBorder   = isDark ? "#1F2937" : "#E2E8F0";
  const subText      = isDark ? "#9CA3AF" : "#64748B";
  const headingColor = isDark ? "#FFFFFF" : brand.primary;
  const overlayBg    = isDark ? "rgba(2,6,23,0.75)" : "rgba(15,23,42,0.6)";

  /* ****************** CONTACT DATA ****************** */
  const dummyContacts = [
    {
      id: 101,
      name: "Sarah Mitchell",
      username: "sarahm",
      email: "sarah.mitchell@techcorp.com",
      phone: "+1 (555) 123-4567",
      website: "sarahmitchell.dev",
      company: { name: "TechCorp Solutions", catchPhrase: "Innovating the future of technology" },
      address: { city: "San Francisco", zipcode: "94105" },
    },
    {
      id: 102,
      name: "Marcus Johnson",
      username: "mjohnson",
      email: "marcus.j@designstudio.io",
      phone: "+1 (555) 987-6543",
      website: "marcusdesigns.com",
      company: { name: "Design Studio Pro", catchPhrase: "Where creativity meets functionality" },
      address: { city: "New York", zipcode: "10001" },
    },
  ];

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => r.json())
      .then((data) => {
        const all = [...dummyContacts, ...data];
        const byId = new Map(all.map((c) => [c.id, c]));
        setContacts([...byId.values()]);
        setLoading(false);
      })
      .catch(() => {
        setContacts(dummyContacts);
        setLoading(false);
      });
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelectedContact(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: bgStyle, color: pageText }}>
      <div className="container mx-auto max-w-7xl px-4 py-12">

        {/* ==================== HEADER ==================== */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: headingColor }}>
              Contacts
            </h1>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-4 transition"
            style={{
              backgroundColor: cardBg,
              color: pageText,
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark
                ? "0 2px 10px rgba(0,0,0,0.3)"
                : "0 2px 10px rgba(15,23,42,0.08)",
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
        </header>

        {/* ==================== SEARCH ==================== */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={20}
            style={{ color: "#94A3B8" }}
          />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-4 text-sm"
            style={{
              borderColor: cardBorder,
              backgroundColor: cardBg,
              color: pageText,
              boxShadow: isDark
                ? "0 3px 12px rgba(0,0,0,0.25)"
                : "0 3px 10px rgba(15,23,42,0.05)",
            }}
          />
        </div>

        {/* ==================== CONTACT GRID ==================== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin mb-3" size={40} style={{ color: brand.secondary }} />
            <p style={{ color: subText }}>Loading contacts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full text-center py-16" style={{ color: subText }}>
                No contacts found.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="cursor-pointer group"
                >
                  <div
                    className="rounded-2xl border p-6 transition-all hover:shadow-md hover:scale-[1.01]"
                    style={{
                      backgroundColor: cardBg,
                      borderColor: cardBorder,
                      boxShadow: isDark
                        ? "0 6px 24px rgba(0,0,0,0.35)"
                        : "0 6px 20px rgba(15,23,42,0.08)",
                    }}
                  >
                    {/* Card Header */}
                    <div className="flex items-start mb-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-14 w-14 flex items-center justify-center rounded-lg font-bold text-xl"
                          style={{ backgroundColor: brand.secondary, color: "white" }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: headingColor }}>
                            {contact.name}
                          </h3>
                          <p className="text-sm" style={{ color: subText }}>
                            @{contact.username}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3" style={{ color: subText }}>
                        <Mail size={16} />
                        <p>{contact.email}</p>
                      </div>
                      <div className="flex items-center gap-3" style={{ color: subText }}>
                        <Building2 size={16} />
                        <p className="font-medium">{contact.company.name}</p>
                      </div>
                    </div>

                    {/* View Details Button (Simple Blue) */}
                    <div className="mt-5 border-t pt-4" style={{ borderColor: cardBorder }}>
                      <button
                        className="w-full rounded-lg py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        style={{ boxShadow: "0 4px 10px rgba(37,99,235,0.3)" }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== MODAL ==================== */}
        {selectedContact && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: overlayBg }}
            onClick={() => setSelectedContact(null)}
          >
            <div
              className="rounded-2xl overflow-hidden max-w-3xl w-full"
              style={{
                backgroundColor: cardBg,
                color: pageText,
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark
                  ? "0 24px 60px rgba(0,0,0,0.5)"
                  : "0 24px 60px rgba(15,23,42,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-8 py-8 text-white relative" style={{ backgroundColor: brand.secondary }}>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="absolute top-6 right-6 rounded-full p-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-6">
                  <div
                    className="h-24 w-24 flex items-center justify-center rounded-2xl text-3xl font-black border-4"
                    style={{
                      backgroundColor: brand.primary,
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "white",
                    }}
                  >
                    {getInitials(selectedContact.name)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-white">{selectedContact.name}</h2>
                    <p className="text-white/90">@{selectedContact.username}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl border" style={{ borderColor: cardBorder }}>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: headingColor }}>
                      <Mail size={18} /> Contact Info
                    </h3>
                    <p><span className="font-medium">Email:</span> {selectedContact.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedContact.phone}</p>
                    <p><span className="font-medium">Website:</span> {selectedContact.website}</p>
                  </div>

                  <div className="p-6 rounded-xl border" style={{ borderColor: cardBorder }}>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: headingColor }}>
                      <Briefcase size={18} /> Company
                    </h3>
                    <p className="text-xl font-bold">{selectedContact.company.name}</p>
                    <p style={{ color: subText }} className="italic">
                      “{selectedContact.company.catchPhrase}”
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-xl border" style={{ borderColor: cardBorder }}>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: headingColor }}>
                    <MapPin size={18} /> Address
                  </h3>
                  <p>{selectedContact.address.city}, {selectedContact.address.zipcode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
