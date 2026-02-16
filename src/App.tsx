import { useState, useMemo, useEffect, useCallback } from "react";

// ============================================
// DATA (Données Initiales)
// ============================================
const INIT_PATIENTS = [
  { id: "p1", nom: "Fatima Zahra Benjelloun", telephone: "+212661234567", adresse: "12 Rue Moulay Youssef, Maarif, Casa", type: "Femme Enceinte", semaineDebut: 24, dateBilan: "2026-01-15", notes: "Grossesse normale, léger mal de dos lombaire", medecin: "Dr. Amrani", objectif: 10, actif: true },
  { id: "p2", nom: "Youssef El Idrissi", telephone: "+212662345678", adresse: "45 Av Hassan II, Agdal, Rabat", type: "Sportif", semaineDebut: null, dateBilan: "2026-02-01", notes: "Rupture LCA opérée, rééducation en cours", medecin: "Dr. Bennani", objectif: 15, actif: true },
  { id: "p3", nom: "Khadija Alami", telephone: "+212663456789", adresse: "8 Rue Allal Ben Abdellah, Casa", type: "Post-Partum", semaineDebut: null, dateBilan: "2026-01-20", notes: "Accouchement voie basse, rééducation périnéale", medecin: "Dr. Fassi", objectif: 10, actif: true },
  { id: "p4", nom: "Mohammed Tazi", telephone: "+212664567890", adresse: "23 Bd Zerktouni, Casa", type: "Senior", semaineDebut: null, dateBilan: "2026-02-10", notes: "Arthrose cervicale, raideur épaule droite", medecin: "Dr. Chraibi", objectif: 8, actif: true },
  { id: "p5", nom: "Salma Berrada", telephone: "+212665678901", adresse: "15 Rue de Fès, Hay Riad, Rabat", type: "Standard", semaineDebut: null, dateBilan: "2026-02-05", notes: "Stress chronique, tensions musculaires", medecin: "", objectif: 0, actif: true },
];

const PRESTATIONS = [
  { id: "pr1", nom: "Consultation Bilan", code: "AMK15", cat: "Bilan", duree: 45, prix: 200, majDom: 50, secu: true },
  { id: "pr2", nom: "Rééducation Périnéale", code: "AMK10", cat: "Rééducation", duree: 30, prix: 150, majDom: 40, secu: true },
  { id: "pr3", nom: "Kiné Respi", code: "AMK8", cat: "Kiné", duree: 20, prix: 120, majDom: 40, secu: true },
  { id: "pr4", nom: "Kiné Générale", code: "AMK10", cat: "Kiné", duree: 30, prix: 150, majDom: 40, secu: true },
  { id: "pr5", nom: "Massage 30min", code: null, cat: "Bien-être", duree: 30, prix: 200, majDom: 60, secu: false },
  { id: "pr6", nom: "Massage 1h", code: null, cat: "Bien-être", duree: 60, prix: 350, majDom: 80, secu: false },
  { id: "pr7", nom: "Drainage Lymphatique", code: null, cat: "Bien-être", duree: 45, prix: 300, majDom: 60, secu: false },
];

const INIT_SEANCES = [
  { id: "s1", patientId: "p1", prestationId: "pr2", date: "2026-02-16T09:00", lieu: "Cabinet", statut: "Programmé", paiement: null, prix: 150, encaisse: 0 },
  { id: "s2", patientId: "p2", prestationId: "pr4", date: "2026-02-16T10:30", lieu: "Cabinet", statut: "Programmé", paiement: null, prix: 150, encaisse: 0 },
  { id: "s3", patientId: "p3", prestationId: "pr2", date: "2026-02-16T14:00", lieu: "Domicile", statut: "Programmé", paiement: null, prix: 190, encaisse: 0 },
  { id: "s4", patientId: "p4", prestationId: "pr6", date: "2026-02-16T16:00", lieu: "Cabinet", statut: "Programmé", paiement: "Pack Prépayé", prix: 350, encaisse: 0 },
  { id: "s5", patientId: "p5", prestationId: "pr6", date: "2026-02-17T11:00", lieu: "Cabinet", statut: "Programmé", paiement: "Pack Prépayé", prix: 350, encaisse: 0 },
  { id: "s6", patientId: "p1", prestationId: "pr2", date: "2026-02-10T09:00", lieu: "Cabinet", statut: "Effectué", paiement: "Mutuelle/CNSS", prix: 150, encaisse: 150 },
  { id: "s7", patientId: "p1", prestationId: "pr2", date: "2026-02-03T09:00", lieu: "Cabinet", statut: "Effectué", paiement: "Mutuelle/CNSS", prix: 150, encaisse: 150 },
  { id: "s8", patientId: "p2", prestationId: "pr4", date: "2026-02-12T10:30", lieu: "Cabinet", statut: "Effectué", paiement: "Espèces", prix: 150, encaisse: 150 },
  { id: "s9", patientId: "p3", prestationId: "pr2", date: "2026-02-09T14:00", lieu: "Domicile", statut: "Effectué", paiement: "Espèces", prix: 190, encaisse: 190 },
  { id: "s10", patientId: "p4", prestationId: "pr4", date: "2026-02-05T11:00", lieu: "Domicile", statut: "Effectué", paiement: "Espèces", prix: 190, encaisse: 100 },
  { id: "s11", patientId: "p5", prestationId: "pr6", date: "2026-02-11T11:00", lieu: "Cabinet", statut: "Effectué", paiement: "Pack Prépayé", prix: 350, encaisse: 0 },
];

