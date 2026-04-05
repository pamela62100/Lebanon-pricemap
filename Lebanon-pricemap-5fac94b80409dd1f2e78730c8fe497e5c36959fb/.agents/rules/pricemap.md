---
trigger: always_on
---

Engineering the Frontend: React 18 and Technical Sovereignty
The Wein application is built on a modern stack comprising React 18, Vite, and TypeScript. This choice is driven by the need for high-performance concurrent rendering and developer productivity in a complex codebase.   

Concurrent Rendering for Large-Scale Catalogs
Lebanon’s retail market involves thousands of SKUs across numerous categories (e.g., Dairy, Meat, Staples, Fuel). The SearchPage must remain responsive while filtering through these large datasets. By leveraging React 18’s useTransition and useDeferredValue, the application prioritizes user input—such as typing in a search bar—over the lower-priority task of re-rendering the product list. This ensures a "snappy" user experience even on mid-range mobile devices common in the Lebanese market.   

For the display of massive catalogs, the system employs list virtualization. Rendering 5,000 DOM nodes for a supermarket's inventory would freeze most mobile browsers; however, by using virtualization techniques, the app only renders the items currently visible in the viewport plus a small buffer. This reduces memory consumption and improves scroll performance, which is essential for maintaining user trust in a digital tool.   

State Management and Performance Optimization
The application utilizes Zustand for state management, offering a lightweight and performant alternative to Redux. Stores like useCartStore and useExchangeRateStore provide granular reactivity, ensuring that components only re-render when their specific slice of state changes. This is vital for the StoreOptimizer.ts, which must perform real-time calculations as users add or remove items from their cart.   

