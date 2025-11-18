# Minecraft Hosting Service – Datenmodell  
Technische Dokumentation (.md)

---

## 1. Domänenüberblick

- Benutzer und Authentifizierung
- Kundenprofil und Billing
- Minecraft-Identitäten
- Produkte und Tarife
- Server-Instanzen
- Server-Konfiguration
- Welten und Mods
- Infrastruktur
- Backups
- Monitoring
- Zahlungen und Rechnungen
- Support und Benachrichtigungen
- API und Webhooks
- Security und Audit-Logs

---

## 2. Benutzer und Authentifizierung

### users

| Feldname           | Beschreibung                               | Datentyp       |
|--------------------|----------------------------------------------|-------------------|
| id                 | Primärschlüssel                              | UUID / BIGINT     |
| email              | Login-Email, eindeutig                       | VARCHAR           |
| password_hash      | Gehashes Passwort                            | VARCHAR           |
| email_verified     | Ob E-Mail bestätigt ist                      | BOOLEAN           |
| created_at         | Registrierungsdatum                          | DATETIME          |
| updated_at         | Letzte Änderung                              | DATETIME          |
| last_login_at      | Letzter erfolgreicher Login                  | DATETIME          |
| status             | aktiv, gesperrt, gelöscht                    | ENUM              |
| role               | customer, admin, support, reseller           | ENUM              |
| locale             | Bevorzugte Sprache                           | VARCHAR(10)       |
| timezone           | Zeitzone                                     | VARCHAR(50)       |

### user_profiles

| Feldname      | Beschreibung                |
|---------------|-----------------------------|
| user_id       | FK zu users.id              |
| first_name    | Vorname                     |
| last_name     | Nachname                    |
| phone         | Telefonnummer               |
| company_name  | Firmenname                  |
| address_line1 | Adresse                     |
| address_line2 | Adresszusatz                |
| postal_code   | PLZ                         |
| city          | Ort                         |
| country       | Ländercode (CH, DE, AT)    |

---

## 3. Minecraft-Identität

### minecraft_accounts

| Feldname     | Beschreibung                       |
|--------------|------------------------------------|
| id           | Primärschlüssel                    |
| user_id      | FK zu users.id                     |
| mc_uuid      | Offizielle Minecraft UUID          |
| mc_username  | Spielername                        |
| verified     | Verifiziert                        |
| verified_at  | Zeitpunkt der Verifizierung        |
| created_at   | Erfasst am                         |

---

## 4. Produkte und Tarife

### plans

| Feldname               | Beschreibung                        |
|------------------------|-------------------------------------|
| id                     | Primärschlüssel                     |
| name                   | Name des Plans                      |
| description            | Beschreibung                        |
| monthly_price          | Monatspreis                         |
| ram_mb                 | RAM                                 |
| cpu_cores              | CPU-Cores                           |
| storage_gb             | SSD-Speicher                        |
| max_player_slots       | Empfohlene Slots                    |
| max_servers_per_user   | Limit pro Kunde                     |
| backups_included       | Anzahl Backups                      |
| locations_available    | unterstützte Standorte              |
| is_active              | Ob buchbar                          |
| sort_order             | Sortierung                          |

### plan_addons

| Feldname    | Beschreibung       |
|-------------|--------------------|
| id          | Primärschlüssel    |
| plan_id     | FK zu plans.id     |
| name        | Name               |
| description | Beschreibung       |
| price       | Preis              |
| ram_mb      | RAM-Addition       |
| cpu_pct     | CPU-Addition       |
| storage_gb  | Speicher-Addition  |

---

## 5. Server-Instanzen

### servers

| Feldname              | Beschreibung                            |
|-----------------------|-----------------------------------------|
| id                    | Primärschlüssel                         |
| user_id               | FK zu users.id                          |
| plan_id               | FK zu plans.id                          |
| name                  | Anzeigename                             |
| slug                  | URL-Name                                |
| status                | running, stopped, suspended             |
| node_id               | FK zu nodes.id                          |
| allocated_ram_mb      | RAM                                     |
| allocated_cpu_pct     | CPU                                     |
| allocated_storage_gb  | Speicher                                 |
| location_id           | Standort                                |
| created_at            | Erstelldatum                            |
| updated_at            | Änderungsdatum                          |
| expires_at            | Laufzeitende                            |
| suspended_at          | Sperrdatum                              |

### server_network

