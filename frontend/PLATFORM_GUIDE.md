# Guia da Platform Layer (PX)

A Platform Layer centraliza a infraestrutura de UI da aplicação ObraFácil, desprendendo as telas (`app/`) e componentes puros (`components/`) do peso de gerenciar estados modais, notificações, etc.

## 1. Arquitetura da Platform Layer

```mermaid
flowchart TD
    AppRoot[App Layout Root]
    subgraph Platform Layer
        ThemeProvider --> DialogProvider
        DialogProvider --> LoadingProvider
        LoadingProvider --> NotificationProvider
    end
    
    subgraph Application Modules
        Pages[Telas / App Router]
        Forms[Formulários]
        Services[Lógicas e Custom Hooks]
    end

    AppRoot --> ThemeProvider
    NotificationProvider --> Pages
    
    Pages -.-> |Utiliza useDialog()| DialogProvider
    Forms -.-> |Utiliza useToast()| NotificationProvider
    Services -.-> |Utiliza useLoading()| LoadingProvider
    
    IconsWrapper[platform/icons] --> Pages
    IconsWrapper --> Forms
```

## 2. Como Utilizar os Recursos

### Notificações (useToast)
Em qualquer componente sob o escopo do `NotificationProvider`:
```tsx
import { useToast } from "@/platform/notifications";

export function MeuComponente() {
  const toast = useToast();

  const handleSalvar = () => {
    toast.success("Perfil atualizado com sucesso!");
    // toast.error, toast.info, toast.warning
  };
}
```

### Diálogos Globais (useDialog)
Para confirmações crônicas sem poluir seu JSX:
```tsx
import { useDialog } from "@/platform/dialogs";

export function BotaoExcluir() {
  const dialog = useDialog();

  const handleExcluir = () => {
    dialog.confirm({
      title: "Tem certeza?",
      description: "Esta ação é irreversível.",
      confirmText: "Excluir",
      onConfirm: async () => {
        await api.delete("/recurso");
      }
    });
  };
}
```

### Loading e Feedback
- Use `useLoading()` para bloquear a tela inteira (via Overlay) em ações complexas sistêmicas.
- Para ações menores locais, prefira `<ButtonLoading isLoading={isSubmitting}>Salvar</ButtonLoading>`.
- Para skeleton loaders: `<CardSkeleton />`, `<ListSkeleton />` no carregamento passivo de dados.

### Ícones
Sempre importe os ícones do nosso wrapper genérico, nunca do pacote base:
```tsx
// CORRETO
import { Icon } from "@/platform/icons";
<Icon name="check" size="sm" />

// ERRADO
import { Check } from "lucide-react";
```
