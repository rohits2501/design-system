import { Button, Stack, Surface, Text } from "@house/react";

// The dark: utilities go away (themes switch through data-theme), and the second accent badge
// is dropped: "New" is not a status, and the system has one accent.
export function UploadNotice({ failed }: { failed: boolean }) {
  return (
    <Surface>
      <Stack gap={2}>
        <Text size="sm">Contract.pdf</Text>
        <Text size="xs" tone="muted">
          Uploaded 2 minutes ago
        </Text>
        {failed ? <Surface status="danger">Upload failed</Surface> : null}
        <Button variant="primary">Retry</Button>
      </Stack>
    </Surface>
  );
}
