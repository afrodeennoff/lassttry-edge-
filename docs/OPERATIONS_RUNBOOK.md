# Operations Runbook

## Monitoring
- API and webhook latency/error dashboards
- Payment failure and retry alerting
- Import sync freshness checks

## Incident Flow
1. Classify severity and assign incident commander.
2. Mitigate with feature flags or rollback.
3. Validate data integrity and customer impact.
4. Publish status updates and postmortem.

## Backups and Restore
1. Verify continuous WAL/PITR snapshots.
2. Run restore into isolated environment.
3. Execute restore checklist for data consistency.
4. Sign off by engineering + product.

## Rollback
- Immutable deploy artifacts.
- Backward-compatible migrations.
- Controlled rollback window with smoke checks.
