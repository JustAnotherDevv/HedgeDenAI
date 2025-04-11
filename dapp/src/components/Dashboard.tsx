import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  History,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  User,
  BarChart3,
  Calendar,
  AlertCircle,
} from "lucide-react";

const mockPerformanceData = [
  { date: "2024-01", value: 100 },
  { date: "2024-02", value: 115 },
  { date: "2024-03", value: 108 },
  { date: "2024-04", value: 125 },
];

const mockPerformanceDataExpanded = [
  { date: "2023-10", value: 85 },
  { date: "2023-11", value: 92 },
  { date: "2023-12", value: 95 },
  { date: "2024-01", value: 100 },
  { date: "2024-02", value: 115 },
  { date: "2024-03", value: 108 },
  { date: "2024-04", value: 125 },
];

const mockPortfolio = [
  { token: "BTC", allocation: 25, price: 65000, change: 2.5 },
  { token: "ETH", allocation: 20, price: 3500, change: -1.2 },
  { token: "BNB", allocation: 15, price: 450, change: 1.8 },
  { token: "SOL", allocation: 12, price: 180, change: 3.7 },
  { token: "AVAX", allocation: 8, price: 35, change: -0.5 },
];

const mockActions = [
  {
    date: "2024-04-01",
    action: "Rebalanced portfolio",
    details: "Increased BTC allocation by 2%",
    impact: "Positive",
  },
  {
    date: "2024-03-28",
    action: "Sold DOGE",
    details: "Market volatility risk mitigation",
    impact: "Neutral",
  },
  {
    date: "2024-03-25",
    action: "Bought SOL",
    details: "Technical indicators showing bullish trend",
    impact: "Positive",
  },
];

const mockNotifications = [
  {
    id: 1,
    title: "Portfolio Alert",
    message: "BTC price up 5% in the last 24 hours",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Fund Update",
    message: "Monthly performance report is now available",
    time: "2 hours ago",
    read: true,
  },
];

