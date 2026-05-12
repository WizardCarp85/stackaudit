# Automated Tests

List of automated tests for the StackAudit engine.

| Filename | Covers | How to Run |
| :--- | :--- | :--- |
| `tests/audit-engine.test.ts` | Audit Engine logic: plan downgrades, tool overlaps, and seat right-sizing. | `npm test` |

## Test Coverage Details

The `tests/audit-engine.test.ts` file includes the following test cases:

1. **Cursor Downgrade**: Verifies that the engine recommends downgrading from Cursor Business to Cursor Pro when the team size is less than 5, saving $20 per seat.
2. **Cursor Overlap**: Verifies that the engine recommends dropping GitHub Copilot if Cursor is also active, as they provide redundant functionality.
3. **Cursor Right-sizing**: Verifies that the engine recommends reducing the number of seats to match the team size when there is an over-allocation.
4. **GitHub Copilot Downgrade**: Verifies that the engine recommends downgrading from Copilot Enterprise to Copilot Business for teams smaller than 10 seats.
5. **Empty Audit**: Verifies that the engine handles cases with no enabled tools correctly, reporting zero spend and zero savings.

## Continuous Integration

Tests are automatically run on every push to the `main` branch via GitHub Actions. See `.github/workflows/ci.yml` for configuration.
