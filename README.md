# Sud Events

Site vitrine et demande de devis de Sud Events : traiteur, décoration et location de matériel pour mariages et événements dans le Vaucluse, les Bouches-du-Rhône et l'Hérault.
Next.js 16 · Tailwind 4 · Framer Motion · Lenis. Français par défaut, anglais et arabe (RTL).

## Commandes

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run frames     # images tirées des reels (assets/raw) → assets/<catégorie>, avec ffmpeg-static
npm run media      # assets/<catégorie> → public/media, boucles vidéo du hero, og.jpg
npm run contenu    # régénère CONTENU.md (textes 3 langues, formules, location, infos à demander)
python scripts/logo.py <dossier des polices>   # redessine le logo SVG (voir l'en-tête du script)
```

Les originaux Instagram (`assets/raw/`) ne sont pas versionnés.

## Où modifier quoi

- Textes : `locales/fr.json`, `en.json`, `ar.json`
- Formules traiteur et prix : `data/formules.json` (prix `null` = « Sur devis »)
- Catalogue de location : `data/location.json` (prix `null` = « Prix sur demande »)
- Dates déjà réservées : `data/dates.json`
- Avis clients : `data/reviews.json` ; partenaires : `data/partners.json`
- Contact et zones : `data/site.json`
- Logo : `data/logo.json` (tracés), `components/Logo.tsx`, `public/logo.svg`, `public/logo-light.svg`, `app/icon.svg`

## Demande de devis

Le formulaire ouvre WhatsApp (33783679092) avec le récapitulatif complet dans la langue du visiteur, et envoie en parallèle une copie à `/api/devis` :

| Variable (Vercel) | Rôle |
| --- | --- |
| `RESEND_API_KEY` | Envoi des e-mails |
| `QUOTE_NOTIFY_EMAIL` | Adresse qui reçoit chaque demande |
| `RESEND_FROM` | Expéditeur sur un domaine vérifié dans Resend |

Sans ces variables, seule la partie WhatsApp fonctionne. Le client reçoit un e-mail de confirmation s'il a laissé son adresse.
