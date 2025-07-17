# Giess Bielefeld

BaumBie bringt Menschen mit der Natur in Verbindung. Die interaktive Karte zeigt Bäume an und bringt sie zum Sprechen. Für jeden Baum zeigt die App grundlegende Informationen an, etwa Alter, Baumart oder Höhe. Außerdem ist der Wasserbedarf und die Regenmenge der letzten Zeit zu sehen. Vor allem können Nutzer:innen sich spielerisch in einem Chat mit dem Baum auseinandersetzen und ihm Fragen stellen. Eine weitere wichtige Funktion der App: Die Bäume können adoptiert werden. So erfahren Nutzer:innen live, wie es ihrem Baum geht und können beim Gießen des Baums helfen. Ein Baum kann mehrere Pat:innen haben. Das soll auch Nachbarschaften zusammenbringen.

Grundlage der Karte ist aktuell das Baumkataster der Stadt Bielefeld, es sind also alle Stadtbäume zu sehen. Das Projekt ist so angelegt, dass auch Privatpersonen, oder andere Organisationen Daten mit uns teilen können, damit wir ihre Bäume in der App zeigen können.

Das Projekt ist inspiriert von "Gieß den Kiez" aus Berlin. Es wird entwickelt von Ehrenamtlichen aus dem Verein Code for Bielefeld e.V. Wir sind ein gemeinnütziger Verein für digitale Bildung, Open Source, Open Data und Civic Coding. Wir setzen unsere technischen und kreativen Fähigkeiten ein, um unsere Stadt zu verbessern und sind Teil der bundesweiten Initiative "Code for Germany" von der Open Knowledge Foundation. Wir freuen uns über weitere Interessierte.

## 🧱 Tech Stack

Unsere Anwendung basiert auf einem schlanken Fullstack-Setup:

- **Frontend: Svelte**

  Svelte ist ein komponentenbasiertes JavaScript-Framework, ähnlich wie React oder Vue.js. Im Gegensatz zu diesen nutzt Svelte kein virtuelles DOM, sondern kompiliert Komponenten bereits beim Build in effizienten, direkt ausführbaren JavaScript-Code. Das führt zu geringeren Ladezeiten und erleichtert die Umsetzung interaktiver Benutzeroberflächen.

- **Backend: Supabase**

  Supabase ist ein Open-Source-Backend-as-a-Service auf Basis von PostgreSQL. Wir können damit Authentifizierung, Datenbankzugriff, Datei-Uploads und öffentliche APIs direkt aus der Datenbank heraus konfigurieren – ohne zusätzlichen Server-Code, was die Komplexität senkt.

- **Conversational AI: Voiceflow**

  Voiceflow ist eine Plattform zur Erstellung von Chatbots und Sprachassistenten über ein grafisches No-Code-Interface. Sie erlaubt es uns, die Chatdialoge mit einzelnen Bäumen visuell zu modellieren, ohne selbst Code schreiben zu müssen. Die Kommunikation mit Voiceflow erfolgt über einen per Edge Function angebundenen API-Endpunkt in Supabase.

  > ⚠️ Da die Preisstruktur von Voiceflow derzeit unklar ist und die Plattform nicht selbst gehostet werden kann, evaluieren wir mittelfristig Alternativen – z.B. durch eigene LLM-Backends.

## 🔐 Umgebungsvariablen

## Lokales Dev-Setup

### Supabase-Instanz starten

Für die lokale Entwicklung muss eine Supabase-Instanz aufgesetzt werden.

**Supabase** ist eine Open-Source-Plattform, die eine vollständige Backend-Infrastruktur mit Funktionen wie Datenbanken, Authentifizierung, Speicher und API-Generierung bietet, um schnell und einfach moderne Anwendungen zu entwickeln.

