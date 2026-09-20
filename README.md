# UDSA Mini Project — E-Commerce Product Detail Page

**Student:** Guhan R  
**Register Number:** 23UCB015  
**Course:** Usability Design of Software Applications Laboratory (U23CBEP73)

This project redesigns an e-commerce product detail page with emphasis on the three areas in the assigned scope:

- product image gallery and enlarged view;
- clear, progressive specification display; and
- low-error variant selection and add-to-cart flow.

## Run locally

No installation or build step is required. Open `index.html` in a modern browser.

For a local web server, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Interaction checklist

1. Switch between four product gallery views and open the enlarged image.
2. Select a colour and change the quantity.
3. Enter a six-digit pincode to see delivery feedback.
4. Expand the complete specifications.
5. Add the configured product to the cart and review the confirmation drawer.
6. Test keyboard navigation, arrow-key gallery browsing, Escape to close dialogs, and responsive mobile layout.

## Design rationale

The redesign keeps decision-critical information close to the purchase action, uses progressive disclosure for technical detail, makes selected variants explicit, provides immediate form feedback, and confirms the exact colour, quantity and total before checkout.

The product image was generated specifically for this educational project and contains no third-party branding.