| Feldname      | Beschreibung            |
|---------------|-------------------------|
| id            | Primärschlüssel         |
| server_id     | FK zu servers.id        |
| ip_address    | IP                      |
| hostname      | DNS                     |
| port          | Spiele-Port             |
| query_port    | Query-Port              |
| rcon_port     | RCON-Port               |
| rcon_password | RCON-Passwort           |

---

## 6. Server-Konfiguration

### server_settings

| Feldname               | Beschreibung                                  |
|------------------------|-----------------------------------------------|
| server_id              | FK zu servers.id                              |
| minecraft_version      | z. B. 1.20.4                                  |
| server_type            | vanilla, spigot, paper, forge, fabric         |
| motd                   | Server MOTD                                   |
| difficulty             | peaceful/easy/normal/hard                     |
| game_mode              | survival/creative/adventure/spectator         |
| max_players            | Spielerlimit                                  |
| online_mode            | Premium-Check                                 |
| view_distance          | Sichtweite                                     |
| simulation_distance    | Simulation                                    |
| allow_nether           | true/false                                    |
| allow_end              | true/false                                    |
| pvp_enabled            | true/false                                    |
| white_list_enabled     | true/false                                    |
| hardcore_mode          | true/false                                    |
| command_blocks_enabled | true/false                                    |
| level_type             | default/flat/amplified/custom                 |
| resource_pack_url      | Download-Link                                 |
| resource_pack_hash     | Hash                                          |
| auto_start_on_crash    | true/false                                    |
| auto_restart_schedule  | Cron-Pattern                                  |

---

## 7. Welt- und Mod-Verwaltung

### server_worlds

| Feldname        | Beschreibung                   |
|-----------------|--------------------------------|
| id              | Primärschlüssel                |
| server_id       | FK zu servers.id               |
| name            | Weltname                       |
| type            | overworld/nether/end           |
| size_mb         | Größe                          |
| last_backup_at  | letztes Backup                 |
| created_at      | Erstelldatum                   |

### server_plugins

| Feldname     | Beschreibung                     |
|--------------|----------------------------------|
| id           | Primärschlüssel                  |
| server_id    | FK zu servers.id                 |
| name         | Plugin-/Mod-Name                 |
| version      | Version                          |
| source       | spigotmc/curseforge/upload       |
| enabled      | Aktiv                            |
| config_path  | Pfad                             |
| installed_at | Installation                     |

---

## 8. Infrastruktur

### nodes

| Feldname          | Beschreibung            |
|-------------------|-------------------------|
| id                | Primärschlüssel         |
| name              | Node-Name               |
| location_id       | FK zu locations.id      |
| provider          | Hetzner/AWS/OVH…        |
| ipv4_address      | IPv4                    |
| ipv6_address      | IPv6                    |
| total_ram_mb      | RAM                     |
| total_storage_gb  | SSD                     |
| total_cpu_cores   | CPU                     |
| status            | online/offline          |
| created_at        | Erfasst                 |

### locations

| Feldname   | Beschreibung |
|------------|--------------|
| id         | Primärschlüssel |
| name       | Name |
| country    | Land |
| city       | Stadt |
| timezone   | Zeitzone |
| is_active  | Aktiv |

---

## 9. Backups

### server_backups

| Feldname        | Beschreibung                |
|-----------------|-----------------------------|
| id              | Primärschlüssel             |
| server_id       | FK zu servers.id            |
| world_id        | FK zu server_worlds.id      |
| type            | full/incremental/world_only |
| storage_provider| s3/local/etc                |
| storage_path    | Speicherpfad                |
| size_mb         | Größe                       |
| created_at      | Zeitpunkt                   |
| created_by      | User/system                 |
| status          | success/failed/processing   |
| restore_count   | Anzahl Wiederherstellungen  |
| last_restore_at | Zeitpunkt                   |

### server_backup_policies

| Feldname       | Beschreibung            |
|----------------|-------------------------|
| server_id      | FK zu servers.id        |
| frequency      | täglich/wöchentlich     |
| retention_days | Aufbewahrungstage       |
| max_backups    | Max Anzahl              |
| enabled        | true/false              |

---

## 10. Monitoring & Logs

### server_metrics

| Feldname       | Beschreibung           |
|----------------|------------------------|
| id             | Primärschlüssel        |
| server_id      | FK zu servers.id       |
| timestamp      | Zeit                   |
| cpu_usage_pct  | CPU                    |
| ram_usage_mb   | RAM                    |
| player_count   | Spielerzahl            |
| tps            | TPS                    |
| disk_usage_mb  | Disk                   |

