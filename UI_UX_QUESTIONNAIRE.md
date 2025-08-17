# 🎨 FURBIO V3 - Complete UI/UX Design Questionnaire

## 📋 Overview Questions

### Visual Identity & Theme
1. **Color Scheme Preference:**
   - Should the app have a light theme, dark theme, or both with toggle? i would love for it to have both with a toggle at the top nav bar 
   - Do you prefer vibrant colors (like current blue/green gradients) or more muted/professional tones? Lets give it more professional look
   - Should different subjects have different color codes consistently throughout the app? Yes 

2. **Typography & Readability:**
   - What font size range do you prefer for study content? (Small/Medium/Large options?) lets use small to medium fonts 
   - Should there be a dyslexia-friendly font option? not currently 
   - Do you want serif fonts for reading content and sans-serif for UI, or all sans-serif? any will do 

3. **Overall Aesthetic:**
   - Modern minimalist (lots of white space, simple icons)? I would take modern for now 
   - Information-dense (maximize content on screen)? Nope, i would prefere clean and only needed information
   - Playful/gamified (animations, rewards, progress bars)? As many as they fit in the right place 
   - Professional/academic (formal, structured)? structured 

---

## 🏠 Page-by-Page Design Questions

### 1️⃣ **LOGIN PAGE**

**Layout Questions:**
- Should the login form be:
  - Centered single card? nah
  - Split screen (left: branding/graphics, right: form)? nah
  - Full-screen background with floating form? cool 
  
**Visual Elements:**
- Do you want an illustration/graphic on the login page? What theme? Lets try something woody and vague 
  - Abstract patterns? yep
  - Education-related illustrations? nope
  - Medical/scientific imagery? Nah
  - Just logo and clean design? maybe with some pattern and animation

**Form Behavior:**
- Should the password field have a show/hide toggle? Yes
- Do you want inline validation (red/green borders as user types)? Yes
- Should there be a "Remember me" checkbox? Yep
- Loading state: Full-screen overlay or button spinner? Full screen

**Branding:**
- Where should the FURBIO logo appear? How large? In clean way in the right places 
- Tagline under logo? What should it say? Nope
- Version number displayed (v3.0)? Nope

---

### 2️⃣ **DASHBOARD PAGE**

**Layout Structure:**
- Current design has 4 cards top, 3 buttons bottom. Is this the right balance? Yeah but they do look very bad though with the designs, and they way there is no animation inside them 
- Should cards be:
  - Equal sized grid (2x2)? No need for equeal and maybe the hover effect downsized the other cards and upgrades the one hovering around
  - Different sizes based on importance? Yep
  - Horizontally scrollable if more than 4? Nope

**Progress Card Design:**
- How should progress be visualized? 
  - Circular progress ring? Yes
  - Linear progress bar? For others yes
  - Percentage number only? Nope 
  - Mini chart showing trend? Acceptable 
- Time frame for progress: Daily/Weekly/Monthly/All-time? Tabs that let you choose 
- Should it show progress per subject or overall? Tabs that lets you choose 

**Last Session Card:**
- What info is most important to show?
  - Time ago (2 hours ago)?needed
  - Duration (45 minutes)?yes
  - Score/Performance (85%)?yes
  - Topic name?Yes
  - Continue button prominence? yes

**Weak Points Card:**
- How many weak points to display? (Top 3? Top 5?) 5
- Should each show:
  - Difficulty indicator (red/yellow/orange)? yse
  - Last practice date?yse
  - Number of failures?yes
  - Quick practice button? No
- Visual: List view or tag cloud or heat map? Would be great

**To-Do Card:**
- What creates a to-do item?
  - System recommendations? Possible
  - Self-set goals? Yes
  - Scheduled reviews? Yes
- Should items show:
  - Due date/time? Yes
  - Priority level?Yes
  - Estimated duration? Yes
  - Subject/topic tag? Yes

**Action Buttons (Create/Stats/Resume):**
- Current: Large buttons with gradient backgrounds. Preferences:
  - Keep large and prominent? Yes
  - Add icons to each? More like animated icon to each that make animation
  - Hover effects: Scale up? Shadow? Color change? Scale up 
