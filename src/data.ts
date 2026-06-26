import type { Section } from './types';

const fig = (src: string, alt: string) => `![${alt}](${src})`;
const code = (lang: string, body: string) => `\`\`\`${lang}\n${body}\n\`\`\``;

export const initialSections: Section[] = [
  {
    id: 'black-box-testing',
    topicId: 'software-testing-topic',
    title: 'Black Box Testing',
    description: 'Testing techniques focused on input, output, and observable behavior.',
    exercises: [
      {
        id: 'bva-hotel-reservation-system',
        sectionTitle: 'Black Box Testing',
        title: 'Boundary Value Analysis - Hotel Reservation System',
        description: 'Practice identifying boundary values in a hotel booking workflow.',
        questions: [
          {
            id: 'bva-q1',
            prompt: ['## Question 1', '', 'A hotel allows stays from 1 to 14 nights. Which test values best cover the boundaries?', '', code('ts', 'const stayLengths = [0, 1, 2, 13, 14, 15];')].join('\n'),
            explanation: ['Boundary value analysis focuses on values just below, at, and just above the limits.', '', fig('https://placehold.co/640x220/png?text=Boundary+Value+Analysis', 'Boundary Value Analysis')].join('\n'),
            correctOptionId: 'bva-q1-b',
            options: [
              { id: 'bva-q1-a', label: 'A', text: 'Only `1` and `14`' },
              { id: 'bva-q1-b', label: 'B', text: '`0, 1, 2, 13, 14, 15`' },
              { id: 'bva-q1-c', label: 'C', text: 'Only `2` and `13`' },
              { id: 'bva-q1-d', label: 'D', text: '`1, 7, 14`' },
            ],
          },
          {
            id: 'bva-q2',
            prompt: ['## Question 2', '', 'The booking system accepts up to 3 guests per room. Which value is the most important upper-bound test?', '', code('ts', 'const maxGuests = 3;'), '', 'Use the formula $n = max + 1$ to test just above the valid range.'].join('\n'),
            explanation: ['Upper-bound testing should include the maximum valid value and one value above it.', '', fig('https://placehold.co/640x240/png?text=Upper+Bound+Testing', 'Upper Bound Testing')].join('\n'),
            correctOptionId: 'bva-q2-c',
            options: [
              { id: 'bva-q2-a', label: 'A', text: '`2` only' },
              { id: 'bva-q2-b', label: 'B', text: '`3` only' },
              { id: 'bva-q2-c', label: 'C', text: '`3` and `4`' },
              { id: 'bva-q2-d', label: 'D', text: '`1` and `2`' },
            ],
          },
          {
            id: 'bva-q3',
            prompt: ['## Question 3', '', 'The room price must be between $50 and $500. Which pair is the best boundary test?', '', code('ts', 'const min = 50;\nconst max = 500;'), '', 'Formula: $[min - 1, min, max, max + 1]$'].join('\n'),
            explanation: ['A good boundary test checks values immediately outside and inside the range.', '', fig('https://placehold.co/640x220/png?text=Price+Range+Boundaries', 'Price Range Boundaries')].join('\n'),
            correctOptionId: 'bva-q3-d',
            options: [
              { id: 'bva-q3-a', label: 'A', text: '`49` and `50`' },
              { id: 'bva-q3-b', label: 'B', text: '`500` and `501`' },
              { id: 'bva-q3-c', label: 'C', text: '`100` and `200`' },
              { id: 'bva-q3-d', label: 'D', text: '`49`, `50`, `500`, `501`' },
            ],
          },
          {
            id: 'bva-q4',
            prompt: ['## Question 4', '', 'A cancellation fee applies only when the booking is canceled within 24 hours. Which case is a valid on/off boundary?', '', code('ts', 'const freeCancellationWindowHours = 24;')].join('\n'),
            explanation: ['Test both sides of the boundary: just before 24 hours and exactly at 24 hours.', '', fig('https://placehold.co/640x220/png?text=Cancellation+Window', 'Cancellation Window')].join('\n'),
            correctOptionId: 'bva-q4-a',
            options: [
              { id: 'bva-q4-a', label: 'A', text: '`23` and `24` hours' },
              { id: 'bva-q4-b', label: 'B', text: '`10` and `20` hours' },
              { id: 'bva-q4-c', label: 'C', text: '`24` and `36` hours' },
              { id: 'bva-q4-d', label: 'D', text: '`1` and `48` hours' },
            ],
          },
          {
            id: 'bva-q5',
            prompt: ['## Question 5', '', 'The reservation system limits check-in time to 2 PM - 10 PM. Which test data set is most complete?', '', code('ts', 'const checkInWindow = { start: 14, end: 22 };'), '', 'Think about the boundary set $[13, 14, 22, 23]$.'].join('\n'),
            explanation: ['This set includes values below, at, and above both ends of the allowed window.', '', fig('https://placehold.co/640x220/png?text=Check-in+Window', 'Check-in Window')].join('\n'),
            correctOptionId: 'bva-q5-c',
            options: [
              { id: 'bva-q5-a', label: 'A', text: '`14, 15, 21, 22`' },
              { id: 'bva-q5-b', label: 'B', text: '`12, 13, 14, 15`' },
              { id: 'bva-q5-c', label: 'C', text: '`13, 14, 22, 23`' },
              { id: 'bva-q5-d', label: 'D', text: '`15, 16, 17, 18`' },
            ],
          },
        ],
      },
      {
        id: 'ep-shipping-fee',
        sectionTitle: 'Black Box Testing',
        title: 'Equivalence Partitioning - Shipping Fee',
        description: 'Group inputs and derive expected outcomes for shipping charges.',
        questions: [
          {
            id: 'ep-q1',
            prompt: ['## Question 1', '', 'The shipping fee is free for orders above $100. Which partition is valid?', '', code('ts', 'const freeShippingThreshold = 100;')].join('\n'),
            explanation: ['Equivalence partitioning divides inputs into valid and invalid classes.', '', fig('https://placehold.co/640x220/png?text=Valid+Partitions', 'Valid Partitions')].join('\n'),
            correctOptionId: 'ep-q1-b',
            options: [
              { id: 'ep-q1-a', label: 'A', text: 'Only orders worth `100`' },
              { id: 'ep-q1-b', label: 'B', text: 'Orders `<= 100` and orders `> 100`' },
              { id: 'ep-q1-c', label: 'C', text: 'Orders `1` to `10` only' },
              { id: 'ep-q1-d', label: 'D', text: 'Orders `100` and `200` only' },
            ],
          },
          {
            id: 'ep-q2',
            prompt: ['## Question 2', '', 'Which formula describes the shipping fee rule if the base price is `p` and discount is `d`?', '', 'Use $fee = p - d$ when the order is eligible for a discount.'].join('\n'),
            explanation: ['The formula should match the business rule exactly.', '', fig('https://placehold.co/640x220/png?text=Shipping+Formula', 'Shipping Formula')].join('\n'),
            correctOptionId: 'ep-q2-a',
            options: [
              { id: 'ep-q2-a', label: 'A', text: '$fee = p - d$' },
              { id: 'ep-q2-b', label: 'B', text: '$fee = p + d$' },
              { id: 'ep-q2-c', label: 'C', text: '$fee = d - p$' },
              { id: 'ep-q2-d', label: 'D', text: '$fee = p \\times d$' },
            ],
          },
          {
            id: 'ep-q3',
            prompt: ['## Question 3', '', 'A shipping calculator has these customer types. Which table best helps build equivalence classes?', '', '| Customer Type | Rule |', '| --- | --- |', '| Regular | Standard rate |', '| Premium | Discounted rate |', '', fig('https://placehold.co/640x220/png?text=Customer+Type+Table', 'Customer Type Table')].join('\n'),
            explanation: ['Tables help compare groups of inputs and identify valid partitions quickly.', '', fig('https://placehold.co/640x240/png?text=Equivalence+Classes', 'Equivalence Classes')].join('\n'),
            correctOptionId: 'ep-q3-d',
            options: [
              { id: 'ep-q3-a', label: 'A', text: 'Use only one customer type' },
              { id: 'ep-q3-b', label: 'B', text: 'Split by age only' },
              { id: 'ep-q3-c', label: 'C', text: 'Ignore the discount rule' },
              { id: 'ep-q3-d', label: 'D', text: 'Separate customers by rule-based groups' },
            ],
          },
          {
            id: 'ep-q4',
            prompt: ['## Question 4', '', 'Which pair belongs to the same invalid partition for shipping weight limits?', '', code('ts', 'const maxWeight = 20;')].join('\n'),
            explanation: ['Invalid partitions include values below the minimum and above the maximum.', '', fig('https://placehold.co/640x220/png?text=Invalid+Partition', 'Invalid Partition')].join('\n'),
            correctOptionId: 'ep-q4-c',
            options: [
              { id: 'ep-q4-a', label: 'A', text: '`10` and `15`' },
              { id: 'ep-q4-b', label: 'B', text: '`20` and `21`' },
              { id: 'ep-q4-c', label: 'C', text: '`-1` and `21`' },
              { id: 'ep-q4-d', label: 'D', text: '`5` and `20`' },
            ],
          },
          {
            id: 'ep-q5',
            prompt: ['## Question 5', '', 'The system applies a weekend surcharge. Which input classes are most useful?', '', 'Consider $weekday$ vs $weekend$ as the main classes.'].join('\n'),
            explanation: ['The important idea is to test representative members from each class.', '', fig('https://placehold.co/640x220/png?text=Weekday+Weekend+Classes', 'Weekday Weekend Classes')].join('\n'),
            correctOptionId: 'ep-q5-b',
            options: [
              { id: 'ep-q5-a', label: 'A', text: 'Only weekend dates' },
              { id: 'ep-q5-b', label: 'B', text: 'One weekday and one weekend date' },
              { id: 'ep-q5-c', label: 'C', text: 'Only public holidays' },
              { id: 'ep-q5-d', label: 'D', text: 'Only Monday and Friday' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'test-automation',
    topicId: 'software-testing-topic',
    title: 'Test Automation',
    description: 'Exercises focused on automation strategy, locators, and test stability.',
    exercises: [
      {
        id: 'locator-login-page',
        sectionTitle: 'Test Automation',
        title: 'Locator Strategy - Login Page',
        description: 'Choose stable locators for a login screen and related checks.',
        questions: [
          {
            id: 'ta-q1',
            prompt: ['## Question 1', '', 'Which locator is generally the most stable for a login button?', '', code('ts', 'button[data-testid="login-button"]')].join('\n'),
            explanation: ['A test-id based selector is usually more stable than text or class-based locators.', '', fig('https://placehold.co/640x220/png?text=Stable+Locator', 'Stable Locator')].join('\n'),
            correctOptionId: 'ta-q1-c',
            options: [
              { id: 'ta-q1-a', label: 'A', text: 'XPath by absolute position' },
              { id: 'ta-q1-b', label: 'B', text: 'CSS class with random hash' },
              { id: 'ta-q1-c', label: 'C', text: 'Test id / data attribute' },
              { id: 'ta-q1-d', label: 'D', text: 'Text node only' },
            ],
          },
          {
            id: 'ta-q2',
            prompt: ['## Question 2', '', 'What is the best assertion after a successful login?', '', 'Use a reliable state check such as $Dashboard$ or a user-specific element.'].join('\n'),
            explanation: ['Assertions should verify a visible post-login state, not just a click action.', '', fig('https://placehold.co/640x220/png?text=Post-Login+State', 'Post Login State')].join('\n'),
            correctOptionId: 'ta-q2-b',
            options: [
              { id: 'ta-q2-a', label: 'A', text: 'Check the page title only' },
              { id: 'ta-q2-b', label: 'B', text: 'Verify the dashboard or profile element' },
              { id: 'ta-q2-c', label: 'C', text: 'Wait for 1 second' },
              { id: 'ta-q2-d', label: 'D', text: 'Refresh the page' },
            ],
          },
          {
            id: 'ta-q3',
            prompt: ['## Question 3', '', 'Which code sample is a good pattern for waiting until an element is visible?', '', code('ts', 'await page.getByRole("button", { name: "Login" }).waitFor({ state: "visible" });')].join('\n'),
            explanation: ['Explicit waits help reduce flakiness in automation tests.', '', fig('https://placehold.co/640x220/png?text=Explicit+Waits', 'Explicit Waits')].join('\n'),
            correctOptionId: 'ta-q3-a',
            options: [
              { id: 'ta-q3-a', label: 'A', text: 'Use an explicit wait for visibility' },
              { id: 'ta-q3-b', label: 'B', text: 'Use `Thread.sleep(5000)` everywhere' },
              { id: 'ta-q3-c', label: 'C', text: 'Click immediately and ignore errors' },
              { id: 'ta-q3-d', label: 'D', text: 'Reload the page repeatedly' },
            ],
          },
          {
            id: 'ta-q4',
            prompt: ['## Question 4', '', 'Which formula is useful when calculating retry attempts?', '', '$attempts = initial + retries$'].join('\n'),
            explanation: ['A retry strategy should clearly define the number of attempts.', '', fig('https://placehold.co/640x220/png?text=Retry+Strategy', 'Retry Strategy')].join('\n'),
            correctOptionId: 'ta-q4-d',
            options: [
              { id: 'ta-q4-a', label: 'A', text: '$attempts = retries - initial$' },
              { id: 'ta-q4-b', label: 'B', text: '$attempts = initial / retries$' },
              { id: 'ta-q4-c', label: 'C', text: '$attempts = 0$' },
              { id: 'ta-q4-d', label: 'D', text: '$attempts = initial + retries$' },
            ],
          },
          {
            id: 'ta-q5',
            prompt: ['## Question 5', '', 'Which artifact is most useful when reviewing an automation failure?', '', code('ts', 'screenshot.png')].join('\n'),
            explanation: ['Screenshots and logs help identify whether the issue is locator, timing, or environment related.', '', fig('https://placehold.co/640x220/png?text=Failure+Artifacts', 'Failure Artifacts')].join('\n'),
            correctOptionId: 'ta-q5-b',
            options: [
              { id: 'ta-q5-a', label: 'A', text: 'Only the browser cache' },
              { id: 'ta-q5-b', label: 'B', text: 'Screenshot, logs, and DOM snapshot' },
              { id: 'ta-q5-c', label: 'C', text: 'A random timeout value' },
              { id: 'ta-q5-d', label: 'D', text: 'The desktop wallpaper' },
            ],
          },
        ],
      },
      {
        id: 'form-stability-practice',
        sectionTitle: 'Test Automation',
        title: 'Form Stability - Signup Flow',
        description: 'Practice choosing stable checks for a signup form.',
        questions: [
          {
            id: 'fs-q1',
            prompt: ['## Question 1', '', 'Which selector is best for a password input field?', '', code('ts', 'input[type="password"][data-testid="password"]')].join('\n'),
            explanation: ['Combining type and test id makes the locator easier to maintain.', '', fig('https://placehold.co/640x220/png?text=Password+Field', 'Password Field')].join('\n'),
            correctOptionId: 'fs-q1-c',
            options: [
              { id: 'fs-q1-a', label: 'A', text: 'Absolute XPath' },
              { id: 'fs-q1-b', label: 'B', text: 'Dynamic class name' },
              { id: 'fs-q1-c', label: 'C', text: 'Type + test id' },
              { id: 'fs-q1-d', label: 'D', text: 'Index-based CSS only' },
            ],
          },
          {
            id: 'fs-q2',
            prompt: ['## Question 2', '', 'What should you verify after clicking Sign Up?', '', 'A success banner or a redirected dashboard is ideal.'].join('\n'),
            explanation: ['The test should confirm the expected user state after submission.', '', fig('https://placehold.co/640x220/png?text=Sign+Up+Success', 'Sign Up Success')].join('\n'),
            correctOptionId: 'fs-q2-a',
            options: [
              { id: 'fs-q2-a', label: 'A', text: 'Success banner or redirect' },
              { id: 'fs-q2-b', label: 'B', text: 'Only that the button was clicked' },
              { id: 'fs-q2-c', label: 'C', text: 'The browser zoom level' },
              { id: 'fs-q2-d', label: 'D', text: 'The page source length' },
            ],
          },
          {
            id: 'fs-q3',
            prompt: ['## Question 3', '', 'Which formula is helpful when validating form totals?', '', '$total = fields + errors$'].join('\n'),
            explanation: ['This kind of formula helps express the relationship between form input and validation states.', '', fig('https://placehold.co/640x220/png?text=Form+Validation', 'Form Validation')].join('\n'),
            correctOptionId: 'fs-q3-a',
            options: [
              { id: 'fs-q3-a', label: 'A', text: '$total = fields + errors$' },
              { id: 'fs-q3-b', label: 'B', text: '$total = fields - errors$' },
              { id: 'fs-q3-c', label: 'C', text: '$total = fields \\times errors$' },
              { id: 'fs-q3-d', label: 'D', text: '$total = errors$' },
            ],
          },
          {
            id: 'fs-q4',
            prompt: ['## Question 4', '', 'Which test is most useful for catching layout regressions?', '', code('ts', 'await page.screenshot({ path: "signup-form.png" });')].join('\n'),
            explanation: ['Visual checks can catch alignment and spacing problems quickly.', '', fig('https://placehold.co/640x220/png?text=Visual+Regression', 'Visual Regression')].join('\n'),
            correctOptionId: 'fs-q4-b',
            options: [
              { id: 'fs-q4-a', label: 'A', text: 'No assertion at all' },
              { id: 'fs-q4-b', label: 'B', text: 'Screenshot comparison' },
              { id: 'fs-q4-c', label: 'C', text: 'Only console output' },
              { id: 'fs-q4-d', label: 'D', text: 'Hardcoded sleep' },
            ],
          },
          {
            id: 'fs-q5',
            prompt: ['## Question 5', '', 'Which data set is best for an email field?', '', 'Test valid and invalid formats such as $user@example.com$ and `abc@`.'].join('\n'),
            explanation: ['Representative valid and invalid inputs help cover the main validation paths.', '', fig('https://placehold.co/640x220/png?text=Email+Validation', 'Email Validation')].join('\n'),
            correctOptionId: 'fs-q5-d',
            options: [
              { id: 'fs-q5-a', label: 'A', text: 'Only one valid email' },
              { id: 'fs-q5-b', label: 'B', text: 'Only one invalid email' },
              { id: 'fs-q5-c', label: 'C', text: 'Random text only' },
              { id: 'fs-q5-d', label: 'D', text: 'A mix of valid and invalid formats' },
            ],
          },
        ],
      },
    ],
  },
];
