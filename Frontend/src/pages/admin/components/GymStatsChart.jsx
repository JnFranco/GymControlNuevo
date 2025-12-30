import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Box, Typography } from "@mui/material";

export default function GymStatsChart({ data = [] }) {

  // Si no hay data aún
  if (!data || data.length === 0) {
    return (
      <Box sx={{ 
        height: 220, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        opacity: 0.5
      }}>
        <Typography variant="body2" sx={{ color: 'red', fontWeight: 700 }}>
  ❌ NO HAY DATA PARA EL GRÁFICO
</Typography>

      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="dia" 
            stroke="#fff" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            stroke="#fff" 
            tick={{ fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid #333",
              color: "#fff"
            }}
          />
          <Bar 
            dataKey="asistencias" 
            radius={[6, 6, 0, 0]} 
            fill="#FFD700" 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