- Should there be a 4th button? For what? Not now 

**Quick Actions:**
- Should there be a floating action button (FAB) for quick session start? Nah
- Quick stats visible without clicking Stats? (streak counter, points earned today)? Sure 

---

### 3️⃣ **CREATE SESSION PAGE** 

**Hierarchical Selection Visual:**

**Card Appearance:**
- Current: Vertical rectangles (200x400px). Is this the right size? So for the size you can make then adptive, always to make sure they are covering the space of the screen 
- Should cards show:
  - Preview of content inside? Yes
  - Number of sub-items?Yes
  - Difficulty indicator? Nope
  - Estimated study time?Nope
  - Thumbnail image/icon? I would love that 

**Selection Feedback:**
- When hovering over a card:
  - Slight scale up? Yes
  - Shadow deepens?Yes
  - Border highlights? yes
  - Preview tooltip?Nope
- When card is selected:
  - Check animation?yes
  - Color change?yes
  - Bounce effect?yes

**Collapse Animation:**
- Current: Selected items shrink and slide left. Preferences:
  - Speed of animation? (Fast 200ms, Medium 500ms, Slow 800ms?) medium
  - Should non-selected items fade out or slide away? yes
  - Should selected item show a mini preview in the collapsed bar? Sure
- Collapsed bar design:
  - Show abbreviated name or full name vertically? Full name
  - Show count badge?yes
  - Different color for each level? yes
  - Hover to peek at full name? already showing full name 

**Navigation Between Levels:**
- Should there be breadcrumbs at top? (Subject > Lecture > Chapter) Yes 
- Back button behavior:
  - Go back one level?
  - Go back to specific level when clicking breadcrumb? Go back to specific level
- Skip options:
  - Can user jump directly to SPoints? yes but how would he do that if we are not showing spoints
  - Quick filters (show only cardiology, show only hard topics)? maybe a search box but no need for filters now 

**Search/Filter Bar:**
- Position: Top of cards? Floating? Sidebar? Yes
- Filter options: 
  - By difficulty? Yes
  - By last studied date? Yes
  - By performance?Yes
  - By content type? Nope
- Search behavior:
  - Instant filter as user types? Yes
  - Highlight matching text? Yep
  - Show path to matched item? Yep

**Batch Selection Features:**
- "Select All" button - where positioned? No need for select all but check all that turn all the checkboxes on the rectagles to true 
- Checkbox on each card - where exactly? Size? Top righ tf the rectangle 
- Multi-select mode:
  - Click to select multiple? Yes by clicking on the chekcbox 
  - Drag to select region? Nope
  - Shift+click for range? Nope

**Selected Items Panel (Right Sidebar):**
- How to display selected items:
  - Flat list? 
  - Grouped by parent? 
  - Tree structure? Yes
- For each selected item show:
  - Full path? Yes
  - Remove button? Yes
  - Estimated time?nope
  - Reorder capability?nope
- Panel behavior:
  - Always visible? On this screen yes always visible 
  - Slide in/out?Nope
  - Overlay or push content? pushes content 

**Final Story Creation:**
- After selecting items, how to proceed:
  - Modal dialog for story details? after selecting all in the rightside bar there should be a button called start and when pressed it opens a modal that has two big boxes the first one to the left has written
  Create a new story and the other called connect to already created story. pressing on the first show an ask for A name for the story pressing on the second show a list of the already established stories  
  - New page for configuration? modal
  - Inline form at bottom? nah
- Story configuration options:
  - Name field - required or auto-generate? required
  - Description - text area size? samll
  - Study mode selection here or later? No study mode selection anymore
  - Time limit setting? nope
  - Difficulty preference? Nope
  - Schedule for later option? Nope

---

### 4️⃣ **EPISODE PAGE (Study/Practice/Mix)**

**Tab Design:**
- Current: Three tabs (Study | Practice | Mix) Yeah each tab has its own layout 
- Visual style:
  - Underline indicator? Yes
  - Background pill? Nope
  - Color change? Yes
