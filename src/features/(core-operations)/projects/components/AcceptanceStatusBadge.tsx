import { Badge } from '@/ui/badge';
import type { AcceptanceStatus } from '../types';

const statusMap: Record<
  AcceptanceStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  草稿: { label: '草稿', variant: 'outline' },
  待審批: { label: '待審批', variant: 'secondary' },
  已批准: { label: '已批准', variant: 'default' },
  已駁回: { label: '已駁回', variant: 'destructive' },
};

export function AcceptanceStatusBadge({
  status,
}: {
  status: AcceptanceStatus;
}) {
  const { label, variant } = statusMap[status] || {
    label: '未知',
    variant: 'outline',
  };
  return <Badge variant={variant}>{label}</Badge>;
}
