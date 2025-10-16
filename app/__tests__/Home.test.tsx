import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { beforeAll, expect, it, vi } from "vitest";
import { describe } from "node:test";

// On simule le comportement de fetch
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: "test" }),
    })
  ) as unknown as typeof fetch;
});

describe("Home page", () => {
  it("renders the main heading", async () => {
    render(<Home />);

    // Vérifie que le titre principal s’affiche
    const heading = screen.getByRole("heading", {
      name: /apprentissage de la lecture/i,
    });
    expect(heading).toBeInTheDocument();

    // Vérifie que l’état 'Chargement...' apparaît d’abord
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Attends que le bouton de dashboard apparaisse après fetch
    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /accéder à mon espace/i })
      ).toBeInTheDocument();
    });
  });
});
