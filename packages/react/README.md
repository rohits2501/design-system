# @house/react

React primitives on `@house/tokens`. Plain components: no framework import, no `use client`, no browser API at module scope.

```tsx
import "@house/tokens/theme.css";
import "@house/react/styles.css";
import { Button, Field, IconButton, Stack, Surface, Text } from "@house/react";
```

Status is never color alone: `Text status="danger"` and `Surface status="warning"` add a glyph and a visually hidden prefix such as "Error:".