- Should inactive tabs be:
  - Grayed out? Yes
  - Normal but not highlighted?
  - Show preview of content?

**STUDY MODE Layout:**

**Content Display:**
- Text size controls: Where positioned? (Top bar? Floating? Settings menu?) Down toolbar
- Reading width:
  - Full width? Yep
  - Optimal reading width (65-80 chars)? Ok
  - User adjustable? Yes
- Content spacing:
  - Line height (1.5x? 2x?)? 2x
  - Paragraph spacing? yes
  - Section dividers style? yep

**Rich Text Features:**
- Highlighting text:
  - Multiple colors? Yes
  - Automatic key points highlight? no
  - User highlights saved? yes
- Note-taking:
  - Inline comments? Yes
  - Sidebar notes? ys
  - Popup annotations?yes
- Text-to-speech:
  - Floating play button? Nope
  - Speed controls where?N[pe]
  - Voice selection?nope

**Bottom Toolbar Design:**
- Which tools are essential:
  - Highlight? yes
  - Note?yes
  - Bookmarkyes?
  - Share?yes
  - Print?yes
  - Translate?yes
- Toolbar behavior:
  - Always visible?
  - Auto-hide when scrolling?yes
  - Floating or fixed?

**Progress Indicators:**
- Reading progress:
  - Top bar progress line?
  - Percentage in corner?yes
  - Pages (1 of 10)?
- Time tracking:
  - Show time spent?yes
  - Estimated time remaining?

For the rightside bar that takes 20% of the screen :
 it show a nested tree view of the spoints selected by the user for this session and it has a button to show it and hide it pay alot of attention to it 

|**PRACTICE MODE Layout:**

**Quiz Display:**
- Question card design:
  - Full screen one at a time? Yes one at a time with a arrows to go to the next one  
  - Scrollable list?
  - Carousel with peek at next?
- Question numbering:
  - "Question 1 of 20"? Yep
  - Progress dots at bottom?
  - Sidebar with all question numbers?

**Answer Feedback:**
- Correct answer:
  - Green flash? 
  - Checkmark animation?YES
  - Points earned popup?
  - Explanation panel slides in?
- Wrong answer:
  - Red shake?
  - X animation?YES
  - Show correct answer immediately?
  - Require acknowledgment?

**Score Display:**
- Running score:
  - Always visible in corner?
  - Only at end?YES
  - Points animation when earned?
- Performance metrics: AT THE END 
  - Time per question?
  - Streak counter?
  - Accuracy percentage?

**MIX MODE Behavior:**
- How to transition between study and practice: NO TRANSITION HERE THE SAME PAGE WILL BE DEVIDED FOR STUDY ( THE NOTE EDITOR ) WITH 80% AND PRACTISE THE BUTTON HALF OF THE REMAINING 20% AND THE RIGHT SIDEBAR IN THE APPEAR HALF AND WHAT IS RESPONSIVE TO SCREEN CHANGES AS WITH ALL THE APP  
  - Automatic after X pages?NO
  - Button to switch?NO
  - Predetermined pattern?NO
- Visual indicator of current mode:
  - Border color?YES
  - Background tint?
  - Mode label?

**Right Sidebar (Content Hierarchy):**
- Width: Fixed or resizable? RESIZABLE
- Items display:
  - All expanded? 
  - Collapsible tree? YES
  - Current position highlighted?SURE
- Clicking behavior:
  - Jump to section?YEP
  - Preview popup?
  - Disabled during practice?
- Progress indicators per section:
  - Checkmarks?
  - Progress bars?
  - Color coding?YES

---

### 5️⃣ **RESUME PAGE**

**Story List View:**
- Card layout:
  - Horizontal cards (full width)?
  - Grid of cards (2-3 per row)?
  - Compact list (table-like)?
- For each story card show:
  - Title and description?
  - Progress percentage?
  - Last accessed?
  - Total sessions count?
  - Time invested?
  - Performance trend chart?

**View Toggle (Compact/Detailed):**
- Toggle position: Top right? Top center?
- Animation between views:
  - Fade transition?
  - Slide/expand?
  - Instant switch?
