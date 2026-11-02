"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useBasket, useLocale } from "@/components/providers";
import { formulas, getRental, isFormulaId } from "@/lib/catalog";
import { bookedDates, EVENT_TYPES, isoDay, quoteMessage, SERVICES, waLink, type EventType, type Quote, type Service } from "@/lib/quote";
import { isEmail, isPhone } from "@/lib/validate";

type Errors = Partial<Record<"date" | "name" | "phone" | "email", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-gold-ink">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[0.8125rem] text-[#9b3b2a]">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Demande de devis : reprend les champs de leur story « Devis » (date, lieu, nombre de tables,
 * décoration / traiteur / les deux) et les complète. Envoi : WhatsApp avec le récapitulatif,
 * plus e-mails de notification et de confirmation si Resend est configuré.
 */
export function QuoteForm() {
  const { lang, d } = useLocale();
  const { items, formula, setQty, setFormula, clear } = useBasket();
  const f = d.quote.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [eventType, setEventType] = useState<EventType>("wedding");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [guests, setGuests] = useState("");
  const [tables, setTables] = useState("");
  const [service, setService] = useState<Service>("both");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // Date du jour lue côté client seulement (le HTML est généré à l'avance)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  const booked = date !== "" && bookedDates.has(date);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = d.quote.required;
    if (!name.trim()) e.name = d.quote.required;
    if (!phone.trim()) e.phone = d.quote.required;
    else if (!isPhone(phone)) e.phone = d.quote.invalidPhone;
    if (email.trim() && !isEmail(email)) e.email = d.quote.invalidEmail;
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (["date", "name", "phone", "email"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const quote: Quote = {
      eventType,
      date,
      venue: venue.trim(),
      guests: guests.replace(/\D/g, ""),
      tables: tables.replace(/\D/g, ""),
      service,
      formula: service === "deco" || service === "location" ? "" : formula,
      items,
      budget,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
    };
    const ref = `SE-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const url = waLink(quoteMessage(quote, lang, d, ref));
    // Ouvert pendant le clic, pour ne pas être bloqué comme fenêtre surgissante
    window.open(url, "_blank", "noopener");
    fetch("/api/devis", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ quote, lang, ref }), keepalive: true }).catch(() => {});
    setSent(url);
  };

  const reset = () => {
    setSent(null);
    clear();
    setDate("");
    setVenue("");
    setGuests("");
    setTables("");
    setBudget("");
    setMessage("");
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const showFormula = service === "traiteur" || service === "both";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="border border-line bg-ivory p-8 text-center md:p-14" role="status">
          <p className="script text-[2.6rem] leading-none text-gold-ink rtl:font-[family-name:var(--font-amiri)] rtl:text-[2rem]">{d.quote.success.thanks}</p>
          <h3 className="display mt-4 text-[2rem]">{d.quote.success.title}</h3>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.quote.success.text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-ink">
              <WhatsAppIcon className="h-4 w-4" />
              {d.quote.success.again}
            </a>
            <button type="button" onClick={reset} className="link-line nav-link">
              {d.quote.success.reset}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onSubmit={onSubmit} noValidate className="space-y-14">
          {/* 1 — Événement */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.875rem] text-gold-ink">01</span>
              <span className="display text-[1.75rem]">{d.quote.steps.event}</span>
            </legend>
            <div>
              <p className="label" id={id("type")}>
                {f.eventType}
              </p>
              <div role="radiogroup" aria-labelledby={id("type")} className="mt-3 flex flex-wrap gap-2">
                {EVENT_TYPES.map((t) => (
                  <label key={t} className="chip">
                    <input type="radio" name="eventType" value={t} checked={eventType === t} onChange={() => setEventType(t)} className="sr-only" />
                    {f.eventTypes[t]}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field id={id("date")} label={`${f.date} *`} error={errors.date} hint={booked ? f.dateBooked : undefined}>
                <input id={id("date")} name="date" type="date" required min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" {...err("date")} />
              </Field>
              <Field id={id("venue")} label={f.venue}>
                <input id={id("venue")} name="venue" type="text" autoComplete="off" placeholder={f.venuePlaceholder} value={venue} onChange={(e) => setVenue(e.target.value)} className="field" maxLength={160} />
              </Field>
              <Field id={id("guests")} label={f.guests}>
                <input id={id("guests")} name="guests" type="number" inputMode="numeric" min={1} max={5000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field num" />
              </Field>
              <Field id={id("tables")} label={f.tables}>
                <input id={id("tables")} name="tables" type="number" inputMode="numeric" min={0} max={500} value={tables} onChange={(e) => setTables(e.target.value)} className="field num" />
              </Field>
            </div>
          </fieldset>

          {/* 2 — Prestation */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.875rem] text-gold-ink">02</span>
              <span className="display text-[1.75rem]">{d.quote.steps.service}</span>
            </legend>
            <div>
              <p className="label" id={id("service")}>
                {f.service}
              </p>
              <div role="radiogroup" aria-labelledby={id("service")} className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {SERVICES.map((s) => (
                  <label key={s} className="chip justify-center">
                    <input type="radio" name="service" value={s} checked={service === s} onChange={() => setService(s)} className="sr-only" />
                    {f.services[s]}
                  </label>
                ))}
              </div>
            </div>
            {showFormula && (
              <Field id={id("formula")} label={f.formula}>
                <select id={id("formula")} name="formula" value={formula} onChange={(e) => setFormula(isFormulaId(e.target.value) ? e.target.value : "")} className="field">
                  <option value="">{f.formulaNone}</option>
                  {formulas.map((x) => (
                    <option key={x.id} value={x.id}>
                      {d.traiteur.formulas.items[x.id].name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <div>
              <p className="label">{f.items}</p>
              {items.length === 0 ? (
                <p className="mt-3 text-[0.9375rem] text-muted">
                  {f.itemsEmpty}{" "}
                  <a href={`/${lang}#location`} className="link-line text-ink">
                    {f.itemsBrowse}
                  </a>
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {items.map((it) => {
                    const r = getRental(it.id);
                    if (!r) return null;
                    const n = d.rental.items[r.id].name;
                    return (
                      <li key={it.id} className="flex items-center gap-3 py-3">
                        <span className="flex-1 text-[0.9375rem]">{n}</span>
                        <div className="flex items-center">
                          <button type="button" onClick={() => setQty(it.id, it.qty - 1)} className="flex h-10 w-10 items-center justify-center hover:text-gold-ink" aria-label={`${d.rental.decrease} : ${n}`}>
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="num w-8 text-center" aria-label={d.rental.qty}>
                            {it.qty}
                          </span>
                          <button type="button" onClick={() => setQty(it.id, it.qty + 1)} className="flex h-10 w-10 items-center justify-center hover:text-gold-ink" aria-label={`${d.rental.increase} : ${n}`}>
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => setQty(it.id, 0)} className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink" aria-label={`${d.rental.remove} : ${n}`}>
                            <CloseIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <Field id={id("budget")} label={<>{f.budget} <span className="normal-case tracking-normal">({f.optional})</span></>}>
              <select id={id("budget")} name="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="field">
                <option value="">{f.budgetNone}</option>
                {f.budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          {/* 3 — Coordonnées */}
          <fieldset className="space-y-8">
            <legend className="mb-8 flex items-baseline gap-4">
              <span className="num text-[0.875rem] text-gold-ink">03</span>
              <span className="display text-[1.75rem]">{d.quote.steps.contact}</span>
            </legend>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
                <input id={id("name")} name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
              </Field>
              <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
                <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
              </Field>
              <Field id={id("email")} label={<>{f.email} <span className="normal-case tracking-normal">({f.optional})</span></>} error={errors.email}>
                <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="field rtl:text-end" maxLength={160} {...err("email")} />
              </Field>
            </div>
            <Field id={id("message")} label={f.message}>
              <textarea id={id("message")} name="message" rows={4} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
            </Field>
          </fieldset>

          <div>
            <button type="submit" className="btn-ink w-full sm:w-auto">
              <WhatsAppIcon className="h-4 w-4" />
              {d.quote.submit}
            </button>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">{d.quote.hint}</p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{d.quote.consent}</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
