# Reflection

### 1. The hardest bug you hit this week, and how you debugged it
I spent way too much time this week fighting a browser cache bug that made me feel like I was losing my mind. Basically, whenever I updated an image or changed a CSS value, the browser would keep showing the old version. I would save my code, refresh the page, and see absolutely zero change. At first, I thought my code was just broken or that I didn't understand how Next.js was handling the assets. I tried restarting the dev server and clearing my history, but the old logos were still stuck there. 

I finally opened the network tab and realized the browser was aggressively serving cached versions with "304 Not Modified" statuses. To get around it, I had to manually rename my files to things like `logo_v2.png` just to force a fresh download. It was a simple problem, but it really slowed me down because I kept questioning my own logic when the UI wouldn't update. This taught me that you can't always trust what you see in the browser window during development and to check the network tab sooner next time.

### 2. A decision you reversed mid-week, and what made you reverse it
One big change I made mid-week was throwing away my entire orange color theme. I originally picked orange because I thought it looked "startup-y" and fresh, but as the app came together, it started looking more like a generic social app than a financial tool. When I compared it to the actual Credex website, the gap in quality was obvious. The orange felt a bit loud and unprofessional for something that is supposed to help people manage their company's spending.

I decided to scrap the orange and switch to the official Credex green and white palette. It was a pain to go back and update all my Tailwind classes, but it was definitely the right call. The app immediately felt more "real" and trustworthy. It's much easier to imagine a founder using this now that it looks like a proper tool in the Credex family. It was a good lesson in not getting too attached to my first design idea and being willing to start over if something isn't working.

### 3. What you would build if you had another 48 hours (or week 2)
If I had another 48 hours, I would love to spend more time making the logic in the audit engine more powerful. Because of time constraints, I couldn't focus on it as deeply as I wanted; I tried using various models like Claude and Gemini to get a good working baseline, but the logic still needs a lot of work. For example, there are still some rare cases where it suggests canceling a tool without realizing that different departments might actually need separate software. With a bit more time, I would focus entirely on improving those calculations so that the engine better understands different team needs, making the final suggestions feel much more natural.

After tweaking the logic, I’d focus on making the audit engine actually "smart" instead of just a basic calculator. I want to add a lot more models and services to the database so it can handle more complex stacks, and build a "capability overlap" feature to flag duplicate AI subscriptions. I’d also love to add a "Download Report" button for generating PDF summaries, and integrate more Credex-specific deals so users can immediately take action on the savings we identify.

### 4. How you used AI tools
I used AI tools a lot, but it wasn't as smooth as I expected. I used Claude for the UI, Gemini for the logic and writing .md files, and ChatGPT for generic doubts or quick questions. Claude was helpful for getting the layout started, but it gave me so many bugs. Elements would be misaligned on mobile, or icons would just disappear. I had to spend a lot of time manually fixing its mistakes or re-prompting it to get things right. I definitely didn't trust it blindly; I had to check every single div and transition it generated to make sure it wasn't doing something weird.

Gemini was better for the structured stuff, but it still messed up. At one point, it suggested a calculation for annual savings that was totally wrong because it missed a digit. If I hadn't been checking the math against my own pricing data, I would have ended up with a broken calculator. This week really showed me that while AI is great for speed, you have to be the one actually driving the project and catching the mistakes. It's more of a co-pilot that needs a lot of supervision.

### 5. Self-rating (1–10 scale)
*   **Discipline: 9/10** — I got it all done on time, but I definitely felt the pressure at the end. Being my first assignment, the amount of documentation was a bit overwhelming.
*   **Code Quality: 8/10** — The code is clean and works well, but since a lot of it was co-authored with AI, I still feel like it needs a thorough manual check to be perfect.
*   **Design Sense: 9/10** — I’m really happy with the simple, clean design. Switching to the Credex theme made a huge difference in how professional the app feels.
*   **Problem Solving: 8/10** — I got stuck on various problems throughout the project, sometimes got frustrated but eventually found the solution.
*   **Entrepreneurial Thinking: 7/10** — I’m still learning how to think about products from a business perspective, but I’m trying to focus on how this tool actually saves money for users.