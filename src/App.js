import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LabelList, Cell, PieChart, Pie
} from "recharts";

export default function PrintSalesTracker() {
  const [tab, setTab] = useState("sales");
  const [sales, setSales] = useState([
    {
      date: "2025-08-01",
      item: "T-Rex Skull Replica",
      channel: "Website",
      filamentCost: 8.5,
      powerCost: 1.2,
      otherCosts: 0.5,
      deliveryCost: 5,
      totalCost: 15.2,
      price: 50,
      taxAmount: 10,
      profit: 24.8,
      printingTime: 10,
      taxRate: "20"
    },
    {
      date: "2025-08-02",
      item: "Velociraptor Claw Model",
      channel: "In Person",
      filamentCost: 3.2,
      powerCost: 0.75,
      otherCosts: 0.4,
      deliveryCost: 0,
      totalCost: 4.35,
      price: 18,
      taxAmount: 3.6,
      profit: 10.05,
      printingTime: 4,
      taxRate: "20"
    },
    {
      date: "2025-08-03",
      item: "Triceratops Horn Replica",
      channel: "Cash Sale",
      filamentCost: 6,
      powerCost: 1,
      otherCosts: 0.6,
      deliveryCost: 4,
      totalCost: 11.6,
      price: 40,
      taxAmount: 8,
      profit: 20.4,
      printingTime: 8,
      taxRate: "20"
    }
  ]);

  const [items, setItems] = useState([
    { name: "T-Rex Skull Replica", filamentCost: 8.5, powerCost: 1.2, otherCosts: 0.5, printingTime: 10, removed: false },
    { name: "Velociraptor Claw Model", filamentCost: 3.2, powerCost: 0.75, otherCosts: 0.4, printingTime: 4, removed: false },
    { name: "Triceratops Horn Replica", filamentCost: 6, powerCost: 1, otherCosts: 0.6, printingTime: 8, removed: false }
  ]);

  const [channels, setChannels] = useState(["Website", "In Person", "Cash Sale"]);

  const [expenses, setExpenses] = useState([
    { category: "Filament Purchase", name: "Bulk PLA Filament", cost: 30, date: "2025-07-28", auto: false },
    { category: "Machine Repairs", name: "Extruder Replacement", cost: 15, date: "2025-07-29", auto: false },
    { category: "Waste Filament", name: "Failed Prints", cost: 5, date: "2025-07-30", auto: false },
    { category: "COGS – Filament", name: "T-Rex Skull Replica (filament)", cost: 8.5, date: "2025-08-01", auto: true },
    { category: "COGS – Power", name: "T-Rex Skull Replica (power)", cost: 1.2, date: "2025-08-01", auto: true },
    { category: "COGS – Other", name: "T-Rex Skull Replica (other)", cost: 0.5, date: "2025-08-01", auto: true },
    { category: "COGS – Delivery", name: "T-Rex Skull Replica (delivery)", cost: 5, date: "2025-08-01", auto: true }
  ]);

  const [showCOGS, setShowCOGS] = useState(true);
  const expenseCategories = [
    "Machine Repairs", "Filament Purchase", "Waste Filament",
    "Packaging Materials", "Power Bill", "Software Subscription",
    "Marketing/Ads", "Other"
  ];
  const today = new Date().toISOString().split("T")[0];
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "£");
  useEffect(() => { localStorage.setItem("currency", currency); }, [currency]);

  const [saleForm, setSaleForm] = useState({
    item: "T-Rex Skull Replica", price: "", channel: "Website", taxRate: "20", date: today
  });
  const [newItem, setNewItem] = useState({ name: "", filamentCost: "", powerCost: "", otherCosts: "", printingTime: "" });
  const [newExpense, setNewExpense] = useState({ category: expenseCategories[0], name: "", cost: "", date: today });

  const addItem = () => {
    if (!newItem.name) return;
    setItems([...items, {
      name: newItem.name,
      filamentCost: parseFloat(newItem.filamentCost) || 0,
      powerCost: parseFloat(newItem.powerCost) || 0,
      otherCosts: parseFloat(newItem.otherCosts) || 0,
      printingTime: parseFloat(newItem.printingTime) || 0,
      removed: false
    }]);
    setNewItem({ name: "", filamentCost: "", powerCost: "", otherCosts: "", printingTime: "" });
  };

  const editItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "name" ? value : parseFloat(value) || 0;
    setItems(updated);
  };

  const toggleItemStatus = (index) => {
    const updated = [...items];
    updated[index].removed = !updated[index].removed;
    setItems(updated);
  };

  const addSale = () => {
    const selectedItem = items.find(i => i.name === saleForm.item);
    if (!selectedItem || !saleForm.price) return;
    let deliveryCost = 0;
    if (saleForm.channel !== "In Person" && saleForm.channel !== "Cash Sale") {
      deliveryCost = parseFloat(prompt("Enter delivery cost:")) || 0;
    }
    const totalCost = selectedItem.filamentCost + selectedItem.powerCost + selectedItem.otherCosts + deliveryCost;
    const price = parseFloat(saleForm.price);
    const taxRate = parseFloat(saleForm.taxRate) || 0;
    const taxAmount = (price * taxRate) / 100;
    const profit = price - totalCost - taxAmount;
    const saleEntry = {
      ...saleForm,
      filamentCost: selectedItem.filamentCost,
      powerCost: selectedItem.powerCost,
      otherCosts: selectedItem.otherCosts,
      printingTime: selectedItem.printingTime,
      deliveryCost, totalCost, price, taxAmount, profit
    };
    if (!channels.includes(saleForm.channel)) {
      setChannels([...channels, saleForm.channel]);
    }
    setSales([...sales, saleEntry]);
    setSaleForm({ ...saleForm, price: "", date: today, taxRate: saleForm.taxRate });

    const cogsEntries = [
      { category: "COGS – Filament", name: `${saleEntry.item} (filament)`, cost: selectedItem.filamentCost },
      { category: "COGS – Power", name: `${saleEntry.item} (power)`, cost: selectedItem.powerCost },
      { category: "COGS – Other", name: `${saleEntry.item} (other)`, cost: selectedItem.otherCosts },
      { category: "COGS – Delivery", name: `${saleEntry.item} (delivery)`, cost: deliveryCost }
    ].map(e => ({ ...e, date: saleEntry.date, auto: true }));
    setExpenses([...expenses, ...cogsEntries]);
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.cost) return;
    setExpenses([...expenses, {
      ...newExpense,
      cost: parseFloat(newExpense.cost),
      auto: false
    }]);
    setNewExpense({ category: expenseCategories[0], name: "", cost: "", date: today });
  };

  const deleteExpense = (index) => {
    if (expenses[index].auto) return;
    const updated = [...expenses];
    updated.splice(index, 1);
    setExpenses(updated);
  };

  const filteredExpenses = showCOGS ? expenses : expenses.filter(e => !e.category.startsWith("COGS –"));

  const totalFilamentPurchase = expenses
    .filter(e => e.category === "Filament Purchase")
    .reduce((a, e) => a + e.cost, 0);

  const totalFilamentUsed = expenses
    .filter(e => e.category === "COGS – Filament")
    .reduce((a, e) => a + e.cost, 0);

  const netFilamentCost = Math.max(0, totalFilamentPurchase - totalFilamentUsed);

  const totals = {
    revenue: sales.reduce((a, s) => a + s.price, 0),
    cogs: expenses
      .filter(e => e.category.startsWith("COGS –") && e.category !== "COGS – Filament")
      .reduce((a, e) => a + e.cost, 0)
      + netFilamentCost,
    other: expenses.filter(e => !e.category.startsWith("COGS –") && e.category !== "Filament Purchase")
      .reduce((a, e) => a + e.cost, 0),
  };
  const grossProfit = totals.revenue - totals.cogs;
  const netProfit = grossProfit - totals.other;

  const expenseSummary = () => {
    const summary = {};
    filteredExpenses.forEach(e => {
      if (e.category === "Filament Purchase") return;
      if (!summary[e.category]) summary[e.category] = 0;
      summary[e.category] += e.cost;
    });
    if (netFilamentCost > 0) summary["Filament Purchase (net)"] = netFilamentCost;
    return Object.entries(summary).map(([cat, value]) => ({ name: cat, value }));
  };

  const timeData = Object.values(
    sales.reduce((acc, s) => {
      if (!acc[s.item]) acc[s.item] = { item: s.item, hours: 0, profit: 0, count: 0 };
      acc[s.item].hours += s.printingTime;
      const item = items.find(i => i.name === s.item);
      if (!item) return acc;
      const deliveryCost = s.deliveryCost || 0;
      const taxRate = parseFloat(s.taxRate) || 0;
      const taxAmount = (s.price * taxRate) / 100;
      const totalCost = (item.filamentCost || 0) + (item.powerCost || 0) + (item.otherCosts || 0) + deliveryCost;
      const profit = s.price - totalCost - taxAmount;
      acc[s.item].profit += profit;
      acc[s.item].count++;
      return acc;
    }, {})
  ).map(e => ({ ...e, profitPerHour: e.hours > 0 ? e.profit / e.hours : 0 }))
   .sort((a, b) => b.profitPerHour - a.profitPerHour);

  const highest = timeData.length ? timeData[0].profitPerHour : 0;
  const lowest = timeData.length ? timeData[timeData.length - 1].profitPerHour : 0;

  const paymentSummary = () => {
    let cashTotal = 0;
    let cardTotal = 0;
    sales.forEach(s => {
      if (s.channel === "Cash Sale") {
        cashTotal += s.price;
      } else {
        cardTotal += s.price;
      }
    });
    return [
      { name: "Cash", value: cashTotal },
      { name: "Card/Digital", value: cardTotal }
    ];
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: 1200, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          {["sales", "items", "expenses", "analytics", "time"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ marginRight: 8 }}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="£">£ GBP</option>
          <option value="$">$ USD</option>
          <option value="€">€ EUR</option>
          <option value="¥">¥ JPY</option>
        </select>
      </div>

      {tab === "sales" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <select value={saleForm.item} onChange={e => setSaleForm({ ...saleForm, item: e.target.value })}>
              {items.filter(i => !i.removed).map(i => <option key={i.name}>{i.name}</option>)}
            </select>
            <input type="number" placeholder="Price" value={saleForm.price} onChange={e => setSaleForm({ ...saleForm, price: e.target.value })} />
            <input list="channel-list" value={saleForm.channel} onChange={e => setSaleForm({ ...saleForm, channel: e.target.value })} />
            <datalist id="channel-list">
              {channels.map(c => <option key={c} value={c} />)}
            </datalist>
            <input type="number" placeholder="Tax %" value={saleForm.taxRate} onChange={e => setSaleForm({ ...saleForm, taxRate: e.target.value })} />
            <input type="date" value={saleForm.date} onChange={e => setSaleForm({ ...saleForm, date: e.target.value })} />
            <button onClick={addSale}>Add Sale</button>
          </div>
          <table border="1" cellPadding="4" style={{ width: "100%" }}>
            <thead>
              <tr>
                {["date", "item", "channel", "filamentCost", "powerCost", "otherCosts", "deliveryCost", "totalCost", "price", "taxAmount", "profit", "printingTime"].map(col => (
                  <th key={col}>{col}</th>
                ))}
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i}>
                  <td>{s.date}</td>
                  <td>{s.item}</td>
                  <td>{s.channel}</td>
                  <td>{currency}{s.filamentCost}</td>
                  <td>{currency}{s.powerCost}</td>
                  <td>{currency}{s.otherCosts}</td>
                  <td>{currency}{s.deliveryCost}</td>
                  <td>{currency}{s.totalCost.toFixed(2)}</td>
                  <td>{currency}{s.price.toFixed(2)}</td>
                  <td>{currency}{s.taxAmount.toFixed(2)}</td>
                  <td>{currency}{s.profit.toFixed(2)}</td>
                  <td>{s.printingTime} hrs</td>
                  <td><button onClick={() => {
                    const updated = [...sales];
                    updated.splice(i, 1);
                    setSales(updated);
                  }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "analytics" && (
        <>
          <p>Revenue: {currency}{totals.revenue.toFixed(2)}</p>
          <p>COGS: {currency}{totals.cogs.toFixed(2)}</p>
          <p>Gross Profit: {currency}{grossProfit.toFixed(2)}</p>
          <p>Other Expenses: {currency}{totals.other.toFixed(2)}</p>
          <p>Net Profit: {currency}{netProfit.toFixed(2)}</p>
          <BarChart width={600} height={300} data={[
            { name: "Revenue", value: totals.revenue },
            { name: "COGS", value: totals.cogs },
            { name: "Gross Profit", value: grossProfit },
            { name: "Other Expenses", value: totals.other },
            { name: "Net Profit", value: netProfit }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(val) => `${currency}${val.toFixed(2)}`} />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
          <PieChart width={400} height={300}>
            <Pie dataKey="value" data={paymentSummary()} cx="50%" cy="50%" outerRadius={100} label>
              {paymentSummary().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "green" : "blue"} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `${currency}${val.toFixed(2)}`} />
          </PieChart>
        </>
      )}
    </div>
  );
}
