# Amplify Menu Engine — boilerplate

De vaste basis voor elke Amplify Growth Studio restaurant-landingpagina.
Header, categorie-navigatie, menu, item-aanpasscherm, winkelmandje en
WhatsApp-checkout zijn hier één keer goed gebouwd en horen **nooit** per
klant herschreven te worden.

## Wat verandert per klant

Alleen deze twee dingen:

1. `src/config/brand.config.ts` — naam, kleuren, fonts, hero-tekst/beeld,
   contactgegevens, welke wow-module(s) aan staan.
2. `src/data/menu.ts` — categorieën en gerechten. Kopieer
   `src/data/menu.example.ts` en pas aan; verwijs er in `App.tsx` naartoe.

Verander verder **niets** onder `src/components/layout`, `src/components/menu`,
`src/components/cart` of `src/components/checkout` — dat is de motor die
elk project moet delen.

## Workflow nieuw project

1. Fork deze repo op GitHub.
2. Importeer de fork in Google AI Studio.
3. Vul `brand.config.ts` volledig in — inclusief het echte
   `contact.whatsappNumber` (geen testnummer laten staan).
4. Maak `src/data/menu.ts` met het echte menu.
5. Kies 1, max 2 modules in `brand.config.ts -> wowModules`. Gebouwd en
   klaar voor gebruik: `parallaxHero`, `editorialMoment`, `customCursor`,
   `introTransition`, `signatureSpotlight`. `accent3d` (three.js, zoals
   Japoneza's sushi-canvas) is bewust nog niet generiek gebouwd — dat vraagt
   een eigen 3D-object per keuken/restaurant en is per klant maatwerk, geen
   herbruikbare module. Vraag hier apart om als een project dat nodig heeft.
6. `npm install && npm run dev` om lokaal te checken, `npm run build` voor
   productie.
7. Test de bestelflow end-to-end: mandje vullen, gegevens invullen, "Order
   via WhatsApp" — controleer dat het bericht bij het echte nummer aankomt
   vóórdat de klant live gaat.

## Waarom dit zo is opgezet

De vier vorige projecten (Japoneza, Caribou Coffee, Café Crème, Tempo)
werden élk vanaf nul gepromptend in AI Studio. Herkenbare patronen kwamen
telkens terug (sticky header, categorie-filter, cart-drawer,
WhatsApp-checkout) maar met andere component-namen, andere props en andere
kleursystemen — vandaar de inconsistente resultaten. Dit boilerplate maakt
die herhaling expliciet: één motor (Laag 1), één configbestand per klant
(Laag 2), een kleine bibliotheek van optionele "wow"-secties (Laag 3) zodat
elk project een eigen twist krijgt zonder het fundament te breken.
