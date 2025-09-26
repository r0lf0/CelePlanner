# CelePlanner — Acceptance Tests

## A. Sync & Resilienza
- A1. First sync (today+): events created; past ignored.
- A2. Delta updates: fields changed in Google → reflected in DB.
- A3. Delete in Google: event becomes `status=cancelled` (not removed).
- A4. Sync token invalid: reset and rebuild from today; no data loss.

## B. Eventi
- B1. Multiple events same date: all visible; cancelled togglable.
- B2. Showtimes 1..N: displayed & editable; ordered unique.
- B3. Stage manager per showtime: must be internal; rejects external.

## C. Convocazioni & Staff
- C1. Phase times: one tech_call per phase; loaders only in setup/teardown.
- C2. Staff per phase/role: arbitrary names from directory; duplicates across phases allowed.
- C3. SM can also be a technician simultaneously.

## D. Allegati
- D1. Upload any format/size (infra limits only); path convention respected.
- D2. Download requires authentication; URLs not public.
- D3. Delete removes record and file.

## E. Security & Roles
- E1. viewer: read-only (+ download).
- E2. editor: can PATCH event and upload/delete attachments.
- E3. admin: can create persons and manage users/roles.
- E4. Sessions expire & are invalidated on logout.