const INIT_PACKS = [
  { id: "pk1", patientId: "p5", nom: "Pack 5 Massages", type: "Massage", total: 5, prixTotal: 1500, paye: 1500, expiration: "2026-06-30" },
  { id: "pk2", patientId: "p4", nom: "Pack 10 Massages", type: "Massage", total: 10, prixTotal: 2800, paye: 1500, expiration: "2026-08-31" },
];

const EXERCICES = [
  { id: "e1", titre: "Respiration Abdominale", cat: "Respiration", niveau: "Débutant", video: "https://youtube.com/watch?v=example1", desc: "Exercice de base pour la respiration diaphragmatique", duree: "5 min", freq: "3x/jour" },
  { id: "e2", titre: "Contraction Périnée (Kegel)", cat: "Périnée", niveau: "Débutant", video: "https://youtube.com/watch?v=example2", desc: "Séries de contractions du plancher pelvien", duree: "10 min", freq: "2x/jour" },
  { id: "e3", titre: "Bascule du Bassin", cat: "Dos", niveau: "Débutant", video: "https://youtube.com/watch?v=example3", desc: "Mobilisation douce du bassin allongé", duree: "5 min", freq: "2x/jour" },
  { id: "e4", titre: "Étirement Cervical", cat: "Mobilité", niveau: "Débutant", video: "https://youtube.com/watch?v=example4", desc: "Étirements doux nuque et trapèzes", duree: "8 min", freq: "1x/jour" },
  { id: "e5", titre: "Gainage Transverse", cat: "Abdominaux", niveau: "Intermédiaire", video: "https://youtube.com/watch?v=example5", desc: "Renforcement profond des abdos transverses", duree: "10 min", freq: "1x/jour" },
  { id: "e6", titre: "Pont Fessier", cat: "Renforcement", niveau: "Débutant", video: "https://youtube.com/watch?v=example6", desc: "Renforcement fessiers et stabilisation bassin", duree: "8 min", freq: "1x/jour" },
  { id: "e7", titre: "Fausse Inspiration Thoracique", cat: "Post-Partum", niveau: "Intermédiaire", video: "https://youtube.com/watch?v=example7", desc: "Technique avancée rééducation abdominale post-partum", duree: "5 min", freq: "1x/jour" },
];

const PAIEMENTS = ["Espèces", "Chèque", "Virement", "TPE", "Pack Prépayé", "Mutuelle/CNSS"];

// ============================================
// DESIGN TOKENS
// ============================================
const C = {
  primary: "#1B3C2D",
  primaryLight: "#2D5A3D",
  primarySoft: "#E8F5EE",
  bg: "#F1F4F0",
  surface: "#FFFFFF",
  surfaceDim: "#F4F6F4",
  text: "#1A2E1A",
  text2: "#5F7A6A",
  text3: "#8FA89A",
  border: "#D8E0D8",
  borderLight: "#E8ECE8",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  dangerFg: "#991B1B",
  success: "#065F46",
  successBg: "#ECFDF5",
  orange: "#EA580C",
  orangeBg: "#FFF7ED",
  orangeFg: "#9A3412",
  teal: "#0D9488",
  tealBg: "#F0FDFA",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  blueFg: "#1E40AF",
  wa: "#25D366",
  roseBg: "#FFF1F2",
  roseFg: "#BE123C",
  roseMid: "#F43F5E",
  roseAccent: "#9F1239",
  roseBorder: "#FECDD3",
  roseTrack: "#FFE4E6",
  yellowBg: "#FEF9C3",
  yellowFg: "#854D0E",
  r: 14,
  rLg: 16,
};

const TYPE_MAP = {
  "Femme Enceinte": { bg: C.roseBg, fg: C.roseFg, icon: "🤰" },
  "Post-Partum": { bg: C.orangeBg, fg: C.orangeFg, icon: "🤱" },
  Sportif: { bg: C.successBg, fg: C.success, icon: "⚽" },
  Senior: { bg: C.blueBg, fg: C.blueFg, icon: "🩺" },
  Pédiatrie: { bg: C.purpleBg, fg: C.purple, icon: "👶" },
  Bébé: { bg: C.purpleBg, fg: C.purple, icon: "👶" },
  Standard: { bg: C.primarySoft, fg: C.primary, icon: "🧑" },
};

const STAT_MAP = {
  Programmé: { bg: C.blueBg, fg: C.blueFg },
  Effectué: { bg: C.successBg, fg: C.success },
  Annulé: { bg: C.dangerBg, fg: C.dangerFg },
  Absence: { bg: C.yellowBg, fg: C.yellowFg },
  Reporté: { bg: C.purpleBg, fg: C.purple },
};

const CAT_ICON = { Périnée: "🫁", Dos: "🦴", Abdominaux: "💪", Respiration: "🌬️", "Post-Partum": "🤱", Mobilité: "🧘", Renforcement: "🏋️" };

// ============================================
// UTILS
// ============================================
const fMAD = (n) => `${(n || 0).toLocaleString("fr-MA")} MAD`;
const fTime = (d) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const fDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
const fDateFull = (d) => new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const uid = () => "id_" + Math.random().toString(36).slice(2, 9);
const waUrl = (tel, msg = "") => `https://wa.me/${(tel || "").replace(/[\s+]/g, "")}?text=${encodeURIComponent(msg)}`;
const gpsUrl = (a) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
const calcSA = (sw, db) => {
  if (!sw || !db) return null;
  const diff = Date.now() - new Date(db).getTime();
  const w = sw + Math.floor(diff / 604800000);
  const d = Math.floor((diff % 604800000) / 86400000);
  return { w, d, pct: Math.min((w / 40) * 100, 100) };
};

