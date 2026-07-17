import { Button } from "@/components/ui";
import { colors, spacing, typography } from "@/design-system";

type UserMenuProps = {
  name: string;
  onSignOut?: () => void;
};

export function UserMenu({ name, onSignOut }: UserMenuProps) {
  return (
    <div
      aria-label="Menu do usuário"
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[3],
      }}
    >
      <span
        style={{
          color: colors.neutral.text,
          fontFamily: typography.fontFamily.sans,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        {name}
      </span>
      {onSignOut ? (
        <Button variant="ghost" size="sm" onClick={onSignOut}>
          Sair
        </Button>
      ) : null}
    </div>
  );
}
