import { Typography } from "@mui/material";

export function PageTitle({ children, sx, ...props }) {
    return (
        <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#ffffff", mb: 3, ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}

export function SectionTitle({ children, sx, ...props }) {
    return (
        <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#ffffff", mb: 2, ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}

export function CardTitle({ children, sx, ...props }) {
    return (
        <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#ffffff", ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}

export function Muted({ children, sx, ...props }) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}

export function StatValue({ children, color = "#FFD700", sx, ...props }) {
    return (
        <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color, ...sx }}
            {...props}
        >
            {children}
        </Typography>
    );
}