export default function Dashboard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeframe, setTimeframe] = useState("3m");

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <div
      className={`container mx-auto p-6 space-y-8 transition-opacity duration-700 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-primary neumorphic-text">
            HedgeDen AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="neumorphic-button p-2 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-primary" />
              {mockNotifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 z-50 neumorphic-card">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <div className="space-y-3">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.read
                          ? "opacity-70"
                          : "neumorphic-card-concave"
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="neumorphic-button text-primary">
                Deposit USDC
              </button>
            </DialogTrigger>
            <DialogContent className="neumorphic-card border-0">
              <DialogHeader>
                <DialogTitle className="text-xl neumorphic-text">
                  Deposit USDC
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="neumorphic-input"
                    placeholder="Amount in USDC"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="neumorphic-card-concave p-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Minimum deposit amount is 100 USDC
                  </p>
                </div>
              </div>
              <DialogFooter>
                <button className="neumorphic-button w-full text-muted-foreground font-medium">
                  Cancel
                </button>
                <button
                  className="neumorphic-button text-primary w-full font-medium"
                  onClick={() => console.log("Deposit:", depositAmount)}
                >
                  Confirm Deposit
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button className="neumorphic-button text-muted-foreground font-medium">
            Withdraw
          </button>
          <button className="neumorphic-button p-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="neumorphic-card transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Fund Value</h3>
          </div>
          <p className="text-3xl font-bold text-primary neumorphic-text">
            $12.5M
          </p>
          <div className="flex items-center mt-1 text-green-500">
            <ArrowUpRight className="h-4 w-4" />
            <p className="text-sm">+15.8% this month</p>
          </div>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(59, 130, 246, 0.8)"
                  fill="rgba(59, 130, 246, 0.2)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="neumorphic-card transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 rounded-full">
              <PieChart className="h-5 w-5 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold">Your Shares</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-500 neumorphic-text">
            1,250
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground">Value: $125,000</p>
            <span className="neumorphic-badge text-indigo-500">
              10% of fund
            </span>
          </div>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(99, 102, 241, 0.8)"
                  fill="rgba(99, 102, 241, 0.2)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="neumorphic-card transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-50 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Performance</h3>
          </div>
          <p className="text-3xl font-bold text-green-500 neumorphic-text">
            +25.4%
          </p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground">Since start</p>
            <button className="neumorphic-button text-xs py-1 px-2">
              <span className="text-primary font-medium">View history</span>
            </button>
          </div>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgba(34, 197, 94, 0.8)"
                  fill="rgba(34, 197, 94, 0.2)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="neumorphic-card">
        <Tabs defaultValue="portfolio" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="neumorphic-tabs border-0 bg-transparent">
              <TabsTrigger value="portfolio" className="neumorphic-tab">
                <PieChart className="h-4 w-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="performance" className="neumorphic-tab">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="actions" className="neumorphic-tab">
                <History className="h-4 w-4 mr-2" />
                AI Actions
              </TabsTrigger>
            </TabsList>

            <div className="neumorphic-tabs p-1">
              {["1m", "3m", "6m", "YTD", "1y"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-sm rounded-lg transition-all ${
                    timeframe === period
                      ? "neumorphic-tab font-medium"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setTimeframe(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <TabsContent value="portfolio" className="focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold neumorphic-text">
                Current Holdings
              </h3>
              <button className="neumorphic-button text-primary font-medium">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Allocations
                </span>
              </button>
            </div>
            <div className="space-y-4">
              {mockPortfolio.map((token) => (
                <div
                  key={token.token}
                  className="neumorphic-card transform transition-all hover:translate-x-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-full ${
                          token.change > 0
                            ? "bg-green-50"
                            : token.change < 0
                            ? "bg-red-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-bold">{token.token}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{token.token}</h4>
                        <div className="flex items-center">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full mr-2">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${token.allocation}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {token.allocation}% allocation
                          </p>
                        </div>
                      </div>
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

          <TabsContent value="performance" className="focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold neumorphic-text">
                Historical Performance
              </h3>
              <button className="neumorphic-button text-primary font-medium">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Compare Benchmarks
                </span>
              </button>
            </div>
            <div className="h-[400px] neumorphic-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockPerformanceDataExpanded}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(209, 213, 219, 0.5)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "rgba(209, 213, 219, 0.8)" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "rgba(209, 213, 219, 0.8)" }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f5f7",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow:
                        "5px 5px 15px rgba(195, 195, 195, 0.5), -5px -5px 15px rgba(255, 255, 255, 0.9)",
                    }}
                    formatter={(value) => [`${value}`, "Value"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      r: 4,
                      fill: "#f5f5f7",
                    }}
                    activeDot={{
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      r: 6,
                      fill: "#f5f5f7",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "High", value: "125", change: "+25%" },
                { label: "Low", value: "85", change: "-15%" },
                { label: "Average", value: "105", change: "+5%" },
                { label: "Volatility", value: "Medium", change: "15.7%" },
              ].map((stat, index) => (
                <div key={index} className="neumorphic-card-concave">
                  <h4 className="text-sm text-muted-foreground">
                    {stat.label}
                  </h4>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold neumorphic-text">
                Recent AI Actions
              </h3>
              <button className="neumorphic-button text-primary font-medium">
                <span className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure AI
                </span>
              </button>
            </div>
            <div className="space-y-4">
              {mockActions.map((action, index) => (
                <div
                  key={index}
                  className="neumorphic-card transform transition-all hover:translate-x-1"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full flex-shrink-0 ${
                        action.impact === "Positive"
                          ? "bg-green-50"
                          : action.impact === "Negative"
                          ? "bg-red-50"
                          : "bg-blue-50"
                      }`}
                    >
                      <History className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{action.action}</p>
                        <span
                          className={`neumorphic-badge ${
                            action.impact === "Positive"
                              ? "text-green-500"
                              : action.impact === "Negative"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          {action.impact}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.details}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          {action.date}
                        </p>
                        <button className="text-xs text-primary font-medium">
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="neumorphic-divider"></div>

            <div className="mt-4 neumorphic-card-concave">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h4 className="font-medium">AI Insights</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI has detected increased volatility in the market. Consider
                adjusting risk parameters or increasing stable asset allocations
                to mitigate potential downside risks.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