Hierfür kann die [`supabase-cli`](https://supabase.com/docs/guides/cli) verwendet werden.

```
npm install -g supabase-cli
```

Da die supabase-cli im Hintergrund Docker nutzt, musst du den Docker Daemon starten (ggf. noch zuerst Docker Desktop installieren), bevor du die supabase-cli starten kannst:

Führe aus dem Root-Verzeichnis aus:

```
supabase start
```

Idealerweise erhältest du dann im Terminal eine Meldung "Started supabase local development setup." mit verschiednen Werten.

### Umgebungsvariablen setzen

Nenne die .env.example - Datei in .env um.

Von Supabase werden jetzt folgende Variablen (=Zugangsdaten für die Supabase-Instanz) in die .env Datei kopiert:

```
VITE_SUPABASE_URL=http://127.0.0.1:54323
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Nach dem Ausführen von `supabase start` entnimmst du diese Variablen aus dem Terminal Log:

- "anon key" -> VITE_SUPABASE_ANON_KEY
- "service_role key" -> SUPABASE_SERVICE_ROLE_KEY

### Supabase Migration

```
supabase migrations up
```

### Supabase Berechtigungen setzen (evtl. optional)

Um auf die Supabase-Instanz und die darin enthaltenen Daten zugreifen zu können, müssen die Berechtigungen für die Tabelle `trees` vergeben werden.

Öffne das Supabase Studio: http://127.0.0.1:54323 solange die Supabase im Hintergrund läuft.

Öffne den Table Editor in der linken Seitenleiste. Wähle dann die Tabelle `trees` aus.
Wähle "RLS disabled" (Menüleiste oben) -> "Enable RLS for this table" -> "Enable RLS" -> "Add RLS policy" -> "Create a new policy"

Wähle das Template "SELECT: Enable read access for all users"

```
create policy "Enable read access for all users" on "public"."trees" as permissive for select to public using (true);
```

Speichern mit Klick auf `Save policy`.

-> oder in `/supabase/migrations/20240316110547_create_trees_table` speichern

???

### Datenimport nach Supabase

Für den Import der Daten wird die `trees.json`-Datei benötigt, die aktuell nicht Bestandteil dieses Repositories ist! (Die Datei wird auf Nachfrage von uns bereitgestellt.)

Lege die Datei hier ab: `preparation/input`

Da weitere Bibliotheken erforderlich sind, um die Daten zu importieren, empfiehlt es sich, eine virtuelle Python-Umgebung im `preparation`-Ordner zu erstellen und die erforderlichen Bibliotheken zu installieren:

Erstellen der Virtuellen Umgebung:

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Navigiere ins `preparation`-Verzeichnis und importiere die Daten:

```
python import.py <path-to-geojson-file>
```

## Geosplitting (Datensegmentierung)

Um die Performance des Karten-Renderns zu verbessern muss die `trees.json`-Datei gesplittet werden.

`GeoSplitter` ist ein Python-Tool, um große GeoJSON-Dateien in kleinere, handhabbare Segmente aufzuteilen. Dies ist besonders nützlich, um die Ladezeiten und Effizienz bei der Arbeit mit umfangreichen geographischen Daten in Webanwendungen oder GIS-Projekten zu verbessern. Zusätzlich generiert GeoSplitter einen JSON-Index, der jedes Segment mit einem spezifischen Koordinatenbereich verknüpft, um eine einfache Integration und Nutzung der segmentierten Daten zu ermöglichen.

### Vorbereitung

Bevor du `GeoSplitter` verwendest, stelle sicher, dass Python `3.x` auf deinem System installiert ist.
Diese Abhängigkeiten kannst du durch die Installation der `requirements.txt` Datei einbinden, die im Projekt enthalten ist. Installiere die erforderlichen Pakete mit Pip:

```bash
pip install -r requirements.txt
```

Platziere deine GeoJSON-Datei im `input`-Unterordner. Es wird erwartet, dass sie `trees.geojson` heißt; ändere gegebenenfalls den Wert von `INPUT_PATH` im `splitter.py` Skript, um auf deine spezifische Datei zu verweisen.

### Ausführen Splitter

Starte das `splitter.py`-Skript, um die GeoJSON-Datei zu segmentieren und die Index-Datei zu generieren. Standardmäßig wird ein neuer Unterordner `segments` erzeugt mit mehreren kleinen GeoJSON-Dateien sowie eine `segments_index.json`, die die Segmentdateien mit den Koordinatenbereichen verknüpft:

```bash
python preparation/supa_splitter.py
```

Kopiere anschließend die neu erstellten Segmente aus `./preparation/segments/*` in das `static`-Verzeichnis in `frontend`. Den folgenden Befehl muss im Root-Verzeichnis ausgeführt werden:

```bash
cp -r preparation/segments frontend/static
```

### Starten der App

Navigiere in den Frontend-Ordner. Installiere alle Abhängigkeiten:

```
npm install
```

Anschließend kannst du das mit Svelte entwickelte Frontend starten:

```
npm run dev
```

## Dev Setup

## Nächste Schritte
