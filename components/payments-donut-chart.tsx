"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Pagaron", value: 18, color: "#00d4aa" },
  { name: "No pagaron", value: 6, color: "#f43f5e" },
]

export function PaymentsDonutChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const percentage = Math.round((data[0].value / total) * 100)

  return (
    <Card className="bg-card border-border animate-fade-in animate-fade-in-3">
      <CardHeader>
        <CardTitle className="font-heading text-xl tracking-wide text-foreground">
          ESTADO DE PAGOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl text-teal">{percentage}%</span>
            <span className="text-muted-foreground text-sm">pago</span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