- What changes between views:
  - Just spacing?
  - Different info shown?
  - Different layout entirely?

**Mini Charts Design:**
- Chart types:
  - Line graph for progress?
  - Bar chart for session scores?
  - Pie chart for time distribution?
- Size: How small is "mini"? (100x50px? 150x75px?)
- Interactivity:
  - Hover for details?
  - Click to expand?
  - Static images?

**Action Buttons per Story:**
- "Resume" button:
  - Prominence? (Primary colored?)
  - Position? (Right side? Bottom?)
  - Show "Continue from: [topic]"?
- "See More" button:
  - What does it reveal?
  - Inline expansion?
  - Navigate to detail page?

**Filtering/Sorting:**
- Filter options:
  - By subject?
  - By date range?
  - By completion status?
  - By performance?
- Sort options:
  - Recent first?
  - Most progress?
  - Lowest performance?
- Search bar:
  - Search story names?
  - Search content within?

**Empty State:**
- When no stories exist:
  - Illustration?
  - Encouraging message?
  - Quick start button?

---

### 6️⃣ **STATS PAGE**

**Overall Layout:**
- Dashboard style (multiple charts)?
- Single view with tabs for different metrics?
- Scrollable report format?

**Chart Types & Visualizations:**
- Progress over time:
  - Line graph?
  - Calendar heatmap?
  - Bar chart?
- Performance by subject:
  - Radar chart?
  - Grouped bars?
  - Donut charts?
- Study time distribution:
  - Pie chart?
  - Treemap?
  - Stacked bars?

**Time Range Selector:**
- Position: Top of page?
- Options: Today/Week/Month/Year/All-time?
- Custom date range picker?
- Comparison mode (this week vs last week)?

**Metrics to Display:**
- Study metrics:
  - Total time studied?
  - Average session length?
  - Study streak?
  - Pages read?
- Performance metrics:
  - Average accuracy?
  - Improvement rate?
  - Problem areas?
  - Best performing topics?
- Engagement metrics:
  - Sessions per day?
  - Completion rate?
  - Points earned?

**Detailed Breakdowns:**
- Click on chart for details:
  - Modal with data table?
  - Drill down to another view?
  - Tooltip with info?
- Export options:
  - Download as image?
  - PDF report?
  - CSV data?

**Achievements/Gamification:**
- Show badges earned?
- Progress toward next level?
- Leaderboard comparison?
- Personal records?

---

### 7️⃣ **STORY DETAIL PAGE**

**Header Section:**
- Story info display:
  - Large title?
  - Description below?
  - Created date?
  - Tags/categories?
- Quick stats bar:
  - Total progress?
  - Time invested?
  - Average score?
  - Sessions count?

**Session Timeline:**
- Visual style:
  - Vertical timeline?
  - Horizontal carousel?
  - List with connecting lines?
- For each session node:
  - Date/time?
  - Duration?
  - Score/performance?
  - Mode (study/practice/mix)?
  - Click for details?

**Session Comparison:**
- Compare multiple sessions:
  - Side by side?
  - Overlay charts?
  - Diff view?
- What metrics to compare:
  - Scores?
  - Time taken?
  - Topics covered?

**Content Coverage Map:**
- Visual representation:
  - Tree diagram?
  - Sunburst chart?
  - Network graph?
- Show:
  - Covered vs uncovered?
  - Performance by area?
  - Suggested next topics?

**Action Panel:**
- Continue story button?
- Add more content?
- Reset progress?
- Archive/Delete?
- Share with others?

---

## 🎮 Interactive Behaviors

### Animations & Transitions
1. **Page Transitions:**
   - Slide between pages?
   - Fade in/out?
   - No animation (instant)?

2. **Micro-interactions:**
   - Button press: Scale down slightly?
   - Success actions: Confetti? Pulse? Sound?
   - Loading states: Skeleton screens? Spinners? Progress bars?

3. **Scroll Behaviors:**
   - Smooth scroll to sections?
   - Parallax effects?
   - Sticky headers?
   - Infinite scroll or pagination?

