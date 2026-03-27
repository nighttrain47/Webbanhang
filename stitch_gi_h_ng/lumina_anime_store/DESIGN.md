# Design System Document

## 1. Overview & Creative North Star: "The Digital Curator"
This design system moves away from the cluttered, "discount-bin" aesthetic common in anime retail. Instead, it adopts the **Digital Curator** persona—a high-end, editorial approach where products are treated as art pieces. 

The "Digital Curator" breaks the traditional grid through **intentional asymmetry** and **breathable white space**. By leveraging a sophisticated palette of neutrals punctuated by vibrant cyan and orange accents, we create a stage that highlights the intricate details of the merchandise. We avoid rigid boxes and heavy borders, opting for a "layered glass" aesthetic that feels modern, premium, and deeply intentional.

---

### 2. Colors: Tonal Depth & "No-Line" Philosophy
Our color strategy relies on **Surface Tiering** rather than structural lines.

#### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** To separate a product description from a review section, do not draw a line. Instead, shift the background color. Use a `surface-container-low` (`#f1f4f6`) section sitting atop a `surface` (`#f7fafc`) background to define boundaries.

#### Palette Roles
- **Primary (`#00658d`):** Professional trust. Used for core navigation and stable UI elements.
- **Primary-Container (`#00adef`):** The "Cyan Spark." Use this for high-energy accents and hero call-to-outs.
- **Tertiary-Container (`#ff7d36`):** The "Orange Flame." Reserved for urgency (Limited Edition, "Sắp hết hàng") and primary CTAs.
- **Surface Hierarchy:** 
    - `surface-container-lowest` (`#ffffff`): Use for elevated product cards to make them "pop" against the background.
    - `surface-container-highest` (`#e0e3e5`): Use for footer backgrounds or utility bars.

#### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" look, floating elements (like the navigation bar or quick-buy overlays) must use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` of 12px-20px. 
**Signature Texture:** Main CTAs should use a subtle linear gradient from `primary` to `primary-container` at a 135-degree angle to add "visual soul."

---

### 3. Typography: Editorial Authority
We pair **Plus Jakarta Sans** (Display/Headlines) with **Inter** (Body/Labels) to balance character with readability.

- **Display-LG (Plus Jakarta Sans, 3.5rem):** Used for "Hero" announcements. (e.g., "Sản phẩm mới nhất").
- **Headline-MD (Plus Jakarta Sans, 1.75rem):** Used for category titles. These should often be placed with asymmetrical padding to create an editorial feel.
- **Title-MD (Inter, 1.125rem):** Used for product names. Bold and clear.
- **Body-MD (Inter, 0.875rem):** All descriptive text. Maintain a high line-height (1.6) for readability.
- **Label-SM (Inter, 0.6875rem):** Metadata like "Tỷ lệ: 1/7" or "Hãng SX: Good Smile Company."

**Vietnamese Localization Note:** Ensure line heights are generous for `display` levels to accommodate Vietnamese diacritics without clipping.

---

### 4. Elevation & Depth: The Layering Principle
Depth is achieved through **Tonal Layering**, not shadows.

- **Stacking:** Place a `surface-container-lowest` (pure white) card on a `surface-container-low` section. The contrast alone provides the "lift."
- **Ambient Shadows:** When a product "floats" (e.g., a modal or hovering card), use a shadow with a 40px blur and 6% opacity. The shadow color should be a tinted version of `on-surface` (`#181c1e`), never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` (`#bdc8d1`) at **20% opacity**. 100% opaque borders are strictly forbidden.

---

### 5. Components

#### Product Cards
- **Structure:** No border. Background: `surface-container-lowest`. 
- **Interaction:** On hover, the card should transition to `surface-container-low` with a subtle scale-up (1.02x).
- **Labeling:** Use `label-md` for "Pre-order" tags in `tertiary_container`.

#### Navigation Bar
- **Styling:** `surface` color at 80% opacity with `backdrop-blur`.
- **Items:** Use `title-sm` (Vietnamese: "Trang chủ", "Sản phẩm", "Tin tức").
- **CTA:** The "Giỏ hàng" (Cart) button should use the "Signature Texture" gradient.

#### Buttons
- **Primary (Nổi bật):** Gradient from `primary` to `primary-container`. `Roundedness: md` (0.75rem). Text: `on-primary`.
- **Secondary (Phụ):** No background. `Ghost Border` (20% opacity `outline`). Text: `primary`.
- **Action (Mua ngay):** `tertiary-container` (`#ff7d36`). This bold orange creates immediate visual hierarchy for conversion.

#### Input Fields
- **State:** Default background is `surface-container-highest`.
- **Focus:** No heavy outline. Transition the background to `surface-container-lowest` and add a 1px `primary` ghost border.

#### Specialized Component: "The Scale Badge"
For anime figures, create a specific chip using `secondary-container`. (e.g., "Scale 1/7"). Use `label-sm` and `rounded-full`.

---

### 6. Do's and Don'ts

**Do:**
- Use **Vertical White Space** (Spacing 12 or 16) to separate major sections instead of divider lines.
- Use **Vietnamese Title Case** for buttons (e.g., "Thêm Vào Giỏ" rather than "THÊM VÀO GIỎ").
- Overlap product images slightly over container edges to create a "3D" editorial effect.

**Don't:**
- **Don't** use 100% opaque, 1px borders. This is the fastest way to make the design look "cheap."
- **Don't** use standard drop shadows. Always use diffused, low-opacity ambient shadows.
- **Don't** crowd the product images. Each figure is a "work of art"—give it breathing room (Spacing 8 or more).
- **Don't** use pure black for text. Use `on-surface` (`#181c1e`) for a softer, more professional contrast.