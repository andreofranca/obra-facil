import { NextResponse } from 'next/server';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import { MockPaymentProvider } from '@/lib/payments/providers/mock';
import { PaymentService } from '@/lib/payments/service';

const prisma = new PrismaClient();
const paymentProvider = new MockPaymentProvider();

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-payment-signature');
    const payload = await request.json();

    if (!signature || !paymentProvider.verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { providerId, status, eventType } = payload;

    if (!providerId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (eventType === 'charge.updated') {
      const transaction = await prisma.transaction.findFirst({
        where: { providerId }
      });

      if (transaction) {
        // Idempotência: só atualiza se o status for diferente
        if (transaction.status !== status) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: status as PaymentStatus }
          });
          
          // Integração com Operations/Notifications (Disparo de eventos)
          console.log(`[Webhook] Transaction ${transaction.id} updated to ${status}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook Error]', error);
    return NextResponse.json({ error: 'Internal webhook error' }, { status: 500 });
  }
}
