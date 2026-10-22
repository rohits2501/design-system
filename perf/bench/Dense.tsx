import { Button, Field, Stack, Surface, Text } from "@house/react";

/** Forty copies of the controls, with no font files. */
export function Dense() {
  return (
    <Stack gap={2}>
      {Array.from({ length: 40 }, (_, index) => (
        <Surface key={index} padding={2}>
          <Text size="sm">Row {index}</Text>
          <Field label={`Field ${index}`} />
          <Button size="sm">Save {index}</Button>
        </Surface>
      ))}
    </Stack>
  );
}