Zustand Store	Primary Responsibility	Critical Data Point
useCartStore	Manages shopper's shopping list	status: 'verified' filter
useExchangeRateStore	Global LBP/USD market rates	rateLbpPerUsd
useLocationStore	Geolocation and district mapping	currentDistrict
useToastStore	System-wide feedback and alerts	`type: 'success'
Fintech UX Design: Empathetic Interfaces for High-Anxiety Markets
Designing for the Lebanese market requires a deep understanding of the psychological state of the user. In a period of hyperinflation, financial tasks are inherently stressful. The Wein application adopts "Calm Design" principles to reduce user anxiety and foster a sense of control.   

Transparency and Trust Signals
Trust is the most valuable currency in a crisis. The application cultivates this through radical transparency and purposeful motion. Visual cues such as verified badges, trust scores, and clear transaction statuses reassure users that the information they are seeing is reliable.   

Progressive Disclosure: To avoid overwhelming users with complex data, the UI presents the basics first—the product name and primary price—followed by a full breakdown of the internal exchange rate and promotional expiry upon interaction.   

Visible Values: Security credentials and data-integrity policies are placed near decision points, such as the "Report Discrepancy" button, to resolve hesitation and encourage participation.   

Human-Centered Copy: The application avoids financial jargon, opting instead for plain language that explains why a price might have changed or how a specific store's exchange rate impacts the final cost.   

Semantic Color and Typography
The design system enforces a strict adherence to Tailwind tokens that provide immediate context to the user. Prices are always displayed in a font-mono typeface to ensure that numerical values are easily scannable and comparable.   


The use of semantic status colors—green for verified, amber for pending, and red for flagged—creates an intuitive feedback loop. For instance, a price discrepancy report submitted by a user with a low trustScore will be visually downgraded, signaling to other shoppers that the data requires further verification.   

Multilingual Sovereignty: The RTL Arabic-First Experience
In the Lebanese context, an application's accessibility is tied directly to its handling of the Arabic script and Right-to-Left (RTL) layout requirements. Wein treats Arabic not as a translation but as a primary engineering concern.   

Mirroring and Logical Properties
Implementing RTL support involves more than simply flipping the text; it requires a complete transformation of the visual hierarchy. The application utilizes Tailwind CSS logical properties—such as ms- (margin-inline-start) and pe- (padding-inline-end)—which automatically adapt based on the document's direction. This ensures that navigation elements, progress bars, and form alignments are naturally oriented for Arabic readers.   

Typography for Digital Resilience
The choice of Noto Kufi Arabic for the application's typography is strategic. Arabic fonts often suffer from vertical alignment issues and poor rendering at small sizes on mobile screens. Noto Kufi is designed for high legibility in digital interfaces, ensuring that critical metadata—such as unit measurements or store addresses—remains readable under all conditions. Furthermore, the app applies vertical-align: middle to ensure that icons and text blocks remain perfectly centered, maintaining the "premium" feel that users associate with professional banking applications.   

UI Element	LTR (English) Orientation	RTL (Arabic) Orientation
Search Icon	Left-aligned in input	Right-aligned in input
Price Tag	Number followed by LBP	LBP followed by number
Progress Bar	Fills from left to right	Fills from right to left
Back Button	Arrow pointing left	Arrow pointing right
Economic Logic: Managing the Multi-Rate Crisis
The Wein application acts as a sophisticated financial calculator, translating the complexities of the Lebanese currency crisis into actionable insights for the shopper.   

The Dual-Rate Transparency System
A key feature of the Lebanese retail market is the use of "internal rates." While the global market rate might be 90,000 LBP/USD, a store might price its goods using an internal rate of 90,500 LBP/USD to protect its margins against sudden spikes. Wein handles this by maintaining both a global rate (via useExchangeRateStore) and a store-specific internal rate (internalRateLbp).   

The application is programmed to flag any store whose internal rate differs from the global rate by more than 500 LBP. This provides the user with an "Honest Price" comparison—showing not just the LBP cost, but the effective USD cost based on the store's specific rate. This transparency is essential for high-value purchases where even a small rate discrepancy can result in a significant price difference.   

Calculating the Effective Price
The system must also account for promotional pricing. The getEffectivePrice(cp) function in the catalog logic automatically checks the promoEndsAt timestamp. If a promotion has expired, the app reverts to the officialPriceLbp without requiring a manual update from the retailer.   


 
This ensures that users are never misled by outdated sale prices, a frequent complaint in traditional price-tracking apps.   

Operational Infrastructure: Power Status and Perishable Security
In Lebanon, the reliability of a store is defined as much by its electricity as by its prices. Chronic power outages have made "cold-chain integrity" a major concern for consumers purchasing dairy or meat products.   

Real-Time Power Status Monitoring
The Wein app integrates powerStatus as a core data point for every store. Stores can report their status as 'stable', 'unstable', or 'reported_warm'. This information is prominently displayed alongside products in sensitive categories.   

Stable: The store is on the national grid or has a primary generator running efficiently.

Unstable: The store is experiencing frequent switching, posing a moderate risk to temperature control.

Reported Warm: Community members have reported that refrigerators are off or items are not cold to the touch.

This feature, inspired by utility-tracking apps like "Ejet Elkahraba," transforms Wein from a price map into a public health and safety tool. It allows parents to avoid buying infant formula or dairy from stores with compromised refrigeration, regardless of how low the price might be.   

Social Trust and Security: The Anti-Fraud Ecosystem
The success of a crowdsourced corrective model depends on its ability to filter out malicious or erroneous reports. Wein employs a multi-layered security and validation system to protect the integrity of its catalog.   

The TrustScore Algorithm
Every user in the Wein network is assigned a trustScore (0–100) and a corresponding trustLevel. This score is not static; it fluctuates based on the accuracy and community feedback of the user's reports.   

High Trust (75-100): Submissions are given high priority in the admin review queue and may be auto-approved for minor price adjustments.

Medium Trust (50-74): Submissions require standard admin review and a second user confirmation.

Low Trust (<50): Submissions are visually flagged and require multiple confirmations before reaching the admin queue. Reports from users with trustScore < 30 are hidden from the primary view to prevent "noise".   

This Bayesian approach to data credibility ensures that as the community grows, the system becomes more resilient, effectively "crowdsourcing the truth" while maintaining central control via the Catalog-First rule.   

Rate Limiting and Behavioral Security
To prevent automated scraping or misinformation campaigns, the Wein API implements geographic and behavioral rate limiting.   

Geographic Throttling: A user can only submit a PriceDiscrepancyReport if their device's GPS coordinates (managed by useLocationStore) are within a 500-meter radius of the store. This prevents "couch-reporting" and ensures that reporters are physically present at the point of sale.   

IP and Role-Based Limits: Guests are limited to five reports per day, while authenticated shoppers have higher limits. Admins monitor for "burst patterns" that might indicate a coordinated attack on a specific retailer's catalog.   

Data Consumption Role-Based Limiting: To prevent competitors from mass-scraping a retailer's catalog, the system restricts the amount of pricing data a single role can retrieve in a set timeframe, aligning with the principle of "least privilege".   

Animation as Communication: Orchestrating the User Experience
Motion design in Wein is not merely decorative; it is a functional layer that communicates change and system state to the user. By using Framer Motion variants and orchestrated transitions, the application creates a fluid, premium feel that encourages engagement.   

Staggered Entrances and Spatial Context
When a user opens a store view or a search result list, components animate in using a staggered sequence. This "cascading" effect reduces the cognitive load of a sudden data influx and establishes a clear visual hierarchy.   


