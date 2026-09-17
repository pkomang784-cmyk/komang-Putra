# Security Specification & Test Definitions

## 1. Data Invariants
- Pelanggan records must have valid IDs, non-empty names, locations, valid fees (`iuran` >= 0), and strictly defined categories and status values.
- User accounts (`users`) must have valid non-empty usernames, names, roles, and emails.
- Schedules (`jadwal`) must belong to recognized days, times, and service areas.
- Reports (`laporan`) must include contact and description, preventing unauthorized tampering.
- Notifications (`notifikasi`) and banjar logs (`logsBanjar`) must retain structure and tamper-evident event details.

## 2. The Dirty Dozen Payloads
1. **Empty Name Pelanggan**: `{ id: "p1", nama: "", iuran: 25000 }` -> REJECT
2. **Negative Iuran**: `{ id: "p2", nama: "Warga", iuran: -10000 }` -> REJECT
3. **Invalid ID Poisoning**: `{ id: "../../root_attack" }` -> REJECT
4. **Massive String Buffer Overflow**: `{ id: "p3", nama: "A".repeat(5000) }` -> REJECT
5. **Ghost Role Injection**: `{ id: "u1", role: "super_root_hacker" }` -> REJECT
6. **Corrupt Status Value**: `{ id: "p4", status: "Sudah Ditipu" }` -> REJECT
7. **Empty User Username**: `{ id: "u2", username: "" }` -> REJECT
8. **Invalid Schedule Status**: `{ id: "j1", statusArmada: "Hancur" }` -> REJECT
9. **Tampered Catch-All Root Write**: `setDoc("/malicious/data")` -> REJECT
10. **Array Injection in String Field**: `{ id: "p5", nama: ["A", "B"] }` -> REJECT
11. **Type Mismatch in Fee**: `{ id: "p6", iuran: "Gratis" }` -> REJECT
12. **Missing Required Fields**: `{ id: "p7" }` -> REJECT
