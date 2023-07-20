import { HelpOutline } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import React from 'react';

interface CustomTooltipProps {
  title: string;
}

export default function CustomTooltip({ title }: CustomTooltipProps) {
  return (
    <Tooltip
      placement="right"
      title={<Typography>{title}</Typography>}
    >
      <HelpOutline sx={{ mb: -0.5, ml: 0.2 }} fontSize="small" />
    </Tooltip>
  );
}
