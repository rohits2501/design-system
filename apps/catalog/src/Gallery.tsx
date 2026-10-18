import { Button, Field, IconButton, Stack, Surface, Text, type Status } from "@house/react";
import { colorVarName, type ColorRoles } from "@house/tokens";

const statuses: Status[] = ["success", "warning", "danger", "info"];
const roles = Object.keys(colorVarName) as Array<keyof ColorRoles>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack as="section" gap={3}>
      <Text as="h3" size="sm" weight="bold" tone="muted" className="catalog-eyebrow">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

/** Every primitive in every state. Rendered once per theme with no change to the components. */
export function Gallery() {
  return (
    <Stack gap={6}>
      <Section title="Button">
        <Stack direction="row" gap={2} wrap align="center">
          <Button variant="primary">Approve</Button>
          <Button>Default</Button>
          <Button variant="danger">Reject</Button>
          <Button aria-pressed="true">Pressed</Button>
          <Button disabled>Disabled</Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
        </Stack>
        <Stack direction="row" gap={2} align="center">
          <IconButton label="Previous page" icon="‹" />
          <IconButton label="Next page" icon="›" />
          <IconButton label="Close" icon="×" variant="danger" size="sm" />
        </Stack>
      </Section>

      <Section title="Text">
        <Text as="p" size="2xl" weight="bold">
          Invoice 2041
        </Text>
        <Text as="p" size="lg">
          Extracted fields are ready for review.
        </Text>
        <Text as="p" size="sm" tone="muted">
          Muted text for metadata and captions.
        </Text>
        <Text as="p" size="sm" tone="accent">
          Accent text for links.
        </Text>
        <Text as="p" size="sm" mono>
          job_01HX7Q
        </Text>
        <Stack gap={1}>
          {statuses.map((status) => (
            <Text key={status} size="sm" status={status}>
              {status} status reads without color
            </Text>
          ))}
        </Stack>
      </Section>

      <Section title="Surface">
        <Stack direction="row" gap={3} wrap>
          <Surface padding={3}>Card</Surface>
          <Surface padding={3} variant="subtle">
            Subtle
          </Surface>
          <Surface padding={3} raised>
            Raised
          </Surface>
        </Stack>
        {statuses.map((status) => (
          <Surface key={status} padding={3} status={status}>
            <Text size="sm">The {status} callout carries a glyph and a spoken prefix.</Text>
          </Surface>
        ))}
      </Section>

      <Section title="Field">
        <Field label="Vendor name" placeholder="Acme Supplies" hint="As printed on the invoice." />
        <Field label="Invoice total" defaultValue="12,40" error="Use a full stop for decimals." />
        <Field label="Locked field" defaultValue="Approved" disabled />
      </Section>

      <Section title="Color roles">
        <div className="catalog-swatches">
          {roles.map((role) => (
            <div key={role} className="catalog-swatch">
              <span
                className="catalog-swatch__chip"
                style={{ background: `var(${colorVarName[role]})` }}
              />
              <Text size="xs" mono>
                {colorVarName[role]}
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </Stack>
  );
}
