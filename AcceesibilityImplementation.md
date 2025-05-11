# Accessibility Implementation

We have followed the WCAG 2.1 AA accessibility guidelines to improve the user experience for people with disabilities. Our goal was to ensure compatibility with screen readers like NVDA and support keyboard navigation across all pages.

## 1. Semantic HTML and ARIA Roles:
- Used proper HTML5 tags such as `<main>`, `<nav>`, `<header>`, and `<footer>`.
- Assigned roles like `role="main"`, `role="navigation"`, `role="menubar"`, and `role="menuitem"` to define page structure.

## 2. Labels and Descriptions:
- Added `aria-label` and `aria-labelledby` to important sections and form controls.
- Used visible and hidden labels to help screen readers describe input fields and buttons.

## 3. Keyboard Navigation:
- Ensured that all interactive elements are reachable using the Tab key.
- Collapsible menus and links are accessible using the keyboard alone.

## 4. ARIA Attributes for Interactions:
- Applied `aria-expanded` and `aria-controls` for dropdowns and collapsible menus.
- Used `aria-label` for grouped navigation items.

## 5. Image Accessibility:
- Provided meaningful images with descriptive `alt` attributes so screen readers can describe them to visually impaired users.

## 6. Operable:
### Keyboard Navigation:
- Every interactive element (links, buttons, menus, forms) can be accessed and operated using the keyboard alone (e.g., using Tab, Enter, and Arrow keys).
### Focus Indicators:
- Clear focus outlines help users track where they are on the page when navigating with a keyboard.

## 7. Evaluation Tools Used:
For accessibility testing, we used **NVDA** (NonVisual Desktop Access) as the screen reader to evaluate how well our website supports users with visual impairments. NVDA helped us check if the content was being read aloud correctly and if all interactive elements were accessible.

Below is the URL to refer to our screen reader testing video:  
[Screen Reader Testing Video](https://kaltura.hamk.fi/media/web+framework+project+-+team+14/0_zzaelwqe)

Additionally, we used the **Siteimprove** browser extension to perform automated accessibility checks on our website. This tool helped identify potential issues like missing alt text, contrast problems, and form labeling errors, allowing us to address accessibility concerns efficiently.

## Team Member Contributions:
- **Yashodha Amarasinghe**: Developing and adding web accessibility improvements for the Activity Tracker related features and user registration and login.
- **Shammi Bellawala**: Developing and adding web accessibility improvements for the Expense Tracker related features and the expense dashboard.
