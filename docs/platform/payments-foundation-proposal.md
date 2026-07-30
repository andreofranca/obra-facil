# Payments Foundation Proposal

## 1. Objetivos da Capability
A Capability de Payments fornece a base arquitetural para processar transações financeiras na plataforma ObraFácil. Ela centraliza a lógica de cobrança, repasse (Split Payment / Escrow) e conciliação, desacoplando o domínio de negócios (serviços e propostas) das complexidades de integração com gateways de pagamento externos.

## 2. Limites
- **O que faz:** Processa transações, gerencia o ciclo de vida do pagamento (State Machine), processa webhooks do gateway, gerencia repasses (split/escrow) e fornece abstrações agnósticas de provedor.
- **O que não faz:** Não toma decisões de negócios (ex: não decide se um serviço deve ser reembolsado por má qualidade, apenas executa o reembolso quando comandado), não gerencia o carrinho de compras ou negociações.

## 3. Interfaces Públicas
A fundação fornece as seguintes abstrações principais:
- `PaymentService`: Serviço orquestrador usado pelos domínios da aplicação.
- `PaymentProvider`: Interface a ser implementada pelos adaptadores de gateway (ex: Stripe, Mercado Pago, PIX).

## 4. Payment Provider
A interface `PaymentProvider` expõe os métodos estritos que qualquer integração externa deve cumprir:
```typescript
interface PaymentProvider {
  createCharge(params: ChargeParams): Promise<ChargeResult>;
  processRefund(chargeId: string, amount: number): Promise<RefundResult>;
  createTransfer(params: TransferParams): Promise<TransferResult>;
  verifyWebhookSignature(payload: any, signature: string): boolean;
}
```

## 5. Payment Service
Atua como a fachada interna da plataforma. É responsável por orquestrar chamadas ao `PaymentProvider`, persistir estados no banco de dados e emitir eventos de domínio (via `Operations` ou `Notifications`).

## 6. Payment State Machine
Todo pagamento e transferência respeita uma State Machine rígida, prevenindo dupla cobrança ou inconsistência:
- `PENDING`: Aguardando processamento.
- `AUTHORIZED`: Pagamento autorizado (cartão capturado, fundos em hold).
- `COMPLETED`: Fundos capturados/transferidos com sucesso.
- `FAILED`: Falha na transação.
- `REFUNDED`: Reembolso parcial ou integral.
- `DISPUTED`: Disputa aberta pelo cliente no gateway (Chargeback).

## 7. Webhooks
Os gateways de pagamento notificam eventos assíncronos (sucesso, falha, disputas). A Payments Foundation estabelece um endpoint genérico `/api/webhooks/payments` que:
1. Valida a assinatura via `PaymentProvider`.
2. Atualiza a Payment State Machine de forma idempotente.
3. Despacha eventos assíncronos via `Operations` (Event Bus/Job Queue) para que o domínio seja notificado.

## 8. Escrow / Split Payment
Devido à natureza de Marketplace do ObraFácil, o repasse de valores é crítico.
- **Escrow (Garantia):** O pagamento do cliente é retido pela plataforma até a conclusão do serviço.
- **Split:** No momento da liquidação (quando o cliente aprova a entrega via Épico 04), a Payments Foundation processa o "Split", enviando a parte do Profissional e retendo a comissão da Plataforma.

## 9. Integração com Capabilities Existentes
- **Operations:** Os webhooks de pagamento disparam eventos e jobs assíncronos geridos pelo módulo Operations para notificar o domínio sem bloquear a thread HTTP.
- **Security:** O endpoint de webhook deve validar assinaturas com rigor. Todas as APIs internas de pagamento devem passar pela autorização baseada em Roles e validar a propriedade (`ownership`).
- **Observability:** Cada mudança de estado de pagamento é logada (`logger.info` / `logger.error`) com métricas de tempo de resposta do provedor de pagamentos.
- **Notifications:** Disparo de notificações transacionais (Email/In-App) para "Pagamento Aprovado", "Pagamento Recusado", "Repasse Realizado".
- **Analytics:** Rastreamento de métricas de conversão de pagamentos e ticket médio.

## 10. Trade-offs
- **Consistência Eventual vs Forte:** Optou-se por consistência eventual via webhooks para alta disponibilidade e resiliência a falhas do provedor.
- **Provider Agnostic vs Feature Rich:** A abstração do provider nivelará pelo menor denominador comum (ex: autorização + captura). Features específicas de um único gateway exigirão extensão customizada da interface.

## 11. Risk Map
| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Dupla Cobrança (Idempotência) | Alto | Média | Uso de chaves de idempotência únicas por transação em nível de banco de dados e provider. |
| Falha no Webhook | Alto | Média | Job de reconciliação diário (CRON) que sincroniza estados pendentes com o provedor. |
| Exposição de Dados de Cartão | Crítico | Baixa | A fundação nunca armazena dados de cartão (PCI Compliance). Usa tokens e checkout transparente fornecido pelo gateway. |

## 12. Public Contracts
- Tabela `Transaction` (id, amount, currency, status, provider_id, reference_id, metadata, created_at, updated_at).
- Tabela `Transfer` (id, transaction_id, recipient_id, amount, status, created_at).

## 13. ADR References
- **ADR-020-payment-provider-abstraction:** Define o padrão `Provider` isolando regras de negócio dos SDKs de parceiros.
- **ADR-021-idempotency-keys:** Obriga o uso de chaves únicas no cabeçalho e banco de dados para evitar inconsistência de retry.