// ============================================
// SVG ICONS
// ============================================
const Ic = {
  home: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m-6 0h6"/></svg>,
  users: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>,
  cal: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  book: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  back: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  phone: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  pin: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  wa: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  search: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  x: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  play: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  edit: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  chevL: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
  plus: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>,
  check: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  refresh: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  cash: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
};

// ============================================
// SHARED COMPONENTS
// ============================================
const Badge = ({ children, bg, fg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color: fg, lineHeight: 1.4 }}>{children}</span>
);

const Card = ({ children, onClick, style: sx }) => (
  <div onClick={onClick} style={{ background: C.surface, borderRadius: C.rLg, padding: 16, marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : "default", ...sx }}>{children}</div>
);

const StatusBar = ({ lieu }) => (
  <div style={{ width: 3, minHeight: 36, borderRadius: 2, background: lieu === "Domicile" ? C.orange : C.teal, flexShrink: 0 }} />
);

const Header = ({ title, sub, left, right }) => (
  <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryLight} 100%)`, color: "white", padding: "16px 16px 14px", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", gap: 10 }}>
    {left}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, opacity: 0.6, marginTop: 1 }}>{sub}</div>}
    </div>
    {right}
  </div>
);

const Section = ({ title, right, children, mt }) => (
  <div style={{ padding: "0 16px", marginBottom: 14, marginTop: mt || 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</span>
      {right && <span style={{ fontSize: 12, fontWeight: 600, color: C.text2 }}>{right}</span>}
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: C.text3, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
    {children}
  </div>
);

const Input = (props) => <input {...props} style={{ width: "100%", padding: "13px 14px", borderRadius: C.r, border: `1.5px solid ${C.border}`, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: C.text, background: C.surface, ...props.style }} />;

const Select = (props) => <select {...props} style={{ width: "100%", padding: "13px 14px", borderRadius: C.r, border: `1.5px solid ${C.border}`, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: C.text, background: C.surface, ...props.style }} />;

const Btn = ({ children, disabled, variant = "primary", onClick, style: sx }) => {
  const base = { padding: "15px 24px", borderRadius: C.r, border: "none", fontSize: 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", width: "100%", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity .15s" };
  const variants = {
    primary: { background: disabled ? C.border : C.primary, color: "white", opacity: disabled ? 0.5 : 1 },
    outline: { background: C.surface, color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost: { background: "transparent", color: C.text2, padding: "10px 16px" },
    danger: { background: C.danger, color: "white" }
  };
  return <button disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...sx }}>{children}</button>;
};

const OptionBtn = ({ selected, children, onClick }) => (
  <button onClick={onClick} style={{ flex: 1, padding: "12px 6px", borderRadius: C.r, border: selected ? `2px solid ${C.primary}` : `1.5px solid ${C.border}`, background: selected ? C.primarySoft : C.surface, color: selected ? C.primary : C.text2, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>{children}</button>
);

const Sheet = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 70, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: "6px 20px 34px", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 14px" }} />
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{title}</div>
            <div style={{ cursor: "pointer", padding: 4, color: C.text3 }} onClick={onClose}>{Ic.x}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

const Toast = ({ msg, type, show }) => (
  <div style={{ position: "fixed", top: show ? 16 : -80, left: "50%", transform: "translateX(-50%)", zIndex: 100, padding: "12px 24px", borderRadius: C.r, background: type === "success" ? C.success : type === "error" ? C.danger : C.primary, color: "white", fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", transition: "top .35s cubic-bezier(.4,0,.2,1)", maxWidth: "88%", textAlign: "center", fontFamily: "inherit" }}>
    {type === "success" ? "✓ " : ""}{msg}
  </div>
);

const Progress = ({ value, max, color = C.teal }) => (
  <div style={{ height: 4, borderRadius: 2, background: C.borderLight, marginTop: 6 }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", borderRadius: 2, background: color, transition: "width .4s" }} />
  </div>
);

const Empty = ({ text }) => <Card style={{ textAlign: "center", color: C.text3, padding: 36 }}>{text}</Card>;

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [page, setPage] = useState("home");
  const [patients, setPatients] = useState(INIT_PATIENTS);
  const [seances, setSeances] = useState(INIT_SEANCES);
  const [packs] = useState(INIT_PACKS);
  const [selPatient, setSelPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [exoFilter, setExoFilter] = useState("Tous");
  const [calDate, setCalDate] = useState(new Date().toISOString().split("T")[0]);
  const [sheet, setSheet] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success", show: false });

  const flash = useCallback((msg, type = "success") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  }, []);

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
  }, []);

  // DATA
  const gP = (id) => patients.find(p => p.id === id);
  const gPr = (id) => PRESTATIONS.find(p => p.id === id);
  const pSeances = (id) => seances.filter(s => s.patientId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const pDone = (id) => seances.filter(s => s.patientId === id && (s.statut === "Effectué" || s.statut === "Absence")).length;
  const pDebt = (id) => seances.filter(s => s.patientId === id && s.statut === "Effectué").reduce((a, s) => a + Math.max(0, s.prix - s.encaisse), 0);
  const pCredits = (id) => {
    const total = packs.filter(p => p.patientId === id).reduce((a, p) => a + p.total, 0);
    const used = seances.filter(s => s.patientId === id && s.paiement === "Pack Prépayé" && (s.statut === "Effectué" || s.statut === "Absence")).length;
    return total - used;
  };
  const pNextRdv = (id) => seances.filter(s => s.patientId === id && s.statut === "Programmé").sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const todayStr = new Date().toDateString();
  const todayList = useMemo(() => seances.filter(s => new Date(s.date).toDateString() === todayStr).sort((a, b) => new Date(a.date) - new Date(b.date)), [seances, todayStr]);
  const cashToday = useMemo(() => seances.filter(s => new Date(s.date).toDateString() === todayStr && s.statut === "Effectué" && s.paiement === "Espèces").reduce((a, s) => a + s.encaisse, 0), [seances, todayStr]);
  const caMonth = useMemo(() => { const n = new Date(); return seances.filter(s => { const d = new Date(s.date); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() && s.statut === "Effectué"; }).reduce((a, s) => a + s.encaisse, 0); }, [seances]);
  const doneToday = useMemo(() => todayList.filter(s => s.statut === "Effectué").length, [todayList]);
  const debts = useMemo(() => patients.map(p => ({ ...p, dette: pDebt(p.id) })).filter(p => p.dette > 0), [patients, seances]);

  // ACTIONS
  const goDetail = (id) => { setSelPatient(id); setPage("detail"); };
  const goBack = () => { setPage("patients"); setSelPatient(null); };
  const openSheet = (type, data) => { setSheetData(data); setSheet(type); };
  const closeSheet = () => { setSheet(null); setSheetData(null); };

  const doAddSeance = (d) => {
    const pr = gPr(d.prestationId);
    setSeances(prev => [...prev, { id: uid(), ...d, prix: d.lieu === "Domicile" ? pr.prix + pr.majDom : pr.prix, encaisse: 0, statut: "Programmé" }]);
    closeSheet();
    flash("RDV programmé");
  };

  const doComplete = (id, statut, paiement, encaisse, reprog) => {
    const original = seances.find(s => s.id === id);
    setSeances(prev => prev.map(s => s.id === id ? { ...s, statut, paiement, encaisse: Number(encaisse) } : s));
    closeSheet();
    flash(statut === "Effectué" ? "Séance validée" : "Statut mis à jour");
    
    // RE-BOOKING LOGIC
    if (reprog && original) {
      setTimeout(() => {
        openSheet("newRdv", { 
          patientId: original.patientId, 
          prestationId: original.prestationId, 
          lieu: original.lieu,
          reprogram: true
        });
      }, 500);
    }
  };

  const doPayDebt = (pid, amount) => {
    let remain = amount;
    const debtSeances = seances.filter(s => s.patientId === pid && s.statut === "Effectué" && s.prix > s.encaisse).sort((a,b) => new Date(a.date) - new Date(b.date));
    
    const newSeances = seances.map(s => {
      if(s.patientId !== pid || s.statut !== "Effectué" || s.prix <= s.encaisse || remain <= 0) return s;
      const due = s.prix - s.encaisse;
      const pay = Math.min(remain, due);
      remain -= pay;
      return { ...s, encaisse: s.encaisse + pay };
    });
    
    setSeances(newSeances);
    closeSheet();
    flash(`Dette régularisée (${fMAD(amount)})`);
  };

  const doAddPatient = (d) => { setPatients(prev => [...prev, { ...d, id: uid(), actif: true }]); closeSheet(); flash("Patient créé"); };
  const doEditPatient = (id, d) => { setPatients(prev => prev.map(p => p.id === id ? { ...p, ...d } : p)); closeSheet(); flash("Patient mis à jour"); };

  // ==========================================
  // HOME
  // ==========================================
  const Home = () => (
    <div>
      <Header title="KinéCare" sub={fDateFull(new Date())} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "14px 16px 4px" }}>
        {[
          { label: "ESPÈCES", value: fMAD(cashToday), bg: `linear-gradient(135deg, ${C.success}, #047857)` },
          { label: "CA MOIS", value: fMAD(caMonth), bg: `linear-gradient(135deg, #1E3A5F, ${C.blue})` },
          { label: "FAITES", value: `${doneToday}/${todayList.length}`, bg: null },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg || C.surface, borderRadius: C.r, padding: "12px 10px", color: c.bg ? "white" : C.text, boxShadow: c.bg ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: c.bg ? 0.75 : 0.5, letterSpacing: 0.3 }}>{c.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, color: c.bg ? "white" : C.teal }}>{c.value}</div>
          </div>
        ))}
      </div>

      <Section title="Aujourd'hui" right={`${todayList.length} rdv`} mt={12}>
        {todayList.length === 0 ? <Empty text="Pas de RDV aujourd'hui 🌿" /> : todayList.map(s => <SeanceRow key={s.id} s={s} showComplete />)}
      </Section>

      {debts.length > 0 && (
        <Section title="Impayés" right={debts.length}>
          {debts.map(p => (
            <Card key={p.id} onClick={() => goDetail(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.nom}</div><div style={{ fontSize: 12, color: C.text3 }}>{p.telephone}</div></div>
              <span style={{ fontWeight: 700, color: C.danger, fontSize: 15 }}>{fMAD(p.dette)}</span>
            </Card>
          ))}
        </Section>
      )}
    </div>
  );

  const SeanceRow = ({ s, showComplete, showDate }) => {
    const p = gP(s.patientId), pr = gPr(s.prestationId);
    const st = STAT_MAP[s.statut] || STAT_MAP.Programmé;
    return (
      <Card onClick={() => goDetail(s.patientId)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ minWidth: 46, textAlign: "center" }}>
          {showDate && <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{fDate(s.date)}</div>}
          <div style={{ fontSize: showDate ? 11 : 16, fontWeight: 700, color: showDate ? C.text3 : C.primary }}>{fTime(s.date)}</div>
          {!showDate && <div style={{ fontSize: 10, color: C.text3 }}>{pr?.duree}min</div>}
        </div>
        <StatusBar lieu={s.lieu} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p?.nom}</div>
          <div style={{ fontSize: 12, color: C.text2, marginTop: 1 }}>{pr?.nom}</div>
          {s.lieu === "Domicile" && <div style={{ fontSize: 11, color: C.orange, marginTop: 1 }}>🏠 Domicile</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <Badge bg={st.bg} fg={st.fg}>{s.statut}</Badge>
          {showComplete && s.statut === "Programmé" && (
            <button onClick={e => { e.stopPropagation(); openSheet("complete", s); }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, border: "none", background: C.primary, color: "white", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Terminer</button>
          )}
          {s.statut === "Effectué" && s.prix - s.encaisse > 0 && (
            <span style={{ fontSize: 11, color: C.danger, fontWeight: 600 }}>-{fMAD(s.prix - s.encaisse)}</span>
          )}
        </div>
      </Card>
    );
  };

  // ==========================================
  // PATIENTS
  // ==========================================
  const Patients = () => {
    const q = search.toLowerCase();
    const filtered = patients.filter(p => p.actif && (p.nom.toLowerCase().includes(q) || (p.telephone || "").includes(q)));
    return (
      <div>
        <Header title="Patients" sub={`${patients.filter(p => p.actif).length} actifs`} />
        <div style={{ padding: "12px 16px" }}>
          <div style={{ position: "relative" }}>
            <Input placeholder="Nom ou téléphone..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
            <div style={{ position: "absolute", left: 13, top: 14, color: C.text3 }}>{Ic.search}</div>
          </div>
        </div>
        <div style={{ padding: "0 16px" }}>
          {filtered.length === 0 ? <Empty text="Aucun patient trouvé" /> : filtered.map(p => {
            const t = TYPE_MAP[p.type] || TYPE_MAP.Standard;
            const done = pDone(p.id);
            const nxt = pNextRdv(p.id);
            return (
              <Card key={p.id} onClick={() => goDetail(p.id)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nom}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge bg={t.bg} fg={t.fg}>{p.type}</Badge>
                    {p.objectif > 0 && <span style={{ fontSize: 11, color: C.text2 }}>{done}/{p.objectif}</span>}
                    {nxt && <span style={{ fontSize: 11, color: C.teal }}>→ {fDate(nxt.date)} {fTime(nxt.date)}</span>}
                  </div>
                </div>
                <div style={{ color: C.text3 }}>{Ic.chevR}</div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // ==========================================
  // DETAIL
  // ==========================================
  const Detail = () => {
    const p = gP(selPatient);
    if (!p) return null;
    const t = TYPE_MAP[p.type] || TYPE_MAP.Standard;
    const sa = calcSA(p.semaineDebut, p.dateBilan);
    const hist = pSeances(p.id);
    const done = pDone(p.id);
    const debt = pDebt(p.id);
    const credits = pCredits(p.id);
    const hasPacks = packs.some(pk => pk.patientId === p.id);

    return (
      <div>
        <Header
          title={p.nom}
          sub={`${p.type}${p.medecin ? ` · ${p.medecin}` : ""}`}
          left={<div style={{ cursor: "pointer", padding: 4 }} onClick={goBack}>{Ic.back}</div>}
          right={<div style={{ cursor: "pointer", padding: 6, borderRadius: 10, background: "rgba(255,255,255,0.15)" }} onClick={() => openSheet("editPatient", p)}>{Ic.edit}</div>}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "12px 16px 6px" }}>
          {[
            { href: `tel:${p.telephone}`, icon: Ic.phone, label: "Appeler", bg: C.surface, fg: C.primary, shadow: true },
            { href: waUrl(p.telephone, `Bonjour ${p.nom.split(" ")[0]}, `), icon: Ic.wa, label: "WhatsApp", bg: C.wa, fg: "white" },
            p.adresse ? { href: gpsUrl(p.adresse), icon: Ic.pin, label: "GPS", bg: C.surface, fg: C.primary, shadow: true } : null,
          ].filter(Boolean).map((a, i) => (
            <a key={i} href={a.href} target={a.href.startsWith("tel") ? undefined : "_blank"} rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: 12, background: a.bg, borderRadius: C.r, textDecoration: "none", color: a.fg, fontWeight: 600, fontSize: 13, boxShadow: a.shadow ? "0 1px 3px rgba(0,0,0,0.04)" : "none" }}>
              {a.icon} {a.label}
            </a>
          ))}
        </div>

        {p.type === "Femme Enceinte" && sa && (
          <div style={{ margin: "6px 16px 8px", background: `linear-gradient(135deg, ${C.roseBg}, ${C.roseTrack})`, borderRadius: C.rLg, padding: 16, border: `1px solid ${C.roseBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.roseFg, textTransform: "uppercase", letterSpacing: 0.5 }}>Suivi Grossesse</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.roseAccent, marginTop: 3 }}>{sa.w} SA <span style={{ fontSize: 13, fontWeight: 500 }}>+ {sa.d}j</span></div>
              </div>
              <span style={{ fontSize: 34 }}>🤰</span>
            </div>
            <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: C.roseBorder }}>
              <div style={{ width: `${sa.pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, #FB7185, #E11D48)`, transition: "width .5s" }} />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: hasPacks ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, padding: "6px 16px 6px" }}>
          <Card style={{ margin: 0, textAlign: "center", padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.teal }}>{done}{p.objectif > 0 && <span style={{ fontSize: 12, color: C.text3 }}>/{p.objectif}</span>}</div>
            <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Séances</div>
            {p.objectif > 0 && <Progress value={done} max={p.objectif} />}
          </Card>
          {hasPacks && (
            <Card style={{ margin: 0, textAlign: "center", padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: credits > 0 ? C.purple : C.danger }}>{credits}</div>
              <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Pack</div>
            </Card>
          )}
          <Card onClick={() => debt > 0 ? openSheet("payDebt", p) : null} style={{ margin: 0, textAlign: "center", padding: 12, cursor: debt > 0 ? "pointer" : "default", border: debt > 0 ? `1.5px solid ${C.danger}` : "none", background: debt > 0 ? C.dangerBg : C.surface }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: debt > 0 ? C.danger : C.success }}>{fMAD(debt)}</div>
            <div style={{ fontSize: 11, color: debt > 0 ? C.danger : C.text2, marginTop: 2, fontWeight: debt > 0 ? 700 : 400 }}>{debt > 0 ? "PAYER ➔" : "Reste dû"}</div>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "2px 16px 8px" }}>
          <Btn onClick={() => openSheet("newRdv", { patientId: p.id })}>📅 Prochain RDV</Btn>
          <Btn variant="outline" onClick={() => openSheet("sendExo", p)}>📚 Exercices</Btn>
        </div>

        {p.notes && <Section title="Notes médicales"><Card style={{ fontSize: 14, lineHeight: 1.6, color: C.text2 }}>{p.notes}</Card></Section>}

        <Section title="Historique" right={hist.length}>
          {hist.length === 0 ? <Empty text="Aucune séance" /> : hist.map(s => <SeanceRow key={s.id} s={s} showComplete showDate />)}
        </Section>
      </div>
    );
  };

  // ==========================================
  // CALENDAR
  // ==========================================
  const Calendar = () => {
    const daySeances = seances.filter(s => s.date.startsWith(calDate)).sort((a, b) => new Date(a.date) - new Date(b.date));
    const getWeek = () => {
      const d = new Date(calDate), day = d.getDay();
      const start = new Date(d); start.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
      return Array.from({ length: 7 }, (_, i) => { const n = new Date(start); n.setDate(start.getDate() + i); return n; });
    };
    const week = getWeek();
    const dayN = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
    const shift = (dir) => { const d = new Date(calDate); d.setDate(d.getDate() + dir * 7); setCalDate(d.toISOString().split("T")[0]); };

    return (
      <div>
        <Header title="Agenda" sub={fDateFull(new Date(calDate))} />
        <div style={{ display: "flex", alignItems: "center", padding: "10px 6px 6px", background: C.surface }}>
          <button onClick={() => shift(-1)} style={{ border: "none", background: "none", cursor: "pointer", padding: 6, color: C.text2 }}>{Ic.chevL}</button>
          <div style={{ flex: 1, display: "flex", gap: 2 }}>
            {week.map((d, i) => {
              const iso = d.toISOString().split("T")[0];
              const sel = iso === calDate;
              const isT = d.toDateString() === todayStr;
              const has = seances.some(s => s.date.startsWith(iso));
              return (
                <div key={i} onClick={() => setCalDate(iso)} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 12, background: sel ? C.primary : "transparent", color: sel ? "white" : C.text, cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.55 }}>{dayN[i]}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, margin: "2px 0", ...(isT && !sel ? { color: C.teal } : {}) }}>{d.getDate()}</div>
                  {has && <div style={{ width: 5, height: 5, borderRadius: "50%", background: sel ? "white" : C.teal, margin: "0 auto" }} />}
                </div>
              );
            })}
          </div>
          <button onClick={() => shift(1)} style={{ border: "none", background: "none", cursor: "pointer", padding: 6, color: C.text2 }}>{Ic.chevR}</button>
        </div>
        <Section title={fDateFull(new Date(calDate))} right={`${daySeances.length} rdv`} mt={8}>
          {daySeances.length === 0 ? <Empty text="Journée libre 🌿" /> : daySeances.map(s => <SeanceRow key={s.id} s={s} showComplete />)}
        </Section>
      </div>
    );
  };

  // ==========================================
  // EXERCISES
  // ==========================================
  const Exos = () => {
    const cats = ["Tous", ...new Set(EXERCICES.map(e => e.cat))];
    const list = exoFilter === "Tous" ? EXERCICES : EXERCICES.filter(e => e.cat === exoFilter);
    return (
      <div>
        <Header title="Exercices" sub={`${EXERCICES.length} disponibles`} />
        <div style={{ display: "flex", gap: 6, padding: "12px 16px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setExoFilter(c)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", background: exoFilter === c ? C.primary : C.surface, color: exoFilter === c ? "white" : C.text2, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>{CAT_ICON[c] || "📋"} {c}</button>
          ))}
        </div>
        <div style={{ padding: "0 16px" }}>
          {list.map(e => (
            <Card key={e.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{e.titre}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}><Badge bg={C.blueBg} fg={C.blue}>{e.cat}</Badge><Badge bg={C.purpleBg} fg={C.purple}>{e.niveau}</Badge></div>
                </div>
                <a href={e.video} target="_blank" rel="noreferrer" style={{ width: 38, height: 38, borderRadius: 10, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", color: "white", textDecoration: "none", flexShrink: 0 }}>{Ic.play}</a>
              </div>
              <div style={{ fontSize: 13, color: C.text2, marginTop: 8, lineHeight: 1.5 }}>{e.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // SHEETS
  // ==========================================
  const CompleteSheet = () => {
    const s = sheetData; if (!s) return null;
    const p = gP(s.patientId), pr = gPr(s.prestationId);
    const [statut, setSt] = useState("Effectué");
    const [pay, setPay] = useState(s.paiement || "Espèces");
    const [enc, setEnc] = useState(String(s.prix));
    const [reprog, setReprog] = useState(false);
    const hasCredits = pCredits(s.patientId) > 0;

    return (
      <Sheet open onClose={closeSheet} title="Terminer la séance">
        <div style={{ background: C.surfaceDim, borderRadius: C.r, padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{p?.nom}</div>
          <div style={{ fontSize: 13, color: C.text2 }}>{pr?.nom} · {fTime(s.date)} · {fMAD(s.prix)}</div>
        </div>

        <Field label="Résultat">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {["Effectué", "Absence", "Annulé"].map(st => <OptionBtn key={st} selected={statut === st} onClick={() => setSt(st)}>{st}</OptionBtn>)}
          </div>
        </Field>

        {(statut === "Absence" || statut === "Annulé") && (
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, padding: 12, background: C.orangeBg, borderRadius: C.r }}>
            <input type="checkbox" checked={reprog} onChange={e => setReprog(e.target.checked)} style={{ width: 20, height: 20 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: C.orangeFg }}>Reprogrammer ce RDV ?</div>
          </div>
        )}

        {statut === "Effectué" && (
          <>
            <Field label="Mode de paiement">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {PAIEMENTS.map(pm => (
                  <OptionBtn key={pm} selected={pay === pm} onClick={() => { setPay(pm); pm === "Pack Prépayé" ? setEnc("0") : setEnc(String(s.prix)); }}>
                    {pm === "Pack Prépayé" && hasCredits ? "🎫 " : ""}{pm}
                  </OptionBtn>
                ))}
              </div>
            </Field>
            {pay !== "Pack Prépayé" && (
              <Field label={`Montant encaissé (prix: ${fMAD(s.prix)})`}>
                <Input type="number" value={enc} onChange={e => setEnc(e.target.value)} />
                {Number(enc) > 0 && Number(enc) < s.prix && <div style={{ fontSize: 12, color: C.orange, marginTop: 6, fontWeight: 600 }}>⚠ Reste: {fMAD(s.prix - Number(enc))}</div>}
              </Field>
            )}
          </>
        )}

        <Btn onClick={() => doComplete(s.id, statut, statut === "Effectué" ? pay : null, statut === "Effectué" ? (pay === "Pack Prépayé" ? 0 : Number(enc)) : 0, reprog)}>
          {Ic.check} Valider
        </Btn>
      </Sheet>
    );
  };

  const PayDebtSheet = () => {
    const p = sheetData; if (!p) return null;
    const debt = pDebt(p.id);
    const [amount, setAmount] = useState(String(debt));

    return (
      <Sheet open onClose={closeSheet} title="Régularisation">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.danger }}>{fMAD(debt)}</div>
          <div style={{ fontSize: 13, color: C.text3 }}>Total Impayés</div>
        </div>
        <Field label="Montant Reçu Aujourd'hui">
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ fontSize: 20, fontWeight: 700, color: C.teal, textAlign: "center" }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
           <Btn variant="outline" onClick={() => setAmount(String(debt))}>Tout régler</Btn>
           <Btn onClick={() => doPayDebt(p.id, Number(amount))}>Confirmer {Ic.cash}</Btn>
        </div>
      </Sheet>
    );
  };

  const NewRdvSheet = () => {
    const d = sheetData || {};
    const [f, sf] = useState({ patientId: d.patientId || "", prestationId: d.prestationId || "pr2", date: new Date().toISOString().slice(0, 10), heure: "09:00", lieu: d.lieu || "Cabinet" });
    const patient = gP(f.patientId);
    return (
      <Sheet open onClose={closeSheet} title={d.reprogram ? "Reprogrammer le RDV" : "Nouveau RDV"}>
        {d.reprogram && <div style={{ marginBottom: 14, padding: "8px 12px", background: C.orangeBg, color: C.orangeFg, fontSize: 12, fontWeight: 600, borderRadius: C.r }}>⚠ Reprogrammation suite à annulation/absence</div>}
        <Field label="Patient">
          <Select value={f.patientId} onChange={e => sf({ ...f, patientId: e.target.value })}>
            <option value="">Choisir...</option>
            {patients.filter(p => p.actif).map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </Select>
        </Field>
        <Field label="Prestation">
          <Select value={f.prestationId} onChange={e => sf({ ...f, prestationId: e.target.value })}>
            {PRESTATIONS.map(p => <option key={p.id} value={p.id}>{p.nom} — {fMAD(p.prix)}</option>)}
          </Select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Date"><Input type="date" value={f.date} onChange={e => sf({ ...f, date: e.target.value })} /></Field>
          <Field label="Heure"><Input type="time" value={f.heure} onChange={e => sf({ ...f, heure: e.target.value })} /></Field>
        </div>
        <Field label="Lieu">
          <div style={{ display: "flex", gap: 8 }}>
            {["Cabinet", "Domicile"].map(l => <OptionBtn key={l} selected={f.lieu === l} onClick={() => sf({ ...f, lieu: l })}>{l === "Cabinet" ? "🏢" : "🏠"} {l}</OptionBtn>)}
          </div>
        </Field>
        <Btn disabled={!f.patientId} onClick={() => doAddSeance({ patientId: f.patientId, prestationId: f.prestationId, date: `${f.date}T${f.heure}`, lieu: f.lieu, paiement: null })}>Confirmer le RDV</Btn>
      </Sheet>
    );
  };

  const NewPatientSheet = () => {
    const [f, sf] = useState({ nom: "", telephone: "+212", adresse: "", type: "Standard", semaineDebut: null, dateBilan: new Date().toISOString().slice(0, 10), notes: "", medecin: "", objectif: 0 });
    return (
      <Sheet open onClose={closeSheet} title="Nouveau Patient">
        <Field label="Nom complet"><Input placeholder="Fatima Zahra..." value={f.nom} onChange={e => sf({ ...f, nom: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Téléphone"><Input value={f.telephone} onChange={e => sf({ ...f, telephone: e.target.value })} /></Field>
          <Field label="Profil"><Select value={f.type} onChange={e => sf({ ...f, type: e.target.value })}>{Object.keys(TYPE_MAP).map(t => <option key={t}>{t}</option>)}</Select></Field>
        </div>
        {f.type === "Femme Enceinte" && <Field label="Semaine grossesse"><Input type="number" placeholder="24" value={f.semaineDebut || ""} onChange={e => sf({ ...f, semaineDebut: parseInt(e.target.value) || null })} /></Field>}
        <Field label="Adresse domicile"><Input placeholder="Rue, quartier, ville..." value={f.adresse} onChange={e => sf({ ...f, adresse: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Objectif séances"><Input type="number" value={f.objectif} onChange={e => sf({ ...f, objectif: parseInt(e.target.value) || 0 })} /></Field>
          <Field label="Médecin"><Input placeholder="Dr. ..." value={f.medecin} onChange={e => sf({ ...f, medecin: e.target.value })} /></Field>
        </div>
        <Field label="Notes"><textarea style={{ width: "100%", padding: "13px 14px", borderRadius: C.r, border: `1.5px solid ${C.border}`, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: C.text, minHeight: 60, resize: "vertical" }} placeholder="Antécédents..." value={f.notes} onChange={e => sf({ ...f, notes: e.target.value })} /></Field>
        <Btn disabled={!f.nom} onClick={() => doAddPatient(f)}>Créer le Patient</Btn>
      </Sheet>
    );
  };

  const EditPatientSheet = () => {
    const p = sheetData; if (!p) return null;
    const [f, sf] = useState({ ...p });
    return (
      <Sheet open onClose={closeSheet} title="Modifier le patient">
        <Field label="Nom"><Input value={f.nom} onChange={e => sf({ ...f, nom: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Téléphone"><Input value={f.telephone} onChange={e => sf({ ...f, telephone: e.target.value })} /></Field>
          <Field label="Profil"><Select value={f.type} onChange={e => sf({ ...f, type: e.target.value })}>{Object.keys(TYPE_MAP).map(t => <option key={t}>{t}</option>)}</Select></Field>
        </div>
        <Field label="Adresse"><Input value={f.adresse} onChange={e => sf({ ...f, adresse: e.target.value })} /></Field>
        <Btn onClick={() => doEditPatient(p.id, f)}>Sauvegarder</Btn>
      </Sheet>
    );
  };

  const SendExoSheet = () => {
    const p = sheetData; if (!p) return null;
    const [cat, setCat] = useState("Tous");
    const cats = ["Tous", ...new Set(EXERCICES.map(e => e.cat))];
    const list = cat === "Tous" ? EXERCICES : EXERCICES.filter(e => e.cat === cat);
    return (
      <Sheet open onClose={closeSheet} title={`Envoyer à ${p.nom.split(" ")[0]}`}>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
          {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 12px", borderRadius: 16, border: "none", background: cat === c ? C.primary : C.surfaceDim, color: cat === c ? "white" : C.text2, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }}>{CAT_ICON[c] || "📋"} {c}</button>)}
        </div>
        {list.map(e => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.titre}</div>
              <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>{e.duree} · {e.freq}</div>
            </div>
            <a href={waUrl(p.telephone, `Bonjour ${p.nom.split(" ")[0]} 👋\n\n*${e.titre}*\n${e.desc}\n\n🎥 Vidéo: ${e.video}\n⏱ ${e.duree} · ${e.freq}\n\nBon courage ! 💪`)} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", background: C.wa, borderRadius: 10, color: "white", fontWeight: 600, fontSize: 12, textDecoration: "none", flexShrink: 0, fontFamily: "inherit" }}>{Ic.wa} Envoyer</a>
          </div>
        ))}
      </Sheet>
    );
  };

  const pages = { home: <Home />, patients: <Patients />, detail: <Detail />, calendar: <Calendar />, exercices: <Exos /> };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80, color: C.text }}>
      {pages[page] || <Home />}
      {page !== "detail" && <button onClick={() => openSheet(page === "patients" ? "newPatient" : "newRdv", {})} style={{ position: "fixed", bottom: 88, right: "max(16px, calc(50% - 224px))", width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(27,60,45,0.35)", cursor: "pointer", zIndex: 40 }}>{Ic.plus}</button>}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.surface, display: "flex", borderTop: `1px solid ${C.borderLight}`, zIndex: 50, boxShadow: "0 -2px 10px rgba(0,0,0,0.03)" }}>
        {[{ k: "home", icon: Ic.home, l: "Accueil" }, { k: "patients", icon: Ic.users, l: "Patients" }, { k: "calendar", icon: Ic.cal, l: "Agenda" }, { k: "exercices", icon: Ic.book, l: "Exercices" }].map(n => {
          const on = page === n.k || (n.k === "patients" && page === "detail");
          return <div key={n.k} onClick={() => { setPage(n.k); setSelPatient(null); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px", fontSize: 10, fontWeight: 600, color: on ? C.primary : C.text3, borderTop: on ? `2.5px solid ${C.primary}` : "2.5px solid transparent", cursor: "pointer", transition: "all .15s" }}>{n.icon}<span style={{ marginTop: 3 }}>{n.l}</span></div>
        })}
      </div>
      {sheet === "complete" && <CompleteSheet />}
      {sheet === "payDebt" && <PayDebtSheet />}
      {sheet === "newRdv" && <NewRdvSheet />}
      {sheet === "newPatient" && <NewPatientSheet />}
      {sheet === "editPatient" && <EditPatientSheet />}
      {sheet === "sendExo" && <SendExoSheet />}
      <Toast {...toast} />
    </div>
  );
}