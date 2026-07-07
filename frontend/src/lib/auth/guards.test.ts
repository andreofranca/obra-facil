import assert from "node:assert/strict";
import test from "node:test";
import type { AuthSession } from "@/types/auth";
import { hasRole, requireAuth, requireRole } from "./guards";

const session: AuthSession = {
  userId: "user-1",
  clienteId: "client-1",
  profissionalId: null,
  name: "Cliente Teste",
  email: "cliente@example.com",
  role: "CLIENT",
};

test("requireAuth returns null for an authenticated session", () => {
  assert.equal(requireAuth(session), null);
});

test("requireAuth returns a response for a missing session", () => {
  const response = requireAuth(null);

  assert.ok(response);
  assert.equal(response.status, 401);
});

test("requireRole allows matching roles", () => {
  assert.equal(requireRole(session, "CLIENT"), null);
  assert.equal(hasRole(session, "CLIENT"), true);
});

test("requireRole denies a non-matching role", () => {
  const response = requireRole(session, "PROFESSIONAL");

  assert.ok(response);
  assert.equal(response.status, 403);
});
