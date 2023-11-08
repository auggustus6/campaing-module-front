import React from 'react';

type Props = {
  when?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function Show({ when, fallback, children }: Props) {
  if (when) return <>{children}</>;
  return fallback ? <>{fallback}</> : null;
}
