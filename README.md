# Yuukie — Audioschamane

Eine statische One-Page-Website ohne Build-Schritt oder externe Abhängigkeiten.

## Discord-Profil verknüpfen

In `site.config.js` die Discord-Benutzer-ID eintragen:

```js
const DISCORD_USER_ID = "123456789012345678";
```

Die ID lässt sich in Discord bei aktiviertem Entwicklermodus über **Benutzer-ID kopieren** ermitteln. Ohne eingetragene ID öffnet der Button einfach Discord.

## Lokal ansehen

`index.html` kann direkt im Browser geöffnet werden. Für eine echte lokale Vorschau im Ordner einen beliebigen statischen Server starten, zum Beispiel:

```bash
python3 -m http.server 4173
```

## Hosten

Den gesamten Ordner unverändert auf einen statischen Hoster oder Webspace hochladen. Es sind keine Umgebungsvariablen, Datenbanken oder Installationen nötig.
