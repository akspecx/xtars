import React, { useState, useCallback, useEffect, useRef } from 'react';

const questions = [
  {
    questionNumber: 1,
    equation: "x/2 - 1/5 = x/3 + 1/4",
    answer: 2.7,
    options: [2.5, 2.7, 3.0, 3.2],
    steps: [
      {
        step: 1,
        equation: "x/2 - 1/5 = x/3 + 1/4",
        highlightedEquation: `x/2 - 1/5 = x/3 + 1/4`,
        explanation: "The equation is x/2 - 1/5 = x/3 + 1/4. We will start by finding the least common multiple of the denominators 2, 5, 3, and 4, which is 60.",
        voice: "The equation is x over 2 minus 1 over 5 equals x over 3 plus 1 over 4. We will start by finding the least common multiple of the denominators, which is 60."
      },
      {
        step: 2,
        equation: "30x - 12 = 20x + 15",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">60</span>(x/2 - 1/5) = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">60</span>(x/3 + 1/4)`,
        explanation: "Multiply every term by 60 to clear the fractions. This simplifies to 30x - 12 = 20x + 15.",
        voice: "Multiply every term by 60 to clear the fractions. This simplifies to 30x minus 12 equals 20x plus 15."
      },
      {
        step: 3,
        equation: "10x = 27",
        highlightedEquation: `30x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 20x</span> - 12 = 15`,
        explanation: "Subtract 20x from both sides. Then, add 12 to both sides.",
        voice: "Subtract 20x from both sides. Then, add 12 to both sides."
      },
      {
        step: 4,
        equation: "x = 2.7",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10</span> = 27 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10</span>`,
        explanation: "This simplifies to 10x = 27. Finally, divide both sides by 10.",
        voice: "This simplifies to 10x equals 27. Finally, divide both sides by 10."
      },
      {
        step: 5,
        equation: "x = 2.7",
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2.7</span>`,
        explanation: "The solution is x = 2.7.",
        voice: "The solution is x equals 2.7."
      }
    ]
  },
  {
    questionNumber: 2,
    equation: "n/2 - 3n/4 + 5n/6 = 21",
    answer: 36,
    options: [24, 30, 36, 42],
    steps: [
      {
        step: 1,
        equation: "n/2 - 3n/4 + 5n/6 = 21",
        highlightedEquation: `n/2 - 3n/4 + 5n/6 = 21`,
        explanation: "The equation is n/2 - 3n/4 + 5n/6 = 21. The least common multiple of the denominators 2, 4, and 6 is 12.",
        voice: "The equation is n over 2 minus 3n over 4 plus 5n over 6 equals 21. The least common multiple of the denominators is 12."
      },
      {
        step: 2,
        equation: "6n - 9n + 10n = 252",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">12</span>(n/2 - 3n/4 + 5n/6) = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">12</span>(21)`,
        explanation: "Multiply every term by 12. This simplifies to 6n - 9n + 10n = 252.",
        voice: "Multiply every term by 12. This simplifies to 6n minus 9n plus 10n equals 252."
      },
      {
        step: 3,
        equation: "7n = 252",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6n - 9n + 10n</span> = 252`,
        explanation: "Combine the n terms to get 7n = 252. Now, divide both sides by 7.",
        voice: "Combine the n terms to get 7n equals 252. Now, divide both sides by 7."
      },
      {
        step: 4,
        equation: "n = 36",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7</span>n / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7</span> = 252 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7</span>`,
        explanation: "The solution is n = 36.",
        voice: "The solution is n equals 36."
      },
      {
        step: 5,
        equation: "n = 36",
        highlightedEquation: `n = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">36</span>`,
        explanation: "The final answer is n = 36.",
        voice: "The final answer is n equals 36."
      }
    ]
  },
  {
    questionNumber: 3,
    equation: "x + 7 - 8x/3 = 17/6 - 5x/2",
    answer: -5,
    options: [-3, -4, -5, -6],
    steps: [
      {
        step: 1,
        equation: "x + 7 - 8x/3 = 17/6 - 5x/2",
        highlightedEquation: `x + 7 - 8x/3 = 17/6 - 5x/2`,
        explanation: "The equation is x + 7 - 8x/3 = 17/6 - 5x/2. The least common multiple of the denominators 3, 6, and 2 is 6.",
        voice: "The equation is x plus 7 minus 8x over 3 equals 17 over 6 minus 5x over 2. The least common multiple of the denominators is 6."
      },
      {
        step: 2,
        equation: "6x + 42 - 16x = 17 - 15x",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6</span>(x + 7 - 8x/3) = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6</span>(17/6 - 5x/2)`,
        explanation: "Multiply every term by 6 to clear the fractions. This simplifies to 6x + 42 - 16x = 17 - 15x.",
        voice: "Multiply every term by 6 to clear the fractions. This simplifies to 6x plus 42 minus 16x equals 17 minus 15x."
      },
      {
        step: 3,
        equation: "42 - 10x = 17 - 15x",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6x - 16x</span> + 42 = 17 - 15x`,
        explanation: "Combine like terms on the left side. The equation becomes 42 - 10x = 17 - 15x. Now, add 15x to both sides.",
        voice: "Combine like terms on the left side. The equation becomes 42 minus 10x equals 17 minus 15x. Now, add 15x to both sides."
      },
      {
        step: 4,
        equation: "42 + 5x = 17",
        highlightedEquation: `42 - 10x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 15x</span> = 17 - 15x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 15x</span>`,
        explanation: "This simplifies to 42 + 5x = 17. Subtract 42 from both sides to isolate the x term.",
        voice: "This simplifies to 42 plus 5x equals 17. Subtract 42 from both sides to isolate the x term."
      },
      {
        step: 5,
        equation: "5x = -25",
        highlightedEquation: `42 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 42</span> + 5x = 17 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 42</span>`,
        explanation: "This gives us 5x = -25. Finally, divide both sides by 5.",
        voice: "This gives us 5x equals negative 25. Finally, divide both sides by 5."
      },
      {
        step: 6,
        equation: "x = -5",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span> = -25 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
        explanation: "The solution is x = -5.",
        voice: "The solution is x equals negative 5."
      }
    ]
  },
  {
    questionNumber: 4,
    equation: "(x - 5)/3 = (x - 3)/5",
    answer: 8,
    options: [6, 7, 8, 9],
    steps: [
      {
        step: 1,
        equation: "(x - 5)/3 = (x - 3)/5",
        highlightedEquation: `(x - 5)/3 = (x - 3)/5`,
        explanation: "The equation is (x - 5)/3 = (x - 3)/5. We can solve this by cross-multiplication.",
        voice: "The equation is x minus 5 over 3 equals x minus 3 over 5. We can solve this by cross-multiplication."
      },
      {
        step: 2,
        equation: "5(x - 5) = 3(x - 3)",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5(x - 5)</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3(x - 3)</span>`,
        explanation: "Multiplying gives us 5(x - 5) = 3(x - 3). Now, distribute on both sides.",
        voice: "Multiplying gives us 5 times the quantity of x minus 5 equals 3 times the quantity of x minus 3. Now, distribute on both sides."
      },
      {
        step: 3,
        equation: "5x - 25 = 3x - 9",
        highlightedEquation: `5x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> - 25 = 3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> - 9`,
        explanation: "This simplifies to 5x - 25 = 3x - 9. Subtract 3x from both sides.",
        voice: "This simplifies to 5x minus 25 equals 3x minus 9. Subtract 3x from both sides."
      },
      {
        step: 4,
        equation: "2x - 25 = -9",
        highlightedEquation: `2x - 25 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 25</span> = -9 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 25</span>`,
        explanation: "This gives us 2x - 25 = -9. Now, add 25 to both sides.",
        voice: "This gives us 2x minus 25 equals negative 9. Now, add 25 to both sides."
      },
      {
        step: 5,
        equation: "2x = 16",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = 16 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "This gives us 2x = 16. Finally, divide both sides by 2.",
        voice: "This gives us 2x equals 16. Finally, divide both sides by 2."
      },
      {
        step: 6,
        equation: "x = 8",
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">8</span>`,
        explanation: "The solution is x = 8.",
        voice: "The solution is x equals 8."
      }
    ]
  },
  {
    questionNumber: 5,
    equation: "(3t - 2)/4 - (2t + 3)/3 = 2/3 - t",
    answer: 2,
    options: [1, 2, 3, 4],
    steps: [
      {
        step: 1,
        equation: "(3t - 2)/4 - (2t + 3)/3 = 2/3 - t",
        highlightedEquation: `(3t - 2)/4 - (2t + 3)/3 = 2/3 - t`,
        explanation: "The equation is (3t - 2)/4 - (2t + 3)/3 = 2/3 - t. The least common multiple of the denominators 4 and 3 is 12.",
        voice: "The equation is 3t minus 2 over 4, minus 2t plus 3 over 3, equals 2 over 3 minus t. The least common multiple of the denominators is 12."
      },
      {
        step: 2,
        equation: "3(3t - 2) - 4(2t + 3) = 8 - 12t",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">12</span>[(3t-2)/4 - (2t+3)/3] = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">12</span>[2/3 - t]`,
        explanation: "Multiply every term by 12 to clear the fractions. This simplifies to 3(3t - 2) - 4(2t + 3) = 4(2) - 12t.",
        voice: "Multiply every term by 12 to clear the fractions. This simplifies to 3 times the quantity of 3t minus 2, minus 4 times the quantity of 2t plus 3, equals 4 times 2 minus 12t."
      },
      {
        step: 3,
        equation: "9t - 6 - 8t - 12 = 8 - 12t",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">9t - 6 - 8t - 12</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">8 - 12t</span>`,
        explanation: "Distribute the constants on both sides. This simplifies to 9t - 6 - 8t - 12 = 8 - 12t. Now combine like terms.",
        voice: "Distribute the constants on both sides. This simplifies to 9t minus 6 minus 8t minus 12 equals 8 minus 12t. Now combine like terms."
      },
      {
        step: 4,
        equation: "t - 18 = 8 - 12t",
        highlightedEquation: `t - 18 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 12t</span> = 8 - 12t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 12t</span>`,
        explanation: "This simplifies to t - 18 = 8 - 12t. Add 12t to both sides.",
        voice: "This simplifies to t minus 18 equals 8 minus 12t. Add 12t to both sides."
      },
      {
        step: 5,
        equation: "13t - 18 = 8",
        highlightedEquation: `13t - 18 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 18</span> = 8 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 18</span>`,
        explanation: "This gives us 13t - 18 = 8. Now, add 18 to both sides.",
        voice: "This gives us 13t minus 18 equals 8. Now, add 18 to both sides."
      },
      {
        step: 6,
        equation: "13t = 26",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">13</span>t / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">13</span> = 26 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">13</span>`,
        explanation: "This gives us 13t = 26. Finally, divide both sides by 13.",
        voice: "This gives us 13t equals 26. Finally, divide both sides by 13."
      },
      {
        step: 7,
        equation: "t = 2",
        highlightedEquation: `t = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "The solution is t = 2.",
        voice: "The solution is t equals 2."
      }
    ]
  },
  {
    questionNumber: 6,
    equation: "m - (m - 1)/2 = 1 - (m - 2)/3",
    answer: 1.4,
    options: [1.2, 1.4, 1.6, 1.8],
    steps: [
      {
        step: 1,
        equation: "m - (m - 1)/2 = 1 - (m - 2)/3",
        highlightedEquation: `m - (m - 1)/2 = 1 - (m - 2)/3`,
        explanation: "The equation is m - (m - 1)/2 = 1 - (m - 2)/3. The least common multiple of the denominators 2 and 3 is 6.",
        voice: "The equation is m minus the quantity of m minus 1 over 2, equals 1 minus the quantity of m minus 2 over 3. The least common multiple of the denominators is 6."
      },
      {
        step: 2,
        equation: "6m - 3(m - 1) = 6 - 2(m - 2)",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6</span>[m - (m - 1)/2] = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6</span>[1 - (m - 2)/3]`,
        explanation: "Multiply every term by 6 to clear the fractions. This simplifies to 6m - 3(m - 1) = 6 - 2(m - 2).",
        voice: "Multiply every term by 6 to clear the fractions. This simplifies to 6m minus 3 times the quantity of m minus 1, equals 6 minus 2 times the quantity of m minus 2."
      },
      {
        step: 3,
        equation: "6m - 3m + 3 = 6 - 2m + 4",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6m - 3m + 3</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">6 - 2m + 4</span>`,
        explanation: "Distribute the constants on both sides. This simplifies to 6m - 3m + 3 = 6 - 2m + 4. Now combine like terms.",
        voice: "Distribute the constants on both sides. This simplifies to 6m minus 3m plus 3 equals 6 minus 2m plus 4. Now combine like terms."
      },
      {
        step: 4,
        equation: "3m + 3 = 10 - 2m",
        highlightedEquation: `3m + 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 2m</span> = 10 - 2m <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 2m</span>`,
        explanation: "This simplifies to 3m + 3 = 10 - 2m. Add 2m to both sides to get all the m terms on one side.",
        voice: "This simplifies to 3m plus 3 equals 10 minus 2m. Add 2m to both sides."
      },
      {
        step: 5,
        equation: "5m + 3 = 10",
        highlightedEquation: `5m + 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span> = 10 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span>`,
        explanation: "This gives us 5m + 3 = 10. Now, subtract 3 from both sides.",
        voice: "This gives us 5m plus 3 equals 10. Now, subtract 3 from both sides."
      },
      {
        step: 6,
        equation: "5m = 7",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>m / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span> = 7 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
        explanation: "This gives us 5m = 7. Finally, divide both sides by 5.",
        voice: "This gives us 5m equals 7. Finally, divide both sides by 5."
      },
      {
        step: 7,
        equation: "m = 1.4",
        highlightedEquation: `m = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">1.4</span>`,
        explanation: "The solution is m = 1.4.",
        voice: "The solution is m equals 1.4."
      }
    ]
  },
  {
    questionNumber: 7,
    equation: "3(t - 3) = 5(2t + 1)",
    answer: -2,
    options: [-3, -2, -1, 0],
    steps: [
      {
        step: 1,
        equation: "3(t - 3) = 5(2t + 1)",
        highlightedEquation: `3(t - 3) = 5(2t + 1)`,
        explanation: "The equation to solve is 3(t - 3) = 5(2t + 1). First, we distribute the constants on both sides.",
        voice: "The equation to solve is 3 times the quantity of t minus 3 equals 5 times the quantity of 2t plus 1. First, we distribute the constants on both sides."
      },
      {
        step: 2,
        equation: "3t - 9 = 10t + 5",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3t - 9</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10t + 5</span>`,
        explanation: "After distributing, the equation becomes 3t - 9 = 10t + 5. Subtract 10t from both sides.",
        voice: "After distributing, the equation becomes 3t minus 9 equals 10t plus 5. Subtract 10t from both sides."
      },
      {
        step: 3,
        equation: "-7t - 9 = 5",
        highlightedEquation: `3t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 10t</span> - 9 = 10t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 10t</span> + 5`,
        explanation: "This simplifies to -7t - 9 = 5. Now, add 9 to both sides.",
        voice: "This simplifies to negative 7t minus 9 equals 5. Now, add 9 to both sides."
      },
      {
        step: 4,
        equation: "-7t = 14",
        highlightedEquation: `-7t - 9 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 9</span> = 5 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 9</span>`,
        explanation: "This gives us -7t = 14. Finally, divide both sides by -7.",
        voice: "This gives us negative 7t equals 14. Finally, divide both sides by negative 7."
      },
      {
        step: 5,
        equation: "t = -2",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-7</span>t / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-7</span> = 14 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-7</span>`,
        explanation: "This gives us -7t = 14. Finally, divide both sides by -7.",
        voice: "This gives us negative 7t equals 14. Finally, divide both sides by negative 7."
      },
      {
        step: 6,
        equation: "t = -2",
        highlightedEquation: `t = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-2</span>`,
        explanation: "The solution is t = -2.",
        voice: "The solution is t equals negative 2."
      }
    ]
  },
  {
    questionNumber: 8,
    equation: "15(y - 4) - 2(y - 9) + 5(y + 6) = 0",
    answer: "2/3",
    options: ["1/3", "2/3", 1, "4/3"],
    steps: [
      {
        step: 1,
        equation: "15(y - 4) - 2(y - 9) + 5(y + 6) = 0",
        highlightedEquation: `15(y - 4) - 2(y - 9) + 5(y + 6) = 0`,
        explanation: "The equation is 15(y - 4) - 2(y - 9) + 5(y + 6) = 0. We'll start by distributing the constants into the parentheses.",
        voice: "The equation is 15 times the quantity of y minus 4, minus 2 times the quantity of y minus 9, plus 5 times the quantity of y plus 6, equals 0. We'll start by distributing the constants."
      },
      {
        step: 2,
        equation: "15y - 60 - 2y + 18 + 5y + 30 = 0",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15y - 60 - 2y + 18 + 5y + 30</span> = 0`,
        explanation: "After distributing, the equation becomes 15y - 60 - 2y + 18 + 5y + 30 = 0. Now we can combine the like terms.",
        voice: "After distributing, the equation becomes 15y minus 60 minus 2y plus 18 plus 5y plus 30 equals 0. Now we can combine the like terms."
      },
      {
        step: 3,
        equation: "18y - 12 = 0",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18y</span> <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 12</span> = 0`,
        explanation: "This simplifies to 18y - 12 = 0. Now, add 12 to both sides.",
        voice: "This simplifies to 18y minus 12 equals 0. Now, add 12 to both sides."
      },
      {
        step: 4,
        equation: "18y = 12",
        highlightedEquation: `18y - 12 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 12</span> = 0 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 12</span>`,
        explanation: "This gives us 18y = 12. Finally, divide both sides by 18.",
        voice: "This gives us 18y equals 12. Finally, divide both sides by 18."
      },
      {
        step: 5,
        equation: "y = 12/18",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18</span>y / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18</span> = 12 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18</span>`,
        explanation: "This gives us 18y = 12. Finally, divide both sides by 18.",
        voice: "This gives us 18y equals 12. Finally, divide both sides by 18."
      },
      {
        step: 6,
        equation: "y = 2/3",
        highlightedEquation: `y = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2/3</span>`,
        explanation: "The final answer is y = 2/3.",
        voice: "The final answer is y equals 2 over 3."
      }
    ]
  },
  {
    questionNumber: 9,
    equation: "3(5z - 7) - 2(9z - 11) = 4(8z - 13) - 17",
    answer: 2,
    options: [1, 2, 3, 4],
    steps: [
      {
        step: 1,
        equation: "3(5z - 7) - 2(9z - 11) = 4(8z - 13) - 17",
        highlightedEquation: `3(5z - 7) - 2(9z - 11) = 4(8z - 13) - 17`,
        explanation: "The equation is 3(5z - 7) - 2(9z - 11) = 4(8z - 13) - 17. We'll start by distributing the constants into the parentheses on both sides.",
        voice: "The equation is 3 times the quantity of 5z minus 7, minus 2 times the quantity of 9z minus 11, equals 4 times the quantity of 8z minus 13, minus 17. We'll start by distributing the constants."
      },
      {
        step: 2,
        equation: "15z - 21 - 18z + 22 = 32z - 52 - 17",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15z - 21 - 18z + 22</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">32z - 52 - 17</span>`,
        explanation: "After distributing, the equation becomes 15z - 21 - 18z + 22 = 32z - 52 - 17. Now we combine like terms on each side.",
        voice: "After distributing, the equation becomes 15z minus 21 minus 18z plus 22 equals 32z minus 52 minus 17. Now we combine like terms."
      },
      {
        step: 3,
        equation: "-3z + 1 = 32z - 69",
        highlightedEquation: `-3z + 1 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 32z</span> = 32z <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 32z</span> - 69`,
        explanation: "This simplifies to -3z + 1 = 32z - 69. Now, let's get all the 'z' terms on one side. We can subtract 32z from both sides.",
        voice: "This simplifies to negative 3z plus 1 equals 32z minus 69. Let's subtract 32z from both sides."
      },
      {
        step: 4,
        equation: "-35z + 1 = -69",
        highlightedEquation: `-35z + 1 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 1</span> = -69 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 1</span>`,
        explanation: "This gives us -35z + 1 = -69. Now, subtract 1 from both sides to isolate the 'z' term.",
        voice: "This gives us negative 35z plus 1 equals negative 69. Now, subtract 1 from both sides."
      },
      {
        step: 5,
        equation: "-35z = -70",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-35</span>z / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-35</span> = -70 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-35</span>`,
        explanation: "This gives us -35z = -70. Finally, divide both sides by -35.",
        voice: "This gives us negative 35z equals negative 70. Finally, divide both sides by negative 35."
      },
      {
        step: 6,
        equation: "z = 2",
        highlightedEquation: `z = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "The solution is z = 2.",
        voice: "The solution is z equals 2."
      }
    ]
  },
  {
    questionNumber: 10,
    equation: "0.25(4f - 3) = 0.05(10f - 9)",
    answer: 0.6,
    options: [0.5, 0.6, 0.7, 0.8],
    steps: [
      {
        step: 1,
        equation: "0.25(4f - 3) = 0.05(10f - 9)",
        highlightedEquation: `0.25(4f - 3) = 0.05(10f - 9)`,
        explanation: "The equation is 0.25(4f - 3) = 0.05(10f - 9). First, we can multiply the entire equation by 100 to remove the decimals.",
        voice: "The equation is 0.25 times the quantity of 4f minus 3, equals 0.05 times the quantity of 10f minus 9. First, we can multiply the entire equation by 100 to remove the decimals."
      },
      {
        step: 2,
        equation: "25(4f - 3) = 5(10f - 9)",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">25(4f - 3)</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5(10f - 9)</span>`,
        explanation: "This simplifies the equation to 25(4f - 3) = 5(10f - 9). Now, we distribute the constants on both sides.",
        voice: "This simplifies the equation to 25 times the quantity of 4f minus 3, equals 5 times the quantity of 10f minus 9. Now, we distribute the constants on both sides."
      },
      {
        step: 3,
        equation: "100f - 75 = 50f - 45",
        highlightedEquation: `100f <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 50f</span> - 75 = 50f <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 50f</span> - 45`,
        explanation: "After distributing, the equation becomes 100f - 75 = 50f - 45. Now, subtract 50f from both sides.",
        voice: "After distributing, the equation becomes 100f minus 75 equals 50f minus 45. Now, subtract 50f from both sides."
      },
      {
        step: 4,
        equation: "50f - 75 = -45",
        highlightedEquation: `50f - 75 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 75</span> = -45 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 75</span>`,
        explanation: "This gives us 50f - 75 = -45. Add 75 to both sides to isolate the f term.",
        voice: "This gives us 50f minus 75 equals negative 45. Add 75 to both sides."
      },
      {
        step: 5,
        equation: "50f = 30",
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">50</span>f / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">50</span> = 30 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">50</span>`,
        explanation: "This simplifies to 50f = 30. Finally, divide both sides by 50.",
        voice: "This simplifies to 50f equals 30. Finally, divide both sides by 50."
      },
      {
        step: 6,
        equation: "f = 0.6",
        highlightedEquation: `f = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">0.6</span>`,
        explanation: "The final answer is f = 0.6.",
        voice: "The final answer is f equals 0.6."
      }
    ]
  }
];
const translations = {
  en: {
    title: "⚖️ The Balanced Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    start: "Start",
    goBack: "Go to Practice Questions",
    findX: "What is the value of X?",
    submit: "✅ Submit",
    retry: "🔄 Retry",
    viewExplanation: "🤔 View Explanation",
    correctAnswer: "🎉 Correct! The answer is ",
    incorrectAnswer: "❌ Incorrect. Please try again.",
    solveEquationIntro: "Equation to solve: ",
    step: "Step",
    equation: "Equation",
    explanation: "Explanation",
    continue: "Continue",
    originalEquation: "Original equation:",
    substitute: "Substitute X =",
    calculate: "Calculate:",
    perfect: "✅ Perfect! The equation is balanced!",
    finalVerification: "Final Verification",
    nextQuestion: "➡ Next Question"
  },
  hi: {
    title: "⚖️ संतुलित पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    start: "शुरू करें",
    goBack: "अभ्यास प्रश्नों पर वापस जाएं",
    findX: "X का मान कितना है?",
    submit: "✅ सबमिट करें",
    retry: "🔄 पुनः प्रयास करें",
    viewExplanation: "🤔 स्पष्टीकरण देखें",
    correctAnswer: "🎉 सही! उत्तर ",
    incorrectAnswer: "❌ गलत। कृपया पुनः प्रयास करें।",
    solveEquationIntro: "हल करने के लिए समीकरण: ",
    step: "चरण",
    equation: "समीकरण",
    explanation: "स्पष्टीकरण",
    continue: "जारी रखें",
    originalEquation: "मूल समीकरण:",
    substitute: "X = रखें:",
    calculate: "गणना करें:",
    perfect: "✅ बिलकुल सही! समीकरण संतुलित है!",
    finalVerification: "अंतिम सत्यापन",
    nextQuestion: "➡ अगला प्रश्न"
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [userInteraction, setUserInteraction] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mode, setMode] = useState('initial'); // 'initial', 'practice' or 'solve'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [equationStep, setEquationStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const t = useCallback((key) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (text) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();
    
    if (!text) return Promise.resolve();

    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.cancel();
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
      } else {
        resolve();
      }
    });
  }, [currentLanguage, userInteraction, audioEnabled]);

  useEffect(() => {
    if (mode === 'solve' && equationStep > 0 && equationStep <= questions[currentQuestionIndex].steps.length) {
      const stepData = questions[currentQuestionIndex].steps[equationStep - 1];
      const voiceMessage = currentLanguage === 'hi' ? stepData.voice_hi : stepData.voice;
      speakMessage(voiceMessage);
    } else if (mode === 'solve' && equationStep > questions[currentQuestionIndex].steps.length) {
      const finalVerificationText = currentLanguage === 'hi' ? "अब हम अपने उत्तर की जांच करते हैं। मूल समीकरण में X का मान रखें और देखें कि क्या दोनों पक्ष बराबर हैं। समीकरण संतुलित है!" : "Now let's verify our answer. Substitute the value of X back into the original equation to check if both sides are equal. The equation is balanced!";
      speakMessage(finalVerificationText);
    } else if (mode === 'practice' && !isCorrect && !showExplanation) {
      const currentQuestion = questions[currentQuestionIndex];
      const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
      const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
      speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
    }
  }, [equationStep, mode, speakMessage, currentLanguage, isCorrect, showExplanation, currentQuestionIndex]);

  const handleStartPractice = () => {
    setMode('practice');
    setCurrentQuestionIndex(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    const currentQuestion = questions[0];
    const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
    const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
    speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setMode('initial');
    setEquationStep(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };
  
  const handleRetry = () => {
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    const currentQuestion = questions[currentQuestionIndex];
    const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
    const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
    speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
  }
  
  const handleViewExplanation = () => {
    setShowExplanation(true);
    setEquationStep(1);
    setMode('solve');
  }

  const handleNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setMode('practice');
    setEquationStep(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  }

  const handleEquationStep = (step) => {
    speechSynthesis.cancel();
    setEquationStep(step);
  };
  
  const handleQuestionChange = (index) => {
    setCurrentQuestionIndex(index);
    setMode('practice');
    setEquationStep(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };
  
  const handlePracticeSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (userAnswer == currentQuestion.answer) {
      setIsCorrect(true);
      const correctText = currentLanguage === 'hi' ? translations.hi.correctAnswer : translations.en.correctAnswer;
      speakMessage(correctText + currentQuestion.answer + '!');
    } else {
      setIsCorrect(false);
      const incorrectText = currentLanguage === 'hi' ? translations.hi.incorrectAnswer : translations.en.incorrectAnswer;
      speakMessage(incorrectText);
    }
  }

  const renderEquationTextWithHighlight = (stepData) => {
    const { highlightedEquation, explanation } = stepData;
    const explanationText = currentLanguage === 'hi' ? stepData.explanation_hi : stepData.explanation;
    
    return (
      <>
        <div className={`font-mono p-3 rounded-lg w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`} dangerouslySetInnerHTML={{ __html: highlightedEquation }}></p>
        </div>
        <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{explanationText}</p>
      </>
    );
  };

  const renderCurrentStepContent = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const totalSteps = currentQuestion.steps.length;

    if (mode === 'initial') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-auto border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className={`text-lg sm:text-2xl font-semibold px-2 ${currentLanguage === 'hi' ? 'text-gray-800' : 'text-gray-200'}`}>Welcome to the interactive equation solver. Click on the button below to begin the practice session.</p>
          <button
              onClick={handleStartPractice}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl mt-4"
          >
            Start Practice
          </button>
        </div>
      );
    }
    
    if (mode === 'practice' && !showExplanation) {
      return (
        <>
          <div className="w-full text-center mb-4">
              <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('solveEquationIntro')}</h3>
              <p className={`font-mono text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{currentQuestion.equation}</p>
          </div>
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('findX')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {currentQuestion.options.map(option => (
              <button
                key={option}
                onClick={() => setUserAnswer(option)}
                disabled={isCorrect !== null}
                className={`py-3 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 ${
                  userAnswer === option 
                    ? 'ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 ring-blue-500' 
                    : 'hover:bg-opacity-80'
                } ${
                  isCorrect === true && userAnswer === option
                    ? 'bg-green-500 text-white'
                    : isCorrect === false && userAnswer === option
                    ? 'bg-red-500 text-white'
                    : `${theme === 'light' ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-700 text-white hover:bg-indigo-600'}`
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {isCorrect === null && (
            <button
              onClick={handlePracticeSubmit}
              disabled={userAnswer === null}
              className={`w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4 ${userAnswer === null && 'opacity-50 cursor-not-allowed'}`}
            >
              {t('submit')}
            </button>
          )}
          {isCorrect !== null && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
              {isCorrect === false ? (
                <>
                  <button
                    onClick={handleRetry}
                    className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                  >
                    {t('retry')}
                  </button>
                  <button
                    onClick={handleViewExplanation}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                  >
                    {t('viewExplanation')}
                  </button>
                </>
              ) : (
                <>
                  <button
                      onClick={handleNextQuestion}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                  >
                      {t('nextQuestion')}
                  </button>
                  <button
                      onClick={handleViewExplanation}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                  >
                      {t('viewExplanation')}
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )
    }
    
    if (mode === 'solve' || showExplanation) {
      const stepData = currentQuestion.steps[equationStep - 1];
      
      return (
        <>
        <div className="w-full text-center mb-4">
            <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Equation to solve:</h3>
            <p className={`font-mono text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{currentQuestion.equation}</p>
        </div>
        <div className="w-full flex justify-center mb-4 overflow-x-auto">
          <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
            {currentQuestion.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleEquationStep(step.step)}
                className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                  equationStep === step.step
                    ? 'bg-blue-600 text-white'
                    : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                }`}
              >
                {t('step')} {step.step}
              </button>
            ))}
            {/* Final verification step button */}
            <button
                key={currentQuestion.steps.length + 1}
                onClick={() => handleEquationStep(currentQuestion.steps.length + 1)}
                className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                  equationStep === currentQuestion.steps.length + 1
                    ? 'bg-blue-600 text-white'
                    : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                }`}
              >
                {t('finalVerification')}
              </button>
          </div>
        </div>

        <div className={`flex flex-col items-start w-full min-h-[150px] p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          {stepData && (
            <>
              <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('step')} {stepData.step}</h3>
              {renderEquationTextWithHighlight(stepData)}
            </>
          )}
          {equationStep > totalSteps && renderVerification()}
        </div>
        {equationStep < totalSteps + 1 && (
          <button
            onClick={() => handleEquationStep(equationStep + 1)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4"
          >
            {t('continue')}
          </button>
        )}
        {equationStep >= totalSteps + 1 && (
          <div className="mt-4 flex gap-4 w-full justify-center">
            <button
              onClick={handleNextQuestion}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('nextQuestion')}
            </button>
          </div>
        )}
        </>
      )
    }
    return null;
  };

  const renderVerification = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const originalEquation = currentQuestion.equation;
    const answer = currentQuestion.answer;
    
    // Final Verification logic
    const verificationEquation = `${originalEquation.replace(/x/g, `(${answer})`).replace(/t/g, `(${answer})`).replace(/n/g, `(${answer})`).replace(/z/g, `(${answer})`).replace(/y/g, `(${answer})`).replace(/m/g, `(${answer})`).replace(/f/g, `(${answer})`)}`;
    
    return (
      <div className={`mt-6 p-4 rounded-lg shadow-inner ${theme === 'light' ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-800 text-gray-200'}`}>
        <h3 className="font-bold text-lg mb-2">{t('finalVerification')}</h3>
        <p className={`font-mono text-sm sm:text-base text-left whitespace-pre-wrap ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`} dangerouslySetInnerHTML={{ __html: verificationEquation }}></p>
      </div>
    );
  };
  
  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
      <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
              {t('selectLanguage')}:
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
                handleReset();
              }}
              className={`p-2 border rounded-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-2 rounded-md font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`}
            >
              {t('changeTheme')}
            </button>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`px-3 py-2 rounded-md font-medium ${audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
            >
              🔊 {audioEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight text-center px-2 transition-colors duration-300 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          {t('title')}
        </h2>
        
        {mode !== 'initial' && (
          <div className="w-full flex justify-center mb-4 overflow-x-auto">
            <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionChange(index)}
                  className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                    currentQuestionIndex === index
                      ? 'bg-blue-600 text-white'
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            {renderCurrentStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;