### server_events

| Feldname     | Beschreibung                                |
|--------------|---------------------------------------------|
| id           | Primärschlüssel                             |
| server_id    | FK zu servers.id                            |
| type         | started/stopped/crashed/updated             |
| message      | Meldung                                     |
| created_at   | Zeit                                        |
| created_by   | user_id/System                              |

### server_console_logs

| Feldname   | Beschreibung |
|------------|--------------|
| id         | Primärschlüssel |
| server_id  | FK zu servers.id |
| timestamp  | Zeit |
| line       | Logzeile |
| level      | info/warn/error |

---

## 11. Zahlungen & Rechnungen

### subscriptions

| Feldname       | Beschreibung                |
|----------------|-----------------------------|
| id             | Primärschlüssel             |
| user_id        | FK zu users.id              |
| plan_id        | FK zu plans.id              |
| server_id      | FK zu servers.id            |
| status         | active/cancelled/past_due   |
| billing_cycle  | monthly/yearly              |
| started_at     | Startdatum                  |
| ends_at        | Enddatum                    |
| cancelled_at   | Kündigungsdatum             |
| external_id    | Stripe/Mollie/etc ID        |

### payments

| Feldname        | Beschreibung            |
|-----------------|-------------------------|
| id              | Primärschlüssel         |
| user_id         | FK zu users.id          |
| subscription_id | FK zu subscriptions.id   |
| amount_chf      | Betrag                  |
| currency        | Währung                 |
| status          | paid/pending/failed     |
| method          | card/paypal/bank        |
| provider        | stripe/mollie/etc       |
| provider_tx_id  | Transaktions-ID         |
| created_at      | Zeit                    |
| paid_at         | Zeit                    |

### invoices

| Feldname       | Beschreibung |
|----------------|-------------|
| id             | Primärschlüssel |
| user_id        | FK zu users.id |
| invoice_number | Nummer |
| total_amount   | Betrag |
| currency       | Währung |
| status         | draft/open/paid |
| issued_at      | Ausgestellt |
| due_at         | Fällig |
| pdf_url        | PDF-Link |

---

## 12. Tickets & Benachrichtigungen

### support_tickets

| Feldname     | Beschreibung                 |
|--------------|------------------------------|
| id           | Primärschlüssel              |
| user_id      | FK zu users.id               |
| server_id    | FK zu servers.id             |
| subject      | Betreff                      |
| description  | Inhalt                       |
| status       | open/in_progress/resolved    |
| priority     | low/normal/high/urgent       |
| created_at   | Zeitpunkt                    |
| updated_at   | Zeitpunkt                    |
| assigned_to  | Admin                        |

### notifications

| Feldname     | Beschreibung               |
|--------------|----------------------------|
| id           | Primärschlüssel           |
| user_id      | Empfänger                 |
| type         | event type                |
| title        | Titel                     |
| message      | Nachricht                 |
| read_at      | Gelesen am                |
| created_at   | Zeitpunkt                 |
| channel      | email/sms/in_app          |

---

## 13. API & Integrationen

### api_keys

| Feldname     | Beschreibung |
|--------------|-------------|
| id           | Primärschlüssel |
| user_id      | FK zu users.id |
| name         | Keyname |
| token_hash   | Hash |
| scopes       | Berechtigungen |
| created_at   | Zeit |
| expires_at   | Ablauf |
| last_used_at | Zuletzt genutzt |
| is_active    | Aktiv |

### webhooks

| Feldname    | Beschreibung |
|-------------|-------------|
| id          | Primärschlüssel |
| user_id     | FK zu users.id |
| url         | Ziel |
| event_type  | Event |
| secret      | Secret |
| created_at  | Zeit |
| is_active   | Aktiv |

---

## 14. Security & Audit

### audit_logs

| Feldname     | Beschreibung          |
|--------------|-----------------------|
| id           | Primärschlüssel       |
| user_id      | Akteur                |
| action       | Aktion                |
| entity_type  | server/backup/user    |
| entity_id    | ID                    |
| ip_address   | IP                    |
| user_agent   | Agent                 |
| created_at   | Zeit                  |
| metadata     | JSON                  |

### user_consents

| Feldname     | Beschreibung |
|--------------|-------------|
| id           | Primärschlüssel |
| user_id      | FK zu users.id |
| type         | privacy/terms |
| version      | Version |
| accepted_at  | Zeit |
| ip_address   | IP |
