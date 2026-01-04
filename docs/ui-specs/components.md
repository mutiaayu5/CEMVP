# Component Specifications

## Component: TemplateCard

**Description**: Card component displaying template preview

**Props**:
```typescript
{
  template: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    category: string;
    toolStack: string[];
    complexity: "LOW" | "MEDIUM" | "HIGH";
    views: number;
    downloads: number;
    likes: number;
  };
  onClick?: () => void;
}
```

**Visual Elements**:
- Template title (truncated if long)
- Price badge (Free badge or $X.XX)
- Category badge
- Tool stack badges
- Complexity indicator
- Stats (views, downloads, likes)
- Cover image (if available)

**Interactions**:
- Click card → Navigate to template detail
- Hover → Show subtle shadow/elevation

---

## Component: SearchBar

**Description**: Search input with debouncing

**Props**:
```typescript
{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number; // Default: 300
}
```

**State**:
- `inputValue` (string): Current input value
- `debouncedValue` (string): Debounced value for search

**Behavior**:
- Debounces input by 300ms
- Calls onChange with debounced value
- Shows loading indicator while searching

---

## Component: FilterPanel

**Description**: Sidebar with filter options

**Props**:
```typescript
{
  filters: {
    category?: string;
    tool?: string;
    price?: "free" | "paid";
    complexity?: "LOW" | "MEDIUM" | "HIGH";
  };
  onChange: (filters: FilterState) => void;
}
```

**Filters**:
- Category (dropdown)
- Tool (dropdown)
- Price (radio: All, Free, Paid)
- Complexity (checkboxes: Low, Medium, High)

**State**:
- `selectedFilters` (FilterState): Current filter values

**Interactions**:
- Change filter → Updates filters, triggers search
- Clear filters → Resets all filters

---

## Component: TemplateGrid

**Description**: Responsive grid layout for templates

**Props**:
```typescript
{
  templates: Template[];
  loading?: boolean;
  emptyMessage?: string;
}
```

**Layout**:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**States**:
- Loading: Shows skeleton cards
- Empty: Shows empty state message
- Error: Shows error message

---

## Component: Pagination

**Description**: Page navigation controls

**Props**:
```typescript
{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Elements**:
- Previous button (disabled on page 1)
- Page numbers (current page highlighted)
- Next button (disabled on last page)
- Page info (e.g., "Page 1 of 10")

**Interactions**:
- Click page number → Navigate to page
- Click prev/next → Navigate to adjacent page

---

## Component: FileUpload

**Description**: File upload component with drag-and-drop

**Props**:
```typescript
{
  accept?: string;           // File types (e.g., ".json,.zip")
  maxSize?: number;          // Max size in bytes
  onFileSelect: (file: File) => void;
  error?: string | null;
}
```

**Features**:
- Drag and drop support
- Click to browse
- File type validation
- File size validation
- Preview selected file name
- Error display

**States**:
- Empty: Shows upload area
- Selected: Shows file name and remove button
- Error: Shows error message

---

## Component: Badge

**Description**: Status/type badge component

**Props**:
```typescript
{
  variant: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
}
```

**Variants**:
- `default`: Primary color
- `secondary`: Muted color
- `destructive`: Error/danger color
- `outline`: Outlined style

---

## Component: Button

**Description**: Button component with variants

**Props**:
```typescript
{
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**States**:
- Default: Normal state
- Hover: Elevated shadow
- Disabled: Reduced opacity, no interaction
- Loading: Shows spinner, disables interaction

---

## Component: SignInForm

**Description**: Beautiful login form with validation and modern design

**Props**:
```typescript
{
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}
```

**Features**:
- React Hook Form integration
- Zod schema validation
- Icon-enhanced inputs (Mail, Lock)
- Real-time validation feedback
- Loading states with spinner
- Error message display
- Gradient button styling
- Smooth animations

**Validation Rules**:
- Email: Valid email format required
- Password: Minimum 6 characters required

**Visual Elements**:
- Gradient background
- Card with backdrop blur
- Gradient logo badge
- Icon inputs with left padding
- Gradient submit button
- Animated error messages

**User Interactions**:
- Real-time field validation
- Submit button shows loading spinner
- Error messages animate in
- Smooth transitions on all interactions

