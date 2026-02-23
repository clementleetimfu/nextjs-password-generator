# Dark Mode Visibility Fixes Plan

## Issue Summary
The password generator application has several dark mode visibility issues where text appears black and becomes invisible on dark backgrounds.

## Identified Issues

### 1. Button Text Visibility (CRITICAL)
**Location:** [`app/components/ui/button.tsx`](app/components/ui/button.tsx:17)

**Problem:** The `outline` button variant doesn't have an explicit text color class, causing button text to appear black in dark mode.

**Current Code:**
```tsx
outline:
  "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
```

**Fix:** Add explicit text color classes:
```tsx
outline:
  "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
```

### 2. Generated Content Text Visibility (CRITICAL)
**Location:** [`app/components/password-generator/password-display.tsx`](app/components/password-generator/password-display.tsx:56)

**Problem:** The password/PIN/passphrase display text has no explicit text color class, making it black and invisible in dark mode.

**Current Code:**
```tsx
<p className="text-3xl md:text-4xl font-mono break-all leading-relaxed">
  {value}
</p>
```

**Fix:** Add explicit text color class:
```tsx
<p className="text-3xl md:text-4xl font-mono break-all leading-relaxed text-foreground">
  {value}
</p>
```

### 3. Main Page Background Inconsistency (MEDIUM)
**Location:** [`app/page.tsx`](app/page.tsx:49)

**Problem:** The main container uses `dark:bg-black` which overrides the CSS variable `--background` defined in globals.css for dark mode (`oklch(0.145 0 0)`). This creates inconsistency with other components.

**Current Code:**
```tsx
<div className="min-h-screen bg-background dark:bg-black font-sans">
```

**Fix:** Remove the override and use CSS variable:
```tsx
<div className="min-h-screen bg-background font-sans">
```

### 4. Password Display Background (MEDIUM)
**Location:** [`app/components/password-generator/password-display.tsx`](app/components/password-generator/password-display.tsx:55)

**Problem:** The password display box uses `dark:bg-zinc-900` which is slightly different from the CSS variable background, creating visual inconsistency.

**Current Code:**
```tsx
<div className="bg-background dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-6 text-center">
```

**Fix:** Use CSS variable for consistency:
```tsx
<div className="bg-card border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-6 text-center">
```

## Implementation Strategy

### Phase 1: Critical Fixes (High Priority)
1. Fix button text visibility in [`button.tsx`](app/components/ui/button.tsx:17)
2. Fix generated content text visibility in [`password-display.tsx`](app/components/password-generator/password-display.tsx:56)

### Phase 2: Consistency Improvements (Medium Priority)
3. Fix main page background in [`page.tsx`](app/page.tsx:49)
4. Fix password display background in [`password-display.tsx`](app/components/password-generator/password-display.tsx:55)

### Phase 3: Verification (High Priority)
5. Test all components in light mode
6. Test all components in dark mode
7. Verify text contrast ratios meet accessibility standards

## Testing Checklist

After implementing fixes, verify:

- [ ] All button text is visible in dark mode
- [ ] Generated password/PIN/passphrase text is visible in dark mode
- [ ] Control labels (Length, Character Types, etc.) are visible in dark mode
- [ ] Tab labels are visible in dark mode
- [ ] Strength indicator text is visible in dark mode
- [ ] Breach check status text is visible in dark mode
- [ ] Theme toggle icon is visible in both modes
- [ ] No visual inconsistencies between light and dark modes
- [ ] All components maintain proper contrast ratios (WCAG AA minimum)

## Files to Modify

1. [`app/components/ui/button.tsx`](app/components/ui/button.tsx) - Add text color to outline variant
2. [`app/components/password-generator/password-display.tsx`](app/components/password-generator/password-display.tsx) - Add text color to generated content
3. [`app/page.tsx`](app/page.tsx) - Remove dark:bg-black override
4. [`app/components/password-generator/password-display.tsx`](app/components/password-generator/password-display.tsx) - Use bg-card instead of dark:bg-zinc-900

## CSS Variable Reference

The application uses these CSS variables for theming (defined in [`app/globals.css`](app/globals.css:85-117)):

**Light Mode:**
- `--background: #fdfdf7`
- `--foreground: oklch(0.145 0 0)` (dark)
- `--card: #fdfdf7`
- `--card-foreground: oklch(0.145 0 0)`

**Dark Mode:**
- `--background: oklch(0.145 0 0)` (very dark)
- `--foreground: oklch(0.985 0 0)` (light)
- `--card: oklch(0.205 0 0)` (dark gray)
- `--card-foreground: oklch(0.985 0 0)` (light)

These variables should be used via Tailwind's `text-foreground`, `bg-background`, `bg-card`, etc. classes for proper theming.
