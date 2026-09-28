import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Order {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  user: { name: string; email: string };
  items: Array<{ title: string }>;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  COMPLETED: 'badge-success',
  PENDING: 'badge-warning',
  FAILED: 'badge-danger',
  REFUNDED: 'badge text-slate-600 bg-slate-100 border-slate-200',
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading font-semibold text-lg">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs text-primary hover:underline">View all</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No orders yet
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                {order.user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{order.user.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {order.items[0]?.title}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold">{formatCurrency(order.total)}</div>
                <div className={`text-xs ${statusColors[order.status] || ''} mt-0.5 badge`}>
                  {order.status.toLowerCase()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