### Feedback & Notifications
1. **Success Messages:**
   - Toast notifications (top/bottom corner)?
   - Modal dialogs?
   - Inline alerts?
   - Duration on screen?

2. **Error Handling:**
   - How to show errors:
     - Red toast?
     - Shake animation?
     - Modal with details?
   - Retry options visible?

3. **Progress Saves:**
   - Auto-save indicator?
   - Manual save button?
   - Confirmation when leaving unsaved?

### Mobile/Responsive Considerations
1. **Breakpoints:**
   - Mobile (<768px): Stack everything vertical?
   - Tablet (768-1024px): 2 column layout?
   - Desktop (>1024px): Full layout?

2. **Touch Interactions:**
   - Swipe between tabs?
   - Pull to refresh?
   - Long press for options?
   - Pinch to zoom in study mode?

3. **Navigation:**
   - Bottom tab bar on mobile?
   - Hamburger menu?
   - Gesture navigation?

---

## 🎯 User Flow Questions

### Session Creation Flow
1. **Starting a Session:**
   - Quick start (one click) vs Configured start (choose options)?
   - Resume last session prominently?
   - Suggested sessions based on weak points?

2. **During Session:**
   - Pause/Resume capability?
   - Save and exit option?
   - Progress visible always?
   - Skip question/content allowed?

3. **Ending Session:**
   - Summary screen (what to show)?
   - Next steps suggestions?
   - Share results option?
   - Review mistakes immediately?

### Content Navigation
1. **Moving Between Content:**
   - Next/Previous buttons where?
   - Keyboard shortcuts (arrow keys)?
   - Swipe gestures?
   - Jump to section menu?

2. **Bookmarking:**
   - Bookmark icon where?
   - Bookmark management page?
   - Quick access to bookmarks?

3. **Search:**
   - Global search across all content?
   - Search within current session?
   - Recent searches saved?
   - Search suggestions?

---

## 🎨 Special Features

### Accessibility
1. **Visual Accessibility:**
   - High contrast mode?
   - Font size controls?
   - Color blind friendly?
   - Focus indicators visible?

2. **Screen Reader:**
   - Proper ARIA labels?
   - Logical tab order?
   - Announcements for actions?

### Personalization
1. **Customization Options:**
   - Theme selection?
   - Layout density?
   - Default study duration?
   - Notification preferences?

2. **User Preferences:**
   - Remember last selections?
   - Favorite subjects/topics?
   - Preferred quiz types?
   - Study time goals?

### Gamification Elements
1. **Points/Rewards:**
   - Points visible where?
   - Level/ranking system?
   - Achievements/badges?
   - Daily challenges?

2. **Progress Visualization:**
   - XP bars?
   - Streak counters?
   - Milestone celebrations?
   - Competition elements?

---

## 📱 Edge Cases & States

### Empty States
- What to show when:
  - No stories created yet?
  - No weak points identified?
  - No sessions completed?
  - Search returns no results?

### Loading States
- How to handle:
  - Initial app load?
  - Data fetching?
  - Image loading?
  - Slow connections?

### Error States
- What to display for:
  - Connection lost?
  - Content not found?
  - Session expired?
  - Invalid actions?

### Limits & Constraints
- Maximum number of:
  - SPoints per session?
  - Stories per user?
  - Sessions per story?
- Minimum requirements:
  - Minimum SPoints to start?
  - Minimum time for session?

---

## 🎯 Priority Questions

**MOST IMPORTANT - Please rank these 1-10:**
1. Clean minimalist design vs Information-rich interface?
2. Animations and polish vs Fast and snappy?
3. Guided experience vs User freedom?
4. Mobile-first vs Desktop-first?
5. Gamification vs Professional feel?
6. Social features vs Private experience?
7. Customization vs Simplicity?
8. Data/charts vs Visual progress?
9. Structured paths vs Flexible exploration?
10. Quick actions vs Deliberate choices?

---

## Final Vision Question

**In one paragraph, describe your ideal user experience when someone uses FURBIO for a typical study session from login to completion. What should they feel? What should be effortless? What should be satisfying?**

---

Please answer these questions in order of importance to you. We can start with the most critical pages/features first and perfect them before moving on.