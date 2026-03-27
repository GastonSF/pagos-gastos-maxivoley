"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Abril", pagaron: 15, noPagaron: 9 },
  { month: "Mayo", pagaron: 20, noPagaron: 4 },
  { month: "Junio", pagaron: 17, noPagaron: 7 },
  { month: "Julio", pagaron: 18, noPagaron: 6 },
]

export function PaymentsBarChart() {
  return (
    <Card className="bg-card border-border animate-fade-in animate-fade-in-3">
      <CardHeader>
        <CardTitle className="font-heading text-xl tracking-wide text-foreground">
          PAGOS POR MES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#1e3d5c" 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#1e3d5c' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#1e3d5c' }}
                tickLine={false}
                domain={[0, 24]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2f4a',
                  border: '1px solid #1e3d5c',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
                labelStyle={{ color: '#f8fafc', fontWeight: 600 }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '16px' }}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {value === 'pagaron' ? 'Pagaron' : 'No pagaron'}
                  </span>
                )}
              />
              <Bar 
                dataKey="pagaron" 
                fill="#00d4aa" 
                radius={[4, 4, 0, 0]}
                name="pagaron"
              />
              <Bar 
                dataKey="noPagaron" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]}
                name="noPagaron"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
