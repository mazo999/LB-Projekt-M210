# **Webapp zur Verwaltung persönlicher Modulnoten**

## **Projekt Pitch**

Die entwickelte Webapp ermöglicht es Benutzern, persönliche Modulnoten zu verwalten. Die Anwendung ist **multiuser-fähig**, wobei unterschiedliche Benutzer unabhängig voneinander ihre Daten pflegen können.**Technologien:**

- **Frontend:** React
- **Backend & Authentifizierung:** Supabase

---

## **Arbeitsplan mit Arbeitsschritten und Zeitschätzung**

| Arbeitsschritt                             | Zeitschätzung | Tatsächliche Zeit |
| ------------------------------------------ | ------------- | ----------------- |
| Projektinitialisierung und Setup           | 2h            | 2.5h              |
| Authentifizierung mit Supabase einrichten  | 0.5h          | 0.5h              |
| Datenbankdesign in Supabase erstellen      | 1h            | 1h                |
| CRUD-Operationen für Modulnoten entwickeln | 2h            | 4h                |
| Benutzeroberfläche für Modulverwaltung     | 2h            | 3h                |
| Styling mit CSS (zentriert, ChatGPT)       | 0.2h          | 0.2h              |
| Debugging und Testing                      | 1h            | 1.5h              |
| Deployment vorbereiten                     | 1h            | 1h                |
| Dokumentation schreiben                    | 1h            | 1.5h              |

---

## **Effektive Arbeitszeit je Arbeitspaket protokolliert**

Die effektive Arbeitszeit wurde für alle Pakete protokolliert (siehe obige Tabelle). Leichte Abweichungen entstanden durch zusätzlichen Debugging-Aufwand bei CRUD-Operationen.

---

## **Vollendeter Git Merge Request**

Der Branch `readability` wurde erfolgreich erstellt, bearbeitet und per **Pull Request** in den `main`-Branch gemerged.

- **Branch Name:** `readability`
- **PR-Titel:** _Improve Code Readability_
- **Description:** _Ayy caramba!_ \:joy:

---

## **Authentifizierung korrekt eingesetzt**

Die Authentifizierung wurde mit **Supabase** korrekt implementiert:

- Benutzer können sich **registrieren** und **einloggen**.
- **Session Management:** Die Anwendung stellt sicher, dass Benutzer eingeloggt bleiben, auch nach einem Seitenreload.
- **Admin-Check:** Der Admin erhält spezielle Funktionen (Module hinzufügen/löschen), während normale Benutzer ihre eigenen Noten verwalten.

---

## **CRUD-Operationen**

Die wichtigsten CRUD-Operationen sind implementiert:

1. **Create:** Noten hinzufügen (`addGrade`)
2. **Read:** Noten für ausgewählte Module anzeigen (`fetchGrades`)
3. **Update:** Noten aktualisieren (`updateGrade`)
4. **Delete:** Noten löschen (`deleteGrade`)

---

## **Architektur dokumentiert**

Die Anwendung folgt einer klaren **Komponentenarchitektur**:

### **Frontend-Struktur**

```plaintext
/src
|-- App.jsx                   --> Hauptkomponente
|-- components/
    |-- ModuleDropdown.jsx    --> Dropdown zur Modulauswahl
    |-- GradesManager.jsx     --> CRUD für Notenverwaltung
    |-- ModuleManager.jsx     --> Adminbereich für Module
|-- App.css                   --> Haupt-CSS

```

### **Backend (Supabase)**

- **Datenbank-Tabellen:**
  - `module`: Speichert Module (ID, Name).
  - `grade`: Speichert Noten pro Benutzer (ID, Modul-ID, Note, Benutzer-ID).
- **Authentifizierung:** Supabase Auth mit Benutzerrollen (Admin/Benutzer).
- **Foreign Keys:**
  - `grade.user` ist ein Foreign Key zur User-Tabelle (Benutzer).
  - `grade.modul` verweist als Foreign Key auf die `module`-Tabelle.

---

## **Deployment lokal**

Die Anwendung wurde auf **Vercel** deployt, da es einfach in der Handhabung ist und gut mit React-Projekten funktioniert.

### **Schritt-für-Schritt-Anleitung für das Deployment:**

1. **Repository klonen:**

   ```bash
   git clone https://github.com/abc/LB-Projekt-M210
   ```

2. **Projektverzeichnis öffnen:**

   ```bash
   cd LB-Projekt-M210
   code .
   ```

3. **In das Frontend-Verzeichnis wechseln und Abhängigkeiten installieren:**

   ```bash
   cd frontend
   npm install
   ```

   - Zusätzliche Abhängigkeiten werden automatisch aus `package.json` installiert.

4. **Supabase-Umgebungsvariablen einrichten:**

   - Im **Root-Verzeichnis** eine `.env`-Datei erstellen und die folgenden Werte eintragen:
     ```plaintext
     VITE_SUPABASE_URL=SUPABASE_URL
     VITE_SUPABASE_KEY=SUPABASE_KEY
     ```

5. **Lokale Entwicklung starten:**

   ```bash
   npm run dev
   ```

   - Die Anwendung läuft jetzt unter `http://localhost:5173`.

6. **Deployment auf Vercel:**

   - **Schritt 1:** Repository auf GitHub pushen.
   - **Schritt 2:** Vercel-Account erstellen (falls nicht vorhanden).
   - **Schritt 3:** Repository in Vercel verknüpfen und Umgebungsvariablen (`VITE_SUPABASE_URL` und `VITE_SUPABASE_KEY`) eintragen.
   - **Schritt 4:** Deployment starten.

---

## **Kritischer Review: Welche Ziele wurden erreicht oder nicht?**

### **Erreichte Ziele**

Multiuser-fähige Webapp entwickelt.CRUD-Funktionalität für Modulnoten.Authentifizierung und Admin-Bereich implementiert.Einheitliches Design (CSS), zentrierte Ansicht.Dokumentation der Architektur und Deployment.

### **Nicht erreichte oder offene Punkte**

Es wurde kein persistenter Zustand für zuletzt ausgewählte Module implementiert.User löschen nicht implementiert. Github Actions nicht genauer anschauen können.

---

## **Zusammenfassung**

Die Webapp zur Verwaltung persönlicher Modulnoten erfüllt die wichtigsten Anforderungen:

- Multiuser-Funktionalität
- CRUD-Operationen
- Admin- und Benutzerbereiche
- Funktionale Authentifizierung mit Supabase
- Automatisiertes Deployment mit GitHub Actions

Der Code wurde sauber strukturiert und die Anwendung erfolgreich deployt.
