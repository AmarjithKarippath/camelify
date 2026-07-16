# Platform Decision: ERPNext + Self-Hosted

**Decision date:** 2026-07-12  
**Status:** Approved for MVP

## Decision

| Item | Choice | Rationale |
|---|---|---|
| Base ERP | **ERPNext v16** on Frappe Framework | Native India GST, double-entry accounting, inventory, web-first |
| Hosting | **Self-hosted Docker** (frappe_docker pattern) | Full control, no per-user SaaS cost, custom app installable |
| Alternative rejected | Frappe Cloud | Faster setup but limited custom app control on lower tiers |
| Alternative rejected | Odoo Community | Less India-native GST; more configuration for Indian SMB |
| Alternative rejected | TallyPrime Cloud Access | Remote desktop wrapper, not a native web product |

## Comparison summary

| Approach | Calendar time | Cost (MVP) | Custom UX | True web app |
|---|---|---|---|---|
| Tally Cloud Access | 2–4 weeks | ₹600+/user/mo | No | No (RDP) |
| **ERPNext extend (chosen)** | **3–5 months** | **₹4–18L** | **Yes** | **Yes** |
| Native rebuild | 12–24 months | ₹40L–2Cr+ | Yes | Yes |

## Self-hosted vs Frappe Cloud

**Self-hosted (chosen for this repo):**
- Custom `tally_mvp` Frappe app installed from local source
- Docker Compose on localhost:8080 for dev/UAT
- Production: VPS with MariaDB + Redis + reverse proxy

**Frappe Cloud (future option):**
- Use when ops team prefers managed hosting
- Requires pushing `tally_mvp` to a Git repo and connecting via Frappe Cloud dashboard
- Same app code; different deployment target

## Technical stack

- **ERPNext:** v16.26.2
- **Database:** MariaDB 11.8
- **Cache/Queue:** Redis 6.2
- **Custom app:** `tally_mvp` (roles, workspaces, GST export reports, India setup)
- **Port:** 8080 (dev)

## Production hosting checklist (when moving beyond dev)

1. VPS with 4+ GB RAM (8 GB recommended)
2. Domain + SSL via nginx or Traefik
3. Daily MariaDB backups to object storage
4. `ERPNEXT_VERSION` pinned in `docker/.env`
5. Separate staging site before production cutover
