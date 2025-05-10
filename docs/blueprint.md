# **App Name**: Outbreak Sentinel

## Core Features:

- Mobile Reporting Simulation: Simulate HEW (Health Extension Worker) mobile view with offline data collection capabilities for reporting symptoms and suspected outbreak cases. Uses a simple form interface with GPS location tagging. Store the entries on the local browser.
- Web Dashboard Simulation: Simulate Woreda Health Officer web dashboard view with an interactive map to visualize reports, filter by region/disease/date, and generate summary reports, based on local data only. No real map is implemented
- Simulated Authentication: Simulate user authentication with role-based access for HEWs and Officers, using a simplified login process without connecting to a database. Uses local browser data to mock users and roles.
- Outbreak Alerts (simulated): Show simulated outbreak alerts and health instructions to HEWs based on simple, pre-defined conditions.
- AI-Powered Daily Report: Generate a daily summary report based on recent incoming local data and format the output in a human-readable format using generative AI. Use an LLM to reason on how best to display information, given limited screen real estate. LLM should act as a tool, to ensure proper use of its abilities

## Style Guidelines:

- Primary color: Deep teal (#008080) to evoke a sense of trust and health.
- Secondary color: Light green (#90EE90) to create a sense of well-being and growth.
- Accent: A muted red (#CD5C5C) will highlight critical alerts and warnings
- Clean, minimalist design focusing on usability. Use clear visual hierarchy to prioritize critical information. Ensure high contrast for readability.
- Use a set of consistent, easily recognizable icons from a library like FontAwesome or Material Icons to represent different data types and actions.
- Subtle transitions and animations (e.g., loading indicators, alert animations) to enhance user experience without being distracting.