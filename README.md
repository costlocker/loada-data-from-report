# Costlocker date change for recurring budgets

App changes end date for all recurring budgets which finish on the last day of current month to first day of next month.

# Installation
`npm install`

# Generate types
`npm run generate`
- after installation generate types from Costlocker API to `generated/graphql.ts`
- when failed, your queries and/or mutation are not compatible with Costlocker GraphQL API anymore - you need to fix them before next steps

# Run
`npm start`
# loada-data-from-report
