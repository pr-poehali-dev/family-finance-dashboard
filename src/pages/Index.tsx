import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ExpensePieChart } from "@/components/ui/charts/expense-pie-chart";
import { IncomeExpenseBarChart } from "@/components/ui/charts/income-expense-bar-chart";

type TransactionType = "income" | "expense";

interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

const EXPENSE_CATEGORIES = [
  "Продукты",
  "Транспорт",
  "Развлечения",
  "Здоровье",
  "Образование",
  "Дом и ЖКХ",
  "Одежда",
  "Связь",
  "Другое"
];

const INCOME_CATEGORIES = [
  "Зарплата",
  "Фриланс",
  "Инвестиции",
  "Подарки",
  "Другое"
];

const Index = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  
  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as TransactionType,
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: ""
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedGoals = localStorage.getItem("goals");
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const sampleTransactions: Transaction[] = [
        { id: "1", type: "income", category: "Зарплата", amount: 85000, date: "2025-10-01", description: "Зарплата за октябрь" },
        { id: "2", type: "expense", category: "Продукты", amount: 12500, date: "2025-10-05", description: "Покупки в супермаркете" },
        { id: "3", type: "expense", category: "Транспорт", amount: 3200, date: "2025-10-07", description: "Проездной" },
        { id: "4", type: "expense", category: "Развлечения", amount: 5600, date: "2025-10-10", description: "Кино и кафе" },
        { id: "5", type: "income", category: "Фриланс", amount: 25000, date: "2025-10-15", description: "Проект на фрилансе" },
        { id: "6", type: "expense", category: "Дом и ЖКХ", amount: 8900, date: "2025-10-20", description: "Коммунальные услуги" },
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem("transactions", JSON.stringify(sampleTransactions));
    }
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      const sampleGoals: FinancialGoal[] = [
        { id: "1", name: "Новый ноутбук", targetAmount: 80000, currentAmount: 35000 },
        { id: "2", name: "Отпуск", targetAmount: 120000, currentAmount: 48000 },
      ];
      setGoals(sampleGoals);
      localStorage.setItem("goals", JSON.stringify(sampleGoals));
    }

    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const addTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      date: newTransaction.date,
      description: newTransaction.description
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setNewTransaction({
      type: "expense",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: ""
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Успешно!",
      description: `Транзакция на ${transaction.amount}₽ добавлена`
    });
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast({
      title: "Удалено",
      description: "Транзакция успешно удалена"
    });
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Ошибка",
        description: "Заполните название и целевую сумму",
        variant: "destructive"
      });
      return;
    }

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    setNewGoal({ name: "", targetAmount: "", deadline: "" });
    setIsGoalDialogOpen(false);

    toast({
      title: "Цель создана!",
      description: `Цель "${goal.name}" добавлена`
    });
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    toast({
      title: "Отлично!",
      description: `Добавлено ${amount}₽ к цели`
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const getFinancialHealth = () => {
    if (totalIncome === 0) return { label: "Нет данных", color: "bg-gray-500" };
    const ratio = totalExpense / totalIncome;
    if (ratio < 0.5) return { label: "Отлично", color: "bg-green-500" };
    if (ratio < 0.8) return { label: "Хорошо", color: "bg-emerald-500" };
    if (ratio < 1) return { label: "Стабильно", color: "bg-yellow-500" };
    return { label: "Внимание", color: "bg-red-500" };
  };

  const expensesByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedExpenses = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const health = getFinancialHealth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Семейный бюджет
            </h1>
            <p className="text-muted-foreground mt-1">Управляйте финансами с умом</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Sun" size={18} className="text-muted-foreground" />
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Icon name="Moon" size={18} className="text-muted-foreground" />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" size={18} />
                  Добавить транзакцию
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая транзакция</DialogTitle>
                  <DialogDescription>Добавьте доход или расход</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <Select 
                      value={newTransaction.type} 
                      onValueChange={(value: TransactionType) => 
                        setNewTransaction({...newTransaction, type: value, category: ""})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Доход</SelectItem>
                        <SelectItem value="expense">Расход</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <Select 
                      value={newTransaction.category} 
                      onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newTransaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Сумма (₽)</Label>
                    <Input 
                      type="number" 
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Дата</Label>
                    <Input 
                      type="date" 
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Описание (необязательно)</Label>
                    <Input 
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      placeholder="Комментарий"
                    />
                  </div>
                </div>
                <Button onClick={addTransaction} className="w-full">
                  Добавить
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Wallet" size={20} className="text-primary" />
                Баланс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {balance.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Текущий остаток
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-secondary" />
                Доходы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {totalIncome.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                За текущий месяц
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="TrendingDown" size={20} className="text-destructive" />
                Расходы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {totalExpense.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                За текущий месяц
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Activity" size={20} />
                Финансовое здоровье
              </CardTitle>
              <CardDescription>
                Индикатор состояния бюджета
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${health.color} flex items-center justify-center text-white font-bold`}>
                  {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}%
                </div>
                <div>
                  <div className="text-2xl font-bold">{health.label}</div>
                  <p className="text-sm text-muted-foreground">
                    Расходы составляют {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}% от доходов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={20} />
                Топ категорий расходов
              </CardTitle>
              <CardDescription>
                5 самых затратных категорий
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedExpenses.map(([category, amount]) => {
                  const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {amount.toLocaleString('ru-RU')} ₽ ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="transactions" className="gap-2">
              <Icon name="List" size={16} />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Icon name="Target" size={16} />
              Цели
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>
                  Все ваши доходы и расходы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Транзакций пока нет. Добавьте первую!
                    </p>
                  ) : (
                    transactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(transaction => (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "income" ? "bg-secondary/20" : "bg-destructive/20"
                            }`}>
                              <Icon 
                                name={transaction.type === "income" ? "ArrowDownLeft" : "ArrowUpRight"} 
                                size={18}
                                className={transaction.type === "income" ? "text-secondary" : "text-destructive"}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{transaction.category}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                                {transaction.description && ` • ${transaction.description}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-lg font-semibold ${
                              transaction.type === "income" ? "text-secondary" : "text-destructive"
                            }`}>
                              {transaction.type === "income" ? "+" : "-"}
                              {transaction.amount.toLocaleString('ru-RU')} ₽
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteTransaction(transaction.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} />
                    Структура расходов
                  </CardTitle>
                  <CardDescription>
                    Распределение расходов по категориям
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpensePieChart 
                    data={Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Доходы vs Расходы
                  </CardTitle>
                  <CardDescription>
                    Сравнение доходов и расходов по месяцам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IncomeExpenseBarChart 
                    data={[
                      { month: "Сен", income: 95000, expense: 67000 },
                      { month: "Окт", income: totalIncome, expense: totalExpense },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Статистика
                  </CardTitle>
                  <CardDescription>
                    Ключевые метрики за текущий период
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Средний дневной расход</div>
                      <div className="text-2xl font-bold text-primary">
                        {(totalExpense / 30).toFixed(0).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Самая затратная категория</div>
                      <div className="text-2xl font-bold text-secondary">
                        {sortedExpenses[0]?.[0] || "—"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Прогноз на конец месяца</div>
                      <div className={`text-2xl font-bold ${balance > 0 ? "text-accent" : "text-destructive"}`}>
                        {balance.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const remaining = goal.targetAmount - goal.currentAmount;
                
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Icon name="Target" size={20} className="text-primary" />
                          {goal.name}
                        </span>
                        <Badge variant={progress === 100 ? "default" : "secondary"}>
                          {progress.toFixed(0)}%
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Цель: {goal.targetAmount.toLocaleString('ru-RU')} ₽
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Накоплено</span>
                          <span className="font-medium">
                            {goal.currentAmount.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Осталось: {remaining.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      
                      {progress < 100 && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => contributeToGoal(goal.id, 1000)}
                            className="flex-1"
                          >
                            +1000₽
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => contributeToGoal(goal.id, 5000)}
                            className="flex-1"
                          >
                            +5000₽
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => contributeToGoal(goal.id, 10000)}
                            className="flex-1"
                          >
                            +10000₽
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
                  <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Plus" size={18} />
                        Добавить цель
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новая финансовая цель</DialogTitle>
                        <DialogDescription>
                          Поставьте цель и следите за прогрессом
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Название цели</Label>
                          <Input 
                            value={newGoal.name}
                            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                            placeholder="Например: Новый ноутбук"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Целевая сумма (₽)</Label>
                          <Input 
                            type="number"
                            value={newGoal.targetAmount}
                            onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Срок (необязательно)</Label>
                          <Input 
                            type="date"
                            value={newGoal.deadline}
                            onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={addGoal} className="w-full">
                        Создать цель
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;