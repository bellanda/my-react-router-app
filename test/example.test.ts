import { describe, expect, it } from "bun:test";

describe("Exemplo de teste", () => {
  it("deve funcionar corretamente", () => {
    expect(1 + 1).toBe(2);
  });

  it("verificação básica do ambiente", () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });
});
