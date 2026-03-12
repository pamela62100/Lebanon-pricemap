# Wein — Lebanon Price Map Backend Tasks

## Sprint 0: Shared Infrastructure
- [ ] DB Schema Fixes (Models / Migrations)
- [ ] ApiResponse<T> Wrapper
- [ ] Global Exception Middleware
- [ ] AppDbContext Setup
- [ ] JWT Middleware Setup
- [ ] Program.cs DI Setup

## Sprint 1: Auth & Catalog Reads
- [ ] Auth Service (login/register/me)
- [ ] Auth Controller
- [ ] Catalog Service (Reads: store catalog, single item, audit)
- [ ] Catalog Controller (Reads)

## Sprint 2: Catalog Writes & Discrepancy
- [ ] GeoValidationService
- [ ] TrustScoreService
- [ ] Catalog Service (Writes: PUT, CSV upload)
- [ ] Discrepancy Service (Submit with geo)
- [ ] Missing Products Service (Submit)

## Sprint 3: Admin Approvals
- [ ] Admin Approvals Service (Atomic TX for discrepancy)
- [ ] Admin Stats Service
- [ ] Onboarding Service

## Sprint 4: Final Polish
- [ ] End-to-end smoke tests (with frontend integration)
