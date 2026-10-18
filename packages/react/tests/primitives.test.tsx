import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";
import { Button, Field, IconButton, Stack, Surface, Text } from "../src/index.ts";

const html = (node: React.ReactElement) => renderToStaticMarkup(node);

describe("Button", () => {
  test("defaults to a type=button default variant", () => {
    expect(html(<Button>Save</Button>)).toBe(
      '<button type="button" class="h-button h-button--default h-button--md">Save</button>',
    );
  });

  test.each(["primary", "danger"] as const)("%s variant adds its class", (variant) => {
    expect(html(<Button variant={variant}>Go</Button>)).toContain(`h-button--${variant}`);
  });

  test("passes through className, disabled, aria-pressed, and type", () => {
    const out = html(
      <Button className="extra" disabled aria-pressed="true" type="submit">
        Go
      </Button>,
    );
    expect(out).toContain('class="h-button h-button--default h-button--md extra"');
    expect(out).toContain('type="submit"');
    expect(out).toContain("disabled");
    expect(out).toContain('aria-pressed="true"');
  });

  test("forwards its ref type", () => {
    const ref = createRef<HTMLButtonElement>();
    expect(html(<Button ref={ref}>Go</Button>)).toContain("<button");
  });
});

describe("IconButton", () => {
  test("always has an accessible name and hides the glyph", () => {
    const out = html(<IconButton label="Close" icon="×" />);
    expect(out).toContain('aria-label="Close"');
    expect(out).toContain('title="Close"');
    expect(out).toContain('<span class="h-icon" aria-hidden="true">×</span>');
  });
});

describe("Text", () => {
  test("renders the requested element, size, tone, and weight", () => {
    expect(
      html(
        <Text as="h2" size="xl" tone="muted" weight="bold">
          Hi
        </Text>,
      ),
    ).toBe('<h2 class="h-text h-text--xl h-text--muted h-text--bold">Hi</h2>');
  });

  test.each([
    ["danger", "Error"],
    ["warning", "Warning"],
    ["success", "Success"],
    ["info", "Info"],
  ] as const)("%s status carries a glyph and a spoken prefix, not only color", (status, spoken) => {
    const out = html(<Text status={status}>Upload failed</Text>);
    expect(out).toContain(`h-text--${status}`);
    expect(out).toContain('class="h-status-glyph" aria-hidden="true"');
    expect(out).toContain(`<span class="h-visually-hidden">${spoken}: </span>Upload failed`);
  });
});

describe("Stack", () => {
  test("maps direction, gap, align, justify, and wrap to token classes", () => {
    expect(
      html(
        <Stack direction="row" gap={2} align="center" justify="between" wrap>
          a
        </Stack>,
      ),
    ).toBe(
      '<div class="h-stack h-stack--row h-gap-2 h-align-center h-justify-between h-stack--wrap">a</div>',
    );
  });
});

describe("Surface", () => {
  test("defaults to a padded card", () => {
    expect(html(<Surface>x</Surface>)).toBe(
      '<div class="h-surface h-surface--default h-pad-4">x</div>',
    );
  });

  test("a status surface reads without color", () => {
    const out = html(<Surface status="warning">Low confidence</Surface>);
    expect(out).toContain("h-surface--warning");
    expect(out).toContain('class="h-status-glyph" aria-hidden="true"');
    expect(out).toContain("Warning: </span>Low confidence");
  });
});

describe("Field", () => {
  test("links the label, hint, and error to the input", () => {
    const out = html(<Field id="email" label="Email" hint="Work address" error="Required" />);
    expect(out).toContain(
      '<label class="h-text h-text--sm h-text--default h-text--medium h-field__label" for="email">',
    );
    expect(out).toContain('id="email"');
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('aria-describedby="email-hint email-error"');
    expect(out).toContain('id="email-hint"');
    expect(out).toContain('id="email-error"');
    expect(out).toContain("Error: </span>Required");
  });

  test("generates an id when none is given and omits describedby without help text", () => {
    const out = html(<Field label="Name" />);
    const id = /<input id="([^"]+)"/.exec(out)?.[1];
    expect(id).toBeTruthy();
    expect(out).toContain(`for="${id}"`);
    expect(out).not.toContain("aria-describedby");
    expect(out).not.toContain("aria-invalid");
  });
});
