📚 Full Frontend User Flow: Learning App
Designed for a clean, immersive, no-sidebar experience — with collapsible animations, flexible layouts, and detailed study/practice capabilities.

🔐 1. Login
User logs in via a minimal login screen

Redirected to the Dashboard upon success

🏠 2. Main Dashboard (Visual & Interactive)
✅ Design Principles
No sidebars or top nav bars

Navigation is done using a Back button on each screen

Profile icon at top-right (click to reveal: Settings / Sign Out)

Large, animated action buttons with icon + label + hover effects

🧊 Layout Sections
🔷 A. Visual Summary Cards (Top Half)
Graphical widgets/cards showing:

📈 Progress in active stories (ring/bar graph)

📅 Last active session + Resume button

🧠 Top weak points that need review

✅ Checklist To-Do items (plain list, optional input)

🔶 B. Main Action Buttons (Bottom Half)
Three primary entry points — large, interactive, animated:

Action	Description
➕ Create	Starts the content selection process (subject → spoints)
📊 Stats	Opens a full analytics screen with graphs and filters
⏯️ Resume	Opens story/session browser with mini timeline and details

➕ 3. Create New Session
🔄 Hierarchical Selection Flow (Full-Screen UI)
A step-by-step content selector using collapsible animated rectangles:

Subjects – full screen

Lectures – after selecting a subject

Chapters

Paragraphs

Points

SPoints (atomic study units)

Each step works as follows:

Current level is displayed in a central animated rectangle

On selection:

Rectangle collapses and moves to the side

Next level appears in the center

User can either:

Select entire containers (checkbox)

Or drill down to select specific units

Persistent button at top: "Confirm this selection & move to next"

🔎 Features
Search bar at each level to quickly find topics

Right sidebar (20%) shows current selections:

Hierarchical view of what the user picked

Click any item to return to that level and edit

Remove selected items

Already chosen items are hidden from future selection

🧾 Final Step
After last selection:

Prompt user to either:

Create a new story:

Title (required)

Description (optional)

Or assign to an existing story (shown as a list with mini stats)

Then → Redirected to the Episode Page

🎬 4. Episode Page
🧭 Tab Bar (Top, Slim)
Tabs: Study | Practice | Mix

Text only, slim, hideable

Clicking switches between modes

📌 Right Sidebar (Always Visible, Hideable – 20%)
Displays point/spoint hierarchy for the session

Clicking a point loads its content

Practiced points are shown with a small 📍icon

No marker needed for studied/untouched items

Sidebar can be hidden

📘 Study Tab
Main Area (80%): Editor.js-style viewer

Rich-text content of selected point/spoint

Features:

Custom tags (free text)

Rich-text tools at bottom:

Bold, italics, highlight, color, font change, etc.

Add questions for that point directly from the editor

Bottom-right:

Pause session → leads to Summary page

End session → leads to Summary page

🧠 Practice Tab
Main Area (80%):

Question interface per point

Two solving modes:

Manual: User selects point from sidebar

Auto/Random Mode: App randomly picks next point

Quiz Options Toggle:

When active, right sidebar shows checkboxes per point

User selects which quiz formats to use (MCQ, Flashcard, Table, etc.)

Top Controls:

Choose answer reveal mode:

After each question

At the end

🔀 Mix Tab
Flexible Layout:

Left side: Editor

Right side: Questions + Hierarchy

User can resize sections

Clicking a point:

Loads its content in the editor

Shows its related quiz in the lower right area

Solving follows the same rules as Practice mode

📊 5. Stats Page
Fully graphical interface with charts & filters

Sort/organize:

By Story

By Session

Sections:

📈 Performance trends

🧠 Weakest and strongest points

✅ To-Do checklist (plain UI)

⏯️ 6. Resume Page
📘 Story List
Different view options (compact or detailed)

Each story shows:

Mini stats

Resume button

See More → opens story detail page

📅 Story Detail Page
Sessions shown in a mini timeline view

Each session includes:

Progress stats

Practice formats used

Score per point

Visual improvement chart

Actions:

View session

Resume (if in progress)

🧠 Session View
Dedicated page for each session

Show:

All included points

Mode used (Study / Practice / Mix)

Scores

Progress and changes

Print/export not needed for now

🧭 Navigation Rules
Back button only (no sidebar nav)

Profile icon at top-right:

Settings

Sign out

Every screen is focused and full-width, with sidebars used only as secondary panels