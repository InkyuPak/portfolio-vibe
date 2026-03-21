import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectBlockRenderer } from "@/components/site/project-block-renderer";

describe("ProjectBlockRenderer", () => {
  it("renders a metrics block", () => {
    render(
      <ProjectBlockRenderer
        section={{
          type: "METRICS",
          title: "Impact",
          sortOrder: 1,
          payload: {
            items: [
              {
                label: "Latency",
                value: "-80%",
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText("Impact")).toBeInTheDocument();
    expect(screen.getByText("Latency")).toBeInTheDocument();
    expect(screen.getByText("-80%")).toBeInTheDocument();
  });

  it("renders markdown content", () => {
    render(
      <ProjectBlockRenderer
        section={{
          type: "MARKDOWN",
          title: "Design Notes",
          sortOrder: 2,
          payload: {
            markdown: "- explicit retries\n- isolated stages",
          },
        }}
      />,
    );

    expect(screen.getByText("Design Notes")).toBeInTheDocument();
    expect(screen.getByText("explicit retries")).toBeInTheDocument();
    expect(screen.getByText("isolated stages")).toBeInTheDocument();
  });
});
