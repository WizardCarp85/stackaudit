const result = {
  id: "test",
  formState: { tools: [], teamSize: "10", companyName: "Acme", email: "" },
  recommendations: [],
  totalMonthlySpend: 100,
  totalMonthlySaving: 50,
  totalAnnualSaving: 600,
  aiSummary: "",
  auditedAt: new Date().toISOString()
};

fetch("http://localhost:3000/api/ai-summary", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(result)
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
