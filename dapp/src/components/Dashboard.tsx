import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  History,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const mockPerformanceData = [
  { date: "2024-01", value: 100 },
  { date: "2024-02", value: 115 },
  { date: "2024-03", value: 108 },
  { date: "2024-04", value: 125 },
];

const mockPortfolio = [
  { token: "BTC", allocation: 25, price: 65000, change: 2.5 },
  { token: "ETH", allocation: 20, price: 3500, change: -1.2 },
  { token: "BNB", allocation: 15, price: 450, change: 1.8 },
];

const mockActions = [
  {
    date: "2024-04-01",
    action: "Rebalanced portfolio",
    details: "Increased BTC allocation by 2%",
  },
  {
    date: "2024-03-28",
    action: "Sold DOGE",
    details: "Market volatility risk mitigation",
  },
  {
    date: "2024-03-25",
    action: "Bought SOL",
    details: "Technical indicators showing bullish trend",
  },
];

export default function Dashboard() {
  const [depositAmount, setDepositAmount] = useState("");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 neumorphic-card">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            HedgeDen AI
          </h1>
        </div>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="neumorphic-button text-primary font-medium">
                Deposit USDC
              </button>
            </DialogTrigger>
            <DialogContent className="neumorphic-card border-0">
              <DialogHeader>
                <DialogTitle>Deposit USDC</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <input
                  type="number"
                  className="neumorphic-input"
                  placeholder="Amount in USDC"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <button
                  className="neumorphic-button w-full text-primary font-medium"
                  onClick={() => console.log("Deposit:", depositAmount)}
                >
                  Confirm Deposit
                </button>
              </div>
            </DialogContent>
          </Dialog>
          <button className="neumorphic-button text-muted-foreground font-medium">
            Withdraw
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neumorphic-card">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Fund Value</h3>
          </div>
          <p className="text-3xl font-bold text-primary">$12.5M</p>
          <p className="text-sm text-muted-foreground">+15.8% this month</p>
        </div>
        <div className="neumorphic-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Shares</h3>
          </div>
          <p className="text-3xl font-bold text-primary">1,250</p>
          <p className="text-sm text-muted-foreground">Value: $125,000</p>
        </div>
        <div className="neumorphic-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Performance</h3>
          </div>
          <p className="text-3xl font-bold text-primary">+25.4%</p>
          <p className="text-sm text-muted-foreground">Since start</p>
        </div>
      </div>

      <div className="neumorphic-card">
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="neumorphic-tabs border-0 bg-transparent">
            <TabsTrigger value="portfolio" className="neumorphic-tab">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="performance" className="neumorphic-tab">
              Performance
            </TabsTrigger>
            <TabsTrigger value="actions" className="neumorphic-tab">
              AI Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <h3 className="text-xl font-semibold mb-4">Current Holdings</h3>
            <div className="space-y-4">
              {mockPortfolio.map((token) => (
                <div key={token.token} className="neumorphic-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{token.token}</h4>
                      <p className="text-sm text-muted-foreground">
                        {token.allocation}% allocation
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${token.price.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm flex items-center ${
                          token.change > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {token.change > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(token.change)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <h3 className="text-xl font-semibold mb-4">
              Historical Performance
            </h3>
            <div className="h-[400px] neumorphic-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f2f2f2",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "5px 5px 15px #cecece, -5px -5px 15px #ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      r: 4,
                      fill: "#f2f2f2",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <h3 className="text-xl font-semibold mb-4">Recent AI Actions</h3>
            <div className="space-y-4">
              {mockActions.map((action, index) => (
                <div key={index} className="neumorphic-card">
                  <div className="flex items-start gap-4">
                    <History className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <p className="font-medium">{action.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {action.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
