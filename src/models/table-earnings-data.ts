export default interface TableEarnings { 
  id: String,
  date: String,
  route: { from: String, to: String },
  routeCode: String,
  driver: String,
  vehicle: String,
  deductions: String,
  netIncome: String,
};
