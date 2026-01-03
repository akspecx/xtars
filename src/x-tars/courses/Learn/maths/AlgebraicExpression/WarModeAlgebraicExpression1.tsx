// import React, { useState, useCallback, useEffect, useRef } from 'react';

// const questions = [
//   {
//     questionNumber: 1,
//     equation: "3x = 2x + 18",
//     answer: 18,
//     options: [6, 9, 12, 18],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `3x = 2x + 18`,
//         explanation: "The equation to solve is 3x = 2x + 18. Our goal is to get the x terms on one side and the numbers on the other.",
//         voice: "The equation to solve is 3x equals 2x plus 18. Our goal is to get the x terms on one side and the numbers on the other.",
//         voice_hi: "समीकरण है 3x = 2x + 18। हमारा लक्ष्य x वाले पदों को एक तरफ और संख्याओं को दूसरी तरफ लाना है।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2x</span> = 2x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2x</span> + 18`,
//         explanation: "To get all the x terms on one side, we subtract 2x from both sides of the equation. This keeps the equation balanced.",
//         voice: "To get all the x terms on one side, we subtract 2x from both sides.",
//         voice_hi: "सभी x पदों को एक तरफ लाने के लिए, हम दोनों पक्षों से 2x घटाते हैं। इससे समीकरण संतुलित रहता है।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">x</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18</span>`,
//         explanation: "After subtracting 2x from both sides, the equation simplifies to x = 18. This is our answer.",
//         voice: "After subtracting 2x from both sides, the equation simplifies to x equals 18. This is our answer.",
//         voice_hi: "दोनों पक्षों से 2x घटाने के बाद, समीकरण x = 18 हो जाता है। यही हमारा उत्तर है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 2,
//     equation: "5t - 3 = 3t - 5",
//     answer: -1,
//     options: [-1, 1, 2, -2],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `5t - 3 = 3t - 5`,
//         explanation: "The equation to solve is 5t - 3 = 3t - 5. Our goal is to get the t terms on one side and the numbers on the other.",
//         voice: "The equation to solve is 5t minus 3 equals 3t minus 5. Our goal is to get the t terms on one side and the numbers on the other.",
//         voice_hi: "समीकरण है 5t - 3 = 3t - 5। हमारा लक्ष्य t वाले पदों को एक तरफ और संख्याओं को दूसरी तरफ लाना है।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `5t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3t</span> - 3 = 3t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3t</span> - 5`,
//         explanation: "First, we subtract 3t from both sides to get the 't' terms on the left.",
//         voice: "First, we subtract 3t from both sides to get the t terms on the left.",
//         voice_hi: "पहले, हम t पदों को बाईं ओर लाने के लिए दोनों पक्षों से 3t घटाते हैं।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `2t - 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 3</span> = -5 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 3</span>`,
//         explanation: "This simplifies to 2t - 3 = -5. Now, we add 3 to both sides to isolate the t term.",
//         voice: "This simplifies to 2t minus 3 equals negative 5. Now, we add 3 to both sides to isolate the t term.",
//         voice_hi: "यह 2t - 3 = -5 हो जाता है। अब, t पद को अलग करने के लिए हम दोनों पक्षों में 3 जोड़ते हैं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>t / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = -2 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
//         explanation: "This simplifies to 2t = -2. Finally, we divide both sides by 2 to solve for t.",
//         voice: "This simplifies to 2t equals negative 2. Finally, we divide both sides by 2 to solve for t.",
//         voice_hi: "यह 2t = -2 हो जाता है। अंत में, t का मान निकालने के लिए हम दोनों पक्षों को 2 से भाग देते हैं।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `t = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-1</span>`,
//         explanation: "After dividing both sides by 2, we get t = -1.",
//         voice: "After dividing both sides by 2, we get t equals negative 1.",
//         voice_hi: "दोनों पक्षों को 2 से भाग देने पर, हमें t = -1 मिलता है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 3,
//     equation: "5x + 9 = 5 + 3x",
//     answer: -2,
//     options: [-1, -2, 2, 4],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `5x + 9 = 5 + 3x`,
//         explanation: "The equation to solve is 5x + 9 = 5 + 3x. Let's get all the 'x' terms on one side.",
//         voice: "The equation to solve is 5x plus 9 equals 5 plus 3x. Let's get all the x terms on one side.",
//         voice_hi: "समीकरण है 5x + 9 = 5 + 3x। हम सभी x पदों को एक तरफ लाते हैं।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `5x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> + 9 = 5 + 3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span>`,
//         explanation: "Subtract 3x from both sides to move the x terms to the left.",
//         voice: "Subtract 3x from both sides to move the x terms to the left.",
//         voice_hi: "x पदों को बाईं ओर ले जाने के लिए दोनों पक्षों से 3x घटाएं।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `2x + 9 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 9</span> = 5 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 9</span>`,
//         explanation: "This simplifies to 2x + 9 = 5. Now, subtract 9 from both sides.",
//         voice: "This simplifies to 2x plus 9 equals 5. Now, subtract 9 from both sides.",
//         voice_hi: "यह 2x + 9 = 5 हो जाता है। अब, 9 को दोनों पक्षों से घटाएं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = -4 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
//         explanation: "This gives us 2x = -4. Now divide by 2 to find x.",
//         voice: "This gives us 2x equals negative 4. Now divide by 2 to find x.",
//         voice_hi: "यह 2x = -4 हो जाता है। अब x का मान निकालने के लिए 2 से भाग दें।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-2</span>`,
//         explanation: "The final answer is x = -2.",
//         voice: "The final answer is x equals negative 2.",
//         voice_hi: "अंतिम उत्तर x = -2 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 4,
//     equation: "4z + 3 = 6 + 2z",
//     answer: 1.5,
//     options: [1, 2, 1.5, 3],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `4z + 3 = 6 + 2z`,
//         explanation: "The equation to solve is 4z + 3 = 6 + 2z. We will subtract 2z from both sides first.",
//         voice: "The equation to solve is 4z plus 3 equals 6 plus 2z. We will subtract 2z from both sides first.",
//         voice_hi: "समीकरण है 4z + 3 = 6 + 2z। हम पहले दोनों पक्षों से 2z घटाएंगे।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `4z <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2z</span> + 3 = 6 + 2z <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2z</span>`,
//         explanation: "Subtracting 2z from both sides gives us 2z + 3 = 6.",
//         voice: "Subtracting 2z from both sides gives us 2z plus 3 equals 6.",
//         voice_hi: "दोनों पक्षों से 2z घटाने पर हमें 2z + 3 = 6 मिलता है।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `2z + 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span> = 6 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span>`,
//         explanation: "Now, subtract 3 from both sides to isolate the z term.",
//         voice: "Now, subtract 3 from both sides to isolate the z term.",
//         voice_hi: "अब, z पद को अलग करने के लिए दोनों पक्षों से 3 घटाएं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>z / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = 3 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
//         explanation: "This simplifies to 2z = 3. Finally, divide both sides by 2.",
//         voice: "This simplifies to 2z equals 3. Finally, we divide both sides by 2.",
//         voice_hi: "यह 2z = 3 हो जाता है। अंत में, दोनों पक्षों को 2 से भाग दें।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `z = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">1.5</span>`,
//         explanation: "The solution is z = 1.5.",
//         voice: "The solution is z equals 1.5.",
//         voice_hi: "हल z = 1.5 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 5,
//     equation: "2x - 1 = 14 - x",
//     answer: 5,
//     options: [3, 4, 5, 6],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `2x - 1 = 14 - x`,
//         explanation: "The equation to solve is 2x - 1 = 14 - x. We will start by adding x to both sides to get all the variables on one side.",
//         voice: "The equation to solve is 2x minus 1 equals 14 minus x. We will start by adding x to both sides.",
//         voice_hi: "समीकरण है 2x - 1 = 14 - x। हम सभी x पदों को एक तरफ लाने के लिए दोनों पक्षों में x जोड़ेंगे।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `2x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ x</span> - 1 = 14 - x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ x</span>`,
//         explanation: "After adding x to both sides, the equation becomes 3x - 1 = 14.",
//         voice: "After adding x to both sides, the equation becomes 3x minus 1 equals 14.",
//         voice_hi: "दोनों पक्षों में x जोड़ने के बाद, समीकरण 3x - 1 = 14 हो जाता है।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `3x - 1 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 1</span> = 14 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 1</span>`,
//         explanation: "Next, we add 1 to both sides to isolate the x term.",
//         voice: "Next, we add 1 to both sides to isolate the x term.",
//         voice_hi: "इसके बाद, x पद को अलग करने के लिए हम दोनों पक्षों में 1 जोड़ते हैं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span> = 15 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>`,
//         explanation: "This simplifies to 3x = 15. Finally, we divide both sides by 3.",
//         voice: "This simplifies to 3x equals 15. Finally, we divide both sides by 3.",
//         voice_hi: "यह 3x = 15 हो जाता है। अंत में, हम x का मान निकालने के लिए दोनों पक्षों को 3 से भाग देते हैं।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
//         explanation: "The final answer is x = 5.",
//         voice: "The final answer is x equals 5.",
//         voice_hi: "अंतिम उत्तर x = 5 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 6,
//     equation: "8x + 4 = 3(x - 1) + 7",
//     answer: 0,
//     options: [0, 1, -1, 2],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `8x + 4 = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3(x - 1)</span> + 7`,
//         explanation: "The equation to solve is 8x + 4 = 3(x - 1) + 7. We'll start by distributing the 3 on the right side.",
//         voice: "The equation to solve is 8x plus 4 equals 3 times the quantity of x minus 1, plus 7. We'll start by distributing the 3 on the right side.",
//         voice_hi: "समीकरण है 8x + 4 = 3(x - 1) + 7। हम पहले दाहिनी ओर 3 को वितरित करके शुरू करेंगे।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `8x + 4 = 3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3 + 7</span>`,
//         explanation: "After distributing, the right side becomes 3x - 3 + 7. We can combine the constant terms.",
//         voice: "After distributing, the right side becomes 3x minus 3 plus 7. We can combine the constant terms.",
//         voice_hi: "वितरित करने के बाद, दाहिनी ओर 3x - 3 + 7 हो जाता है। हम स्थिर पदों को जोड़ सकते हैं।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `8x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> = 3x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span>`,
//         explanation: "The equation now is 8x + 4 = 3x + 4. Let's subtract 3x from both sides.",
//         voice: "The equation now is 8x plus 4 equals 3x plus 4. Let's subtract 3x from both sides.",
//         voice_hi: "समीकरण अब 8x + 4 = 3x + 4 है। हम दोनों पक्षों से 3x घटाते हैं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `5x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4</span> = 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4</span>`,
//         explanation: "This simplifies to 5x + 4 = 4. Now subtract 4 from both sides.",
//         voice: "This simplifies to 5x plus 4 equals 4. Now subtract 4 from both sides.",
//         voice_hi: "यह 5x + 4 = 4 हो जाता है। अब दोनों पक्षों से 4 घटाएं।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span> = 0 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
//         explanation: "This gives us 5x = 0. Finally, divide both sides by 5.",
//         voice: "This gives us 5x equals 0. Finally, divide both sides by 5.",
//         voice_hi: "यह 5x = 0 हो जाता है। अंत में, दोनों पक्षों को 5 से भाग दें।"
//       },
//       {
//         step: 6,
//         highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">0</span>`,
//         explanation: "The final answer is x = 0.",
//         voice: "The final answer is x equals 0.",
//         voice_hi: "अंतिम उत्तर x = 0 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 7,
//     equation: "x = (4/5)(x + 10)",
//     answer: 40,
//     options: [20, 30, 40, 50],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `x = (4/5)(x + 10)`,
//         explanation: "The equation to solve is x = (4/5)(x + 10). We can multiply both sides by 5 to remove the fraction.",
//         voice: "The equation to solve is x equals 4 over 5 times the quantity of x plus 10. We can multiply both sides by 5 to remove the fraction.",
//         voice_hi: "समीकरण है x = (4/5)(x + 10)। भिन्न को हटाने के लिए हम दोनों पक्षों को 5 से गुणा कर सकते हैं।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">4(x + 10)</span>`,
//         explanation: "This simplifies to 5x = 4(x + 10). Now we distribute the 4 on the right side.",
//         voice: "This simplifies to 5x equals 4 times the quantity of x plus 10. Now we distribute the 4 on the right side.",
//         voice_hi: "यह 5x = 4(x + 10) हो जाता है। अब हम दाहिनी ओर 4 को वितरित करते हैं।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `5x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4x</span> = 4x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4x</span> + 40`,
//         explanation: "After distributing, the equation is 5x = 4x + 40. Subtract 4x from both sides.",
//         voice: "After distributing, the equation is 5x equals 4x plus 40. Subtract 4x from both sides.",
//         voice_hi: "वितरित करने के बाद, समीकरण 5x = 4x + 40 हो जाता है। दोनों पक्षों से 4x घटाएं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">x</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">40</span>`,
//         explanation: "This gives us our final answer, x = 40.",
//         voice: "This gives us our final answer, x equals 40.",
//         voice_hi: "इससे हमें हमारा अंतिम उत्तर, x = 40 मिलता है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 8,
//     equation: "2x/3 + 1 = 7x/15 + 3",
//     answer: 10,
//     options: [5, 10, 15, 20],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `2x/3 + 1 = 7x/15 + 3`,
//         explanation: "The equation is 2x/3 + 1 = 7x/15 + 3. The least common multiple of the denominators 3 and 15 is 15. We will multiply both sides by 15.",
//         voice: "The equation is 2x over 3 plus 1 equals 7x over 15 plus 3. The lowest common multiple of the denominators is 15. We will multiply both sides by 15.",
//         voice_hi: "समीकरण है 2x/3 + 1 = 7x/15 + 3। हर 3 और 15 का लघुत्तम समापवर्त्य 15 है। हम दोनों पक्षों को 15 से गुणा करेंगे।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15</span>(2x/3 + 1) = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15</span>(7x/15 + 3)`,
//         explanation: "After multiplying, this simplifies to 10x + 15 = 7x + 45.",
//         voice: "After multiplying, this simplifies to 10x plus 15 equals 7x plus 45.",
//         voice_hi: "गुणा करने के बाद, यह 10x + 15 = 7x + 45 हो जाता है।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `10x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 7x</span> + 15 = 45`,
//         explanation: "Subtract 7x from both sides. Then subtract 15 from both sides.",
//         voice: "Subtract 7x from both sides. Then subtract 15 from both sides.",
//         voice_hi: "दोनों पक्षों से 7x घटाएं। फिर दोनों पक्षों से 15 घटाएं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span> = 30 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>`,
//         explanation: "This gives us 3x = 30. Finally, divide both sides by 3.",
//         voice: "This gives us 3x equals 30. Finally, we divide both sides by 3.",
//         voice_hi: "इससे हमें 3x = 30 मिलता है। अंत में, दोनों पक्षों को 3 से भाग दें।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10</span>`,
//         explanation: "The solution is x = 10.",
//         voice: "The solution is x equals 10.",
//         voice_hi: "हल x = 10 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 9,
//     equation: "2y + 5/3 = 26/3 - y",
//     answer: "7/3",
//     options: [2, "7/3", 3, "2/3"],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `2y + 5/3 = 26/3 - y`,
//         explanation: "The equation is 2y + 5/3 = 26/3 - y. Let's start by getting all the y terms on the left.",
//         voice: "The equation is 2y plus 5 over 3 equals 26 over 3 minus y. Let's start by getting all the y terms on the left.",
//         voice_hi: "समीकरण है 2y + 5/3 = 26/3 - y। हम सभी y पदों को बाईं ओर लाने के लिए शुरू करते हैं।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `2y <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ y</span> + 5/3 = 26/3 - y <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ y</span>`,
//         explanation: "Add y to both sides, which simplifies to 3y + 5/3 = 26/3.",
//         voice: "Add y to both sides, which simplifies to 3y plus 5 over 3 equals 26 over 3.",
//         voice_hi: "दोनों पक्षों में y जोड़ने पर, यह 3y + 5/3 = 26/3 हो जाता है।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `3y = 26/3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5/3</span>`,
//         explanation: "Subtract 5/3 from both sides. The fractions have a common denominator, so we can subtract the numerators.",
//         voice: "Subtract 5 over 3 from both sides. The fractions have a common denominator, so we can subtract the numerators.",
//         voice_hi: "दोनों पक्षों से 5/3 घटाएं। भिन्न का हर समान है, इसलिए हम अंशों को घटा सकते हैं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>y = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">21/3</span>`,
//         explanation: "This simplifies to 3y = 7. Finally, divide both sides by 3.",
//         voice: "This simplifies to 3y equals 7. Finally, divide both sides by 3.",
//         voice_hi: "यह 3y = 7 हो जाता है। अंत में, दोनों पक्षों को 3 से भाग दें।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `y = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7/3</span>`,
//         explanation: "The solution is y = 7/3.",
//         voice: "The solution is y equals 7 over 3.",
//         voice_hi: "हल y = 7/3 है।"
//       }
//     ]
//   },
//   {
//     questionNumber: 10,
//     equation: "3m = 5m - 8/5",
//     answer: "4/5",
//     options: ["2/5", "4/5", "8/5", 1],
//     steps: [
//       {
//         step: 1,
//         highlightedEquation: `3m = 5m - 8/5`,
//         explanation: "The equation is 3m = 5m - 8/5. To get all the m terms on the same side, we can subtract 5m from both sides.",
//         voice: "The equation is 3m equals 5m minus 8 over 5. We can subtract 5m from both sides.",
//         voice_hi: "समीकरण है 3m = 5m - 8/5। सभी m पदों को एक ही तरफ लाने के लिए, हम दोनों पक्षों से 5m घटा सकते हैं।"
//       },
//       {
//         step: 2,
//         highlightedEquation: `3m <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5m</span> = 5m <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5m</span> - 8/5`,
//         explanation: "This simplifies to -2m = -8/5. Now, we can divide both sides by -2 to solve for m.",
//         voice: "This simplifies to negative 2m equals negative 8 over 5. Now, we can divide both sides by negative 2 to solve for m.",
//         voice_hi: "यह -2m = -8/5 हो जाता है। अब, m का मान निकालने के लिए हम दोनों पक्षों को -2 से भाग दे सकते हैं।"
//       },
//       {
//         step: 3,
//         highlightedEquation: `m = (-8/5) <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">/ (-2)</span>`,
//         explanation: "Dividing by -2 is the same as multiplying by -1/2. The two negatives cancel out.",
//         voice: "Dividing by negative 2 is the same as multiplying by negative 1 over 2. The two negatives cancel out.",
//         voice_hi: "-2 से भाग देना -1/2 से गुणा करने के समान है। दोनों नकारात्मक चिह्न रद्द हो जाते हैं।"
//       },
//       {
//         step: 4,
//         highlightedEquation: `m = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">8/10</span>`,
//         explanation: "This simplifies to m = 8/10, which can be further reduced.",
//         voice: "This simplifies to m equals 8 over 10, which can be further reduced.",
//         voice_hi: "यह m = 8/10 हो जाता है, जिसे और सरल किया जा सकता है।"
//       },
//       {
//         step: 5,
//         highlightedEquation: `m = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">4/5</span>`,
//         explanation: "The final answer is m = 4/5.",
//         voice: "The final answer is m equals 4 over 5.",
//         voice_hi: "अंतिम उत्तर m = 4/5 है।"
//       }
//     ]
//   }
// ];

// const translations = {
//   en: {
//     title: "⚖️ The Balanced Scale ⚖️",
//     selectLanguage: "Select Language",
//     changeTheme: "Change Theme",
//     start: "Start",
//     reset: "🔄 Reset",
//     welcome: {
//       text: "Let's begin by learning the most important rule of a balanced scale, which applies to equations as well.",
//       voice: "Let's begin by learning the most important rule of a balanced scale.",
//     },
//     goBack: "Go to Practice Questions",
//     findX: "What is the value of X?",
//     submit: "✅ Submit",
//     retry: "🔄 Retry",
//     viewExplanation: "🤔 View Explanation",
//     correctAnswer: "🎉 Correct! The answer is ",
//     incorrectAnswer: "❌ Incorrect. Please try again.",
//     solveEquationIntro: "Equation to solve: ",
//     step: "Step",
//     equation: "Equation",
//     explanation: "Explanation",
//     continue: "Continue",
//     originalEquation: "Original equation:",
//     substitute: "Substitute X =",
//     calculate: "Calculate:",
//     perfect: "✅ Perfect! The equation is balanced!",
//     finalVerification: "Final Verification",
//   },
//   hi: {
//     title: "⚖️ संतुलित पैमाना ⚖️",
//     selectLanguage: "भाषा चुनें",
//     changeTheme: "थीम बदलें",
//     start: "शुरू करें",
//     reset: "🔄 रीसेट करें",
//     welcome: {
//       text: "आइए एक संतुलित पैमाने के सबसे महत्वपूर्ण नियम को सीखकर शुरू करें, जो समीकरणों पर भी लागू होता है।",
//       voice: "आइए एक संतुलित पैमाने के सबसे महत्वपूर्ण नियम को सीखकर शुरू करें।",
//     },
//     goBack: "अभ्यास प्रश्नों पर वापस जाएं",
//     findX: "X का मान कितना है?",
//     submit: "✅ सबमिट करें",
//     retry: "🔄 पुनः प्रयास करें",
//     viewExplanation: "🤔 स्पष्टीकरण देखें",
//     correctAnswer: "🎉 सही! उत्तर ",
//     incorrectAnswer: "❌ गलत। कृपया पुनः प्रयास करें।",
//     solveEquationIntro: "हल करने के लिए समीकरण: ",
//     step: "चरण",
//     equation: "समीकरण",
//     explanation: "स्पष्टीकरण",
//     continue: "जारी रखें",
//     originalEquation: "मूल समीकरण:",
//     substitute: "X = रखें:",
//     calculate: "गणना करें:",
//     perfect: "✅ बिलकुल सही! समीकरण संतुलित है!",
//     finalVerification: "अंतिम सत्यापन",
//   },
// };

// const App = () => {
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [theme, setTheme] = useState('dark');
//   const [userInteraction, setUserInteraction] = useState(true);
//   const [audioEnabled, setAudioEnabled] = useState(true);
//   const [mode, setMode] = useState('initial'); // 'initial', 'practice' or 'solve'
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

//   const [equationStep, setEquationStep] = useState(0);
//   const [userAnswer, setUserAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [showExplanation, setShowExplanation] = useState(false);
  
//   const t = useCallback((key) => {
//     const translation = translations[currentLanguage][key];
//     if (typeof translation === 'object') {
//       return translation.text;
//     }
//     return translation;
//   }, [currentLanguage]);

//   const speakMessage = useCallback(async (text) => {
//     if (!userInteraction || !audioEnabled) return Promise.resolve();
    
//     if (!text) return Promise.resolve();

//     return new Promise((resolve) => {
//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
//         utterance.rate = 0.8;
//         speechSynthesis.cancel();
//         setTimeout(() => {
//           speechSynthesis.speak(utterance);
//         }, 100);
//         utterance.onend = () => resolve();
//         utterance.onerror = () => resolve();
//       } else {
//         resolve();
//       }
//     });
//   }, [currentLanguage, userInteraction, audioEnabled]);

//   useEffect(() => {
//     if (mode === 'solve' && equationStep > 0 && equationStep <= questions[currentQuestionIndex].steps.length) {
//       const stepData = questions[currentQuestionIndex].steps[equationStep - 1];
//       const voiceMessage = currentLanguage === 'hi' ? stepData.voice_hi : stepData.voice;
//       speakMessage(voiceMessage);
//     } else if (mode === 'solve' && equationStep > questions[currentQuestionIndex].steps.length) {
//       const finalVerificationStep = {
//         voice_hi: "अब हम अपने उत्तर की जांच करते हैं। मूल समीकरण में X का मान रखें और देखें कि क्या दोनों पक्ष बराबर हैं। समीकरण संतुलित है!",
//         voice: "Now let's verify our answer. Substitute the value of X back into the original equation to check if both sides are equal. The equation is balanced!",
//       };
//       const voiceMessage = currentLanguage === 'hi' ? finalVerificationStep.voice_hi : finalVerificationStep.voice;
//       speakMessage(voiceMessage);
//     } else if (mode === 'practice' && !isCorrect && !showExplanation) {
//       const currentQuestion = questions[currentQuestionIndex];
//       const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
//       const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
//       speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
//     }
//   }, [equationStep, mode, speakMessage, currentLanguage, isCorrect, showExplanation, currentQuestionIndex]);

//   const handleStartPractice = () => {
//     setMode('practice');
//     setCurrentQuestionIndex(0);
//     setUserAnswer(null);
//     setIsCorrect(null);
//     setShowExplanation(false);
//     const currentQuestion = questions[0];
//     const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
//     const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
//     speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
//   };

//   const handleReset = () => {
//     speechSynthesis.cancel();
//     setMode('initial');
//     setEquationStep(0);
//     setUserAnswer(null);
//     setIsCorrect(null);
//     setShowExplanation(false);
//   };
  
//   const handleRetry = () => {
//     setUserAnswer(null);
//     setIsCorrect(null);
//     setShowExplanation(false);
//     const currentQuestion = questions[currentQuestionIndex];
//     const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
//     const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
//     speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
//   }
  
//   const handleViewExplanation = () => {
//     setShowExplanation(true);
//     setEquationStep(1);
//     setMode('solve');
//   }

//   const handleGoBack = () => {
//     setMode('practice');
//     setEquationStep(0);
//     setUserAnswer(null);
//     setIsCorrect(null);
//     setShowExplanation(false);
//   };

//   const handleEquationStep = (step) => {
//     speechSynthesis.cancel();
//     setEquationStep(step);
//   };
  
//   const handleQuestionChange = (index) => {
//     setCurrentQuestionIndex(index);
//     setMode('practice');
//     setEquationStep(0);
//     setUserAnswer(null);
//     setIsCorrect(null);
//     setShowExplanation(false);
//     const currentQuestion = questions[index];
//     const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
//     const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
//     speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
//   };
  
//   const handlePracticeSubmit = () => {
//     const currentQuestion = questions[currentQuestionIndex];
//     if (userAnswer == currentQuestion.answer) {
//       setIsCorrect(true);
//       const correctText = currentLanguage === 'hi' ? translations.hi.correctAnswer : translations.en.correctAnswer;
//       speakMessage(correctText + currentQuestion.answer + '!');
//     } else {
//       setIsCorrect(false);
//       const incorrectText = currentLanguage === 'hi' ? translations.hi.incorrectAnswer : translations.en.incorrectAnswer;
//       speakMessage(incorrectText);
//     }
//   }

//   const renderEquationTextWithHighlight = (stepData) => {
//     const { highlightedEquation, explanation, explanation_hi } = stepData;
//     const explanationText = currentLanguage === 'hi' ? explanation_hi : explanation;
    
//     return (
//       <>
//         <div className={`font-mono p-3 rounded-lg w-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
//           <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`} dangerouslySetInnerHTML={{ __html: highlightedEquation }}></p>
//         </div>
//         <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{explanationText}</p>
//       </>
//     );
//   };

//   const renderCurrentStepContent = () => {
//     if (mode === 'initial') {
//       return (
//         <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-auto border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
//           <p className={`text-lg sm:text-2xl font-semibold px-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Welcome to the interactive equation solver. Click on the button below to begin the practice session.</p>
//           <button
//               onClick={handleStartPractice}
//               className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl mt-4"
//           >
//             Start Practice
//           </button>
//         </div>
//       );
//     }
    
//     const currentQuestion = questions[currentQuestionIndex];
    
//     if (mode === 'practice' && !showExplanation) {
//       return (
//         <>
//           <div className="w-full text-center mb-4">
//               <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('solveEquationIntro')}</h3>
//               <p className={`font-mono text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{currentQuestion.equation}</p>
//           </div>
//           <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('findX')}</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
//             {currentQuestion.options.map(option => (
//               <button
//                 key={option}
//                 onClick={() => setUserAnswer(option)}
//                 disabled={isCorrect !== null}
//                 className={`py-3 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 ${
//                   userAnswer === option 
//                     ? 'bg-blue-600 text-white'
//                     : `hover:bg-opacity-80 ${theme === 'light' ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-700 text-white hover:bg-indigo-600'}`
//                 } ${isCorrect === true && option === currentQuestion.answer ? 'bg-green-500 text-white' : ''} ${isCorrect === false && userAnswer === option ? 'bg-red-500 text-white' : ''} `}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//           {isCorrect === null && (
//             <button
//               onClick={handlePracticeSubmit}
//               disabled={userAnswer === null}
//               className={`w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4 ${userAnswer === null && 'opacity-50 cursor-not-allowed'}`}
//             >
//               {t('submit')}
//             </button>
//           )}
//           {isCorrect !== null && (
//             <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
//               {isCorrect === false ? (
//                 <>
//                   <button
//                     onClick={handleRetry}
//                     className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//                   >
//                     {t('retry')}
//                   </button>
//                   <button
//                     onClick={handleViewExplanation}
//                     className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//                   >
//                     {t('viewExplanation')}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                       onClick={handleGoBack}
//                       className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//                   >
//                       {t('goBack')}
//                   </button>
//                   <button
//                       onClick={handleViewExplanation}
//                       className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//                   >
//                       {t('viewExplanation')}
//                   </button>
//                 </>
//               )}
//             </div>
//           )}
//         </>
//       )
//     }
    
//     if (mode === 'solve' || showExplanation) {
//       const stepData = currentQuestion.steps[equationStep - 1];
      
//       return (
//         <>
//         <div className="w-full text-center mb-4">
//             <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Equation to solve:</h3>
//             <p className={`font-mono text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{currentQuestion.equation}</p>
//         </div>
//         <div className="w-full flex justify-center mb-4 overflow-x-auto">
//           <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
//             {currentQuestion.steps.map((step, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleEquationStep(step.step)}
//                 className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
//                   equationStep === step.step
//                     ? 'bg-blue-600 text-white'
//                     : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
//                 }`}
//               >
//                 {t('step')} {step.step}
//               </button>
//             ))}
//             {/* Final verification step button */}
//             <button
//                 key={currentQuestion.steps.length + 1}
//                 onClick={() => handleEquationStep(currentQuestion.steps.length + 1)}
//                 className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
//                   equationStep === currentQuestion.steps.length + 1
//                     ? 'bg-blue-600 text-white'
//                     : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
//                 }`}
//               >
//                 {t('finalVerification')}
//               </button>
//           </div>
//         </div>

//         <div className={`flex flex-col items-start w-full min-h-[150px] p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
//           {stepData && (
//             <>
//               <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('step')} {stepData.step}</h3>
//               {renderEquationTextWithHighlight(stepData)}
//             </>
//           )}
//           {equationStep > currentQuestion.steps.length && renderVerification()}
//         </div>
//         {equationStep < currentQuestion.steps.length + 1 && (
//           <button
//             onClick={() => handleEquationStep(equationStep + 1)}
//             className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4"
//           >
//             {t('continue')}
//           </button>
//         )}
//         {equationStep >= currentQuestion.steps.length + 1 && (
//           <div className="mt-4 flex gap-4 w-full justify-center">
//             <button
//               onClick={handleGoBack}
//               className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//             >
//               {t('goBack')}
//             </button>
//           </div>
//         )}
//         </>
//       )
//     }
//     return null;
//   };

//   const renderVerification = () => {
//     const currentQuestion = questions[currentQuestionIndex];
//     const originalEquation = currentQuestion.equation;
//     const answer = currentQuestion.answer;
    
//     // Final Verification logic
//     const verificationEquation = `${originalEquation.replace(/x/g, `(${answer})`).replace(/t/g, `(${answer})`).replace(/n/g, `(${answer})`).replace(/z/g, `(${answer})`).replace(/y/g, `(${answer})`).replace(/m/g, `(${answer})`).replace(/f/g, `(${answer})`)}`;
    
//     return (
//       <div className={`mt-6 p-4 rounded-lg shadow-inner ${theme === 'light' ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-800 text-gray-200'}`}>
//         <h3 className="font-bold text-lg mb-2">{t('finalVerification')}</h3>
//         <p className={`font-mono text-sm sm:text-base text-left whitespace-pre-wrap ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//           {t('originalEquation')} <span className="font-bold">{originalEquation}</span><br />
//           {t('substitute')} <span className="font-bold">{answer}</span>:<br />
//           <span className="font-bold">{verificationEquation}</span><br />
//           <span className="font-bold">{t('perfect')}</span>
//         </p>
//       </div>
//     );
//   };
  
//   return (
//     <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
//       <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
//               {t('selectLanguage')}:
//             </label>
//             <select
//               value={currentLanguage}
//               onChange={(e) => {
//                 setCurrentLanguage(e.target.value);
//                 handleReset();
//               }}
//               className={`p-2 border rounded-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//             </select>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//               className={`px-3 py-2 rounded-md font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`}
//             >
//               {t('changeTheme')}
//             </button>
//             <button
//               onClick={() => setAudioEnabled(!audioEnabled)}
//               className={`px-3 py-2 rounded-md font-medium ${audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
//             >
//               🔊 {audioEnabled ? 'ON' : 'OFF'}
//             </button>
//           </div>
//         </div>
//         <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight text-center px-2 transition-colors duration-300 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//           {t('title')}
//         </h2>
        
//         {mode !== 'initial' && (
//           <div className="w-full flex justify-center mb-4 overflow-x-auto">
//             <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
//               {questions.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleQuestionChange(index)}
//                   className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
//                     currentQuestionIndex === index
//                       ? 'bg-blue-600 text-white'
//                       : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
//                   }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
//           <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//             {renderCurrentStepContent()}
//             <div className="mt-4 flex gap-4 w-full justify-center">
//               <button
//                 onClick={handleReset}
//                 className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//               >
//                 {t('reset')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useCallback, useEffect, useRef } from 'react';

const questions = [
  {
    questionNumber: 1,
    equation: "3x = 2x + 18",
    answer: 18,
    options: [6, 9, 12, 18],
    steps: [
      {
        step: 1,
        highlightedEquation: `3x = 2x + 18`,
        explanation: "The equation to solve is 3x = 2x + 18. Our goal is to get the x terms on one side and the numbers on the other.",
        voice: "The equation to solve is 3x equals 2x plus 18. Our goal is to get the x terms on one side and the numbers on the other.",
        voice_hi: "समीकरण है 3x = 2x + 18। हमारा लक्ष्य x वाले पदों को एक तरफ और संख्याओं को दूसरी तरफ लाना है।"
      },
      {
        step: 2,
        highlightedEquation: `3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2x</span> = 2x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2x</span> + 18`,
        explanation: "To get all the x terms on one side, we subtract 2x from both sides of the equation. This keeps the equation balanced.",
        voice: "To get all the x terms on one side, we subtract 2x from both sides.",
        voice_hi: "सभी x पदों को एक तरफ लाने के लिए, हम दोनों पक्षों से 2x घटाते हैं। इससे समीकरण संतुलित रहता है।"
      },
      {
        step: 3,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">x</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">18</span>`,
        explanation: "After subtracting 2x from both sides, the equation simplifies to x = 18. This is our answer.",
        voice: "After subtracting 2x from both sides, the equation simplifies to x equals 18. This is our answer.",
        voice_hi: "दोनों पक्षों से 2x घटाने के बाद, समीकरण x = 18 हो जाता है। यही हमारा उत्तर है।"
      }
    ]
  },
  {
    questionNumber: 2,
    equation: "5t - 3 = 3t - 5",
    answer: -1,
    options: [-1, 1, 2, -2],
    steps: [
      {
        step: 1,
        highlightedEquation: `5t - 3 = 3t - 5`,
        explanation: "The equation to solve is 5t - 3 = 3t - 5. Our goal is to get the t terms on one side and the numbers on the other.",
        voice: "The equation to solve is 5t minus 3 equals 3t minus 5. Our goal is to get the t terms on one side and the numbers on the other.",
        voice_hi: "समीकरण है 5t - 3 = 3t - 5। हमारा लक्ष्य t वाले पदों को एक तरफ और संख्याओं को दूसरी तरफ लाना है।"
      },
      {
        step: 2,
        highlightedEquation: `5t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3t</span> - 3 = 3t <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3t</span> - 5`,
        explanation: "First, we subtract 3t from both sides to get the 't' terms on the left.",
        voice: "First, we subtract 3t from both sides to get the t terms on the left.",
        voice_hi: "पहले, हम t पदों को बाईं ओर लाने के लिए दोनों पक्षों से 3t घटाते हैं।"
      },
      {
        step: 3,
        highlightedEquation: `2t - 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 3</span> = -5 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 3</span>`,
        explanation: "This simplifies to 2t - 3 = -5. Now, we add 3 to both sides to isolate the t term.",
        voice: "This simplifies to 2t minus 3 equals negative 5. Now, we add 3 to both sides to isolate the t term.",
        voice_hi: "यह 2t - 3 = -5 हो जाता है। अब, t पद को अलग करने के लिए हम दोनों पक्षों में 3 जोड़ते हैं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>t / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = -2 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "This simplifies to 2t = -2. Finally, we divide both sides by 2 to solve for t.",
        voice: "This simplifies to 2t equals negative 2. Finally, we divide both sides by 2 to solve for t.",
        voice_hi: "यह 2t = -2 हो जाता है। अंत में, t का मान निकालने के लिए हम दोनों पक्षों को 2 से भाग देते हैं।"
      },
      {
        step: 5,
        highlightedEquation: `t = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-1</span>`,
        explanation: "After dividing both sides by 2, we get t = -1.",
        voice: "After dividing both sides by 2, we get t equals negative 1.",
        voice_hi: "दोनों पक्षों को 2 से भाग देने पर, हमें t = -1 मिलता है।"
      }
    ]
  },
  {
    questionNumber: 3,
    equation: "5x + 9 = 5 + 3x",
    answer: -2,
    options: [-1, -2, 2, 4],
    steps: [
      {
        step: 1,
        highlightedEquation: `5x + 9 = 5 + 3x`,
        explanation: "The equation to solve is 5x + 9 = 5 + 3x. Let's get all the 'x' terms on one side.",
        voice: "The equation to solve is 5x plus 9 equals 5 plus 3x. Let's get all the x terms on one side.",
        voice_hi: "समीकरण है 5x + 9 = 5 + 3x। हम सभी x पदों को एक तरफ लाते हैं।"
      },
      {
        step: 2,
        highlightedEquation: `5x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> + 9 = 5 + 3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span>`,
        explanation: "Subtract 3x from both sides to move the x terms to the left.",
        voice: "Subtract 3x from both sides to move the x terms to the left.",
        voice_hi: "x पदों को बाईं ओर ले जाने के लिए दोनों पक्षों से 3x घटाएं।"
      },
      {
        step: 3,
        highlightedEquation: `2x + 9 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 9</span> = 5 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 9</span>`,
        explanation: "This simplifies to 2x + 9 = 5. Now, subtract 9 from both sides.",
        voice: "This simplifies to 2x plus 9 equals 5. Now, subtract 9 from both sides.",
        voice_hi: "यह 2x + 9 = 5 हो जाता है। अब, 9 को दोनों पक्षों से घटाएं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = -4 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "This gives us 2x = -4. Now divide by 2 to find x.",
        voice: "This gives us 2x equals negative 4. Now divide by 2 to find x.",
        voice_hi: "यह 2x = -4 हो जाता है। अब x का मान निकालने के लिए 2 से भाग दें।"
      },
      {
        step: 5,
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-2</span>`,
        explanation: "The final answer is x = -2.",
        voice: "The final answer is x equals negative 2.",
        voice_hi: "अंतिम उत्तर x = -2 है।"
      }
    ]
  },
  {
    questionNumber: 4,
    equation: "4z + 3 = 6 + 2z",
    answer: 1.5,
    options: [1, 2, 1.5, 3],
    steps: [
      {
        step: 1,
        highlightedEquation: `4z + 3 = 6 + 2z`,
        explanation: "The equation to solve is 4z + 3 = 6 + 2z. We will subtract 2z from both sides first.",
        voice: "The equation to solve is 4z plus 3 equals 6 plus 2z. We will subtract 2z from both sides first.",
        voice_hi: "समीकरण है 4z + 3 = 6 + 2z। हम पहले दोनों पक्षों से 2z घटाएंगे।"
      },
      {
        step: 2,
        highlightedEquation: `4z <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2z</span> + 3 = 6 + 2z <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 2z</span>`,
        explanation: "Subtracting 2z from both sides gives us 2z + 3 = 6.",
        voice: "Subtracting 2z from both sides gives us 2z plus 3 equals 6.",
        voice_hi: "दोनों पक्षों से 2z घटाने पर हमें 2z + 3 = 6 मिलता है।"
      },
      {
        step: 3,
        highlightedEquation: `2z + 3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span> = 6 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3</span>`,
        explanation: "Now, subtract 3 from both sides to isolate the z term.",
        voice: "Now, subtract 3 from both sides to isolate the z term.",
        voice_hi: "अब, z पद को अलग करने के लिए दोनों पक्षों से 3 घटाएं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>z / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = 3 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>`,
        explanation: "This simplifies to 2z = 3. Finally, divide both sides by 2.",
        voice: "This simplifies to 2z equals 3. Finally, we divide both sides by 2.",
        voice_hi: "यह 2z = 3 हो जाता है। अंत में, दोनों पक्षों को 2 से भाग दें।"
      },
      {
        step: 5,
        highlightedEquation: `z = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">1.5</span>`,
        explanation: "The solution is z = 1.5.",
        voice: "The solution is z equals 1.5.",
        voice_hi: "हल z = 1.5 है।"
      }
    ]
  },
  {
    questionNumber: 5,
    equation: "2x - 1 = 14 - x",
    answer: 5,
    options: [3, 4, 5, 6],
    steps: [
      {
        step: 1,
        highlightedEquation: `2x - 1 = 14 - x`,
        explanation: "The equation to solve is 2x - 1 = 14 - x. We will start by adding x to both sides to get all the variables on one side.",
        voice: "The equation to solve is 2x minus 1 equals 14 minus x. We will start by adding x to both sides.",
        voice_hi: "समीकरण है 2x - 1 = 14 - x। हम सभी x पदों को एक तरफ लाने के लिए दोनों पक्षों में x जोड़ेंगे।"
      },
      {
        step: 2,
        highlightedEquation: `2x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ x</span> - 1 = 14 - x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ x</span>`,
        explanation: "After adding x to both sides, the equation becomes 3x - 1 = 14.",
        voice: "After adding x to both sides, the equation becomes 3x minus 1 equals 14.",
        voice_hi: "दोनों पक्षों में x जोड़ने के बाद, समीकरण 3x - 1 = 14 हो जाता है।"
      },
      {
        step: 3,
        highlightedEquation: `3x - 1 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 1</span> = 14 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 1</span>`,
        explanation: "Next, we add 1 to both sides to isolate the x term.",
        voice: "Next, we add 1 to both sides to isolate the x term.",
        voice_hi: "इसके बाद, x पद को अलग करने के लिए हम दोनों पक्षों में 1 जोड़ते हैं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span> = 15 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>`,
        explanation: "This simplifies to 3x = 15. Finally, we divide both sides by 3.",
        voice: "This simplifies to 3x equals 15. Finally, we divide both sides by 3.",
        voice_hi: "यह 3x = 15 हो जाता है। अंत में, हम x का मान निकालने के लिए दोनों पक्षों को 3 से भाग देते हैं।"
      },
      {
        step: 5,
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
        explanation: "The final answer is x = 5.",
        voice: "The final answer is x equals 5.",
        voice_hi: "अंतिम उत्तर x = 5 है।"
      }
    ]
  },
  {
    questionNumber: 6,
    equation: "8x + 4 = 3(x - 1) + 7",
    answer: 0,
    options: [0, 1, -1, 2],
    steps: [
      {
        step: 1,
        highlightedEquation: `8x + 4 = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3(x - 1)</span> + 7`,
        explanation: "The equation to solve is 8x + 4 = 3(x - 1) + 7. We'll start by distributing the 3 on the right side.",
        voice: "The equation to solve is 8x plus 4 equals 3 times the quantity of x minus 1, plus 7. We'll start by distributing the 3 on the right side.",
        voice_hi: "समीकरण है 8x + 4 = 3(x - 1) + 7। हम पहले दाहिनी ओर 3 को वितरित करके शुरू करेंगे।"
      },
      {
        step: 2,
        highlightedEquation: `8x + 4 = 3x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3 + 7</span>`,
        explanation: "After distributing, the right side becomes 3x - 3 + 7. We can combine the constant terms.",
        voice: "After distributing, the right side becomes 3x minus 3 plus 7. We can combine the constant terms.",
        voice_hi: "वितरित करने के बाद, दाहिनी ओर 3x - 3 + 7 हो जाता है। हम स्थिर पदों को जोड़ सकते हैं।"
      },
      {
        step: 3,
        highlightedEquation: `8x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span> = 3x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 3x</span>`,
        explanation: "The equation now is 8x + 4 = 3x + 4. Let's subtract 3x from both sides.",
        voice: "The equation now is 8x plus 4 equals 3x plus 4. Let's subtract 3x from both sides.",
        voice_hi: "समीकरण अब 8x + 4 = 3x + 4 है। हम दोनों पक्षों से 3x घटाते हैं।"
      },
      {
        step: 4,
        highlightedEquation: `5x + 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4</span> = 4 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4</span>`,
        explanation: "This simplifies to 5x + 4 = 4. Now subtract 4 from both sides.",
        voice: "This simplifies to 5x plus 4 equals 4. Now subtract 4 from both sides.",
        voice_hi: "यह 5x + 4 = 4 हो जाता है। अब दोनों पक्षों से 4 घटाएं।"
      },
      {
        step: 5,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span> = 0 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>`,
        explanation: "This gives us 5x = 0. Finally, divide both sides by 5.",
        voice: "This gives us 5x equals 0. Finally, divide both sides by 5.",
        voice_hi: "यह 5x = 0 हो जाता है। अंत में, दोनों पक्षों को 5 से भाग दें।"
      },
      {
        step: 6,
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">0</span>`,
        explanation: "The final answer is x = 0.",
        voice: "The final answer is x equals 0.",
        voice_hi: "अंतिम उत्तर x = 0 है।"
      }
    ]
  },
  {
    questionNumber: 7,
    equation: "x = (4/5)(x + 10)",
    answer: 40,
    options: [20, 30, 40, 50],
    steps: [
      {
        step: 1,
        highlightedEquation: `x = (4/5)(x + 10)`,
        explanation: "The equation to solve is x = (4/5)(x + 10). We can multiply both sides by 5 to remove the fraction.",
        voice: "The equation to solve is x equals 4 over 5 times the quantity of x plus 10. We can multiply both sides by 5 to remove the fraction.",
        voice_hi: "समीकरण है x = (4/5)(x + 10)। भिन्न को हटाने के लिए हम दोनों पक्षों को 5 से गुणा कर सकते हैं।"
      },
      {
        step: 2,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">5</span>x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">4(x + 10)</span>`,
        explanation: "This simplifies to 5x = 4(x + 10). Now we distribute the 4 on the right side.",
        voice: "This simplifies to 5x equals 4 times the quantity of x plus 10. Now we distribute the 4 on the right side.",
        voice_hi: "यह 5x = 4(x + 10) हो जाता है। अब हम दाहिनी ओर 4 को वितरित करते हैं।"
      },
      {
        step: 3,
        highlightedEquation: `5x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4x</span> = 4x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 4x</span> + 40`,
        explanation: "After distributing, the equation is 5x = 4x + 40. Subtract 4x from both sides.",
        voice: "After distributing, the equation is 5x equals 4x plus 40. Subtract 4x from both sides.",
        voice_hi: "वितरित करने के बाद, समीकरण 5x = 4x + 40 हो जाता है। दोनों पक्षों से 4x घटाएं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">x</span> = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">40</span>`,
        explanation: "This gives us our final answer, x = 40.",
        voice: "This gives us our final answer, x equals 40.",
        voice_hi: "इससे हमें हमारा अंतिम उत्तर, x = 40 मिलता है।"
      }
    ]
  },
  {
    questionNumber: 8,
    equation: "2x/3 + 1 = 7x/15 + 3",
    answer: 10,
    options: [5, 10, 15, 20],
    steps: [
      {
        step: 1,
        highlightedEquation: `2x/3 + 1 = 7x/15 + 3`,
        explanation: "The equation is 2x/3 + 1 = 7x/15 + 3. The least common multiple of the denominators 3 and 15 is 15. We will multiply both sides by 15.",
        voice: "The equation is 2x over 3 plus 1 equals 7x over 15 plus 3. The lowest common multiple of the denominators is 15. We will multiply both sides by 15.",
        voice_hi: "समीकरण है 2x/3 + 1 = 7x/15 + 3। हर 3 और 15 का लघुत्तम समापवर्त्य 15 है। हम दोनों पक्षों को 15 से गुणा करेंगे।"
      },
      {
        step: 2,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15</span>(2x/3 + 1) = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">15</span>(7x/15 + 3)`,
        explanation: "After multiplying, this simplifies to 10x + 15 = 7x + 45.",
        voice: "After multiplying, this simplifies to 10x plus 15 equals 7x plus 45.",
        voice_hi: "गुणा करने के बाद, यह 10x + 15 = 7x + 45 हो जाता है।"
      },
      {
        step: 3,
        highlightedEquation: `10x <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 7x</span> + 15 = 45`,
        explanation: "Subtract 7x from both sides. Then subtract 15 from both sides.",
        voice: "Subtract 7x from both sides. Then subtract 15 from both sides.",
        voice_hi: "दोनों पक्षों से 7x घटाएं। फिर दोनों पक्षों से 15 घटाएं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>x / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span> = 30 / <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>`,
        explanation: "This gives us 3x = 30. Finally, divide both sides by 3.",
        voice: "This gives us 3x equals 30. Finally, we divide both sides by 3.",
        voice_hi: "इससे हमें 3x = 30 मिलता है। अंत में, दोनों पक्षों को 3 से भाग दें।"
      },
      {
        step: 5,
        highlightedEquation: `x = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">10</span>`,
        explanation: "The solution is x = 10.",
        voice: "The solution is x equals 10.",
        voice_hi: "हल x = 10 है।"
      }
    ]
  },
  {
    questionNumber: 9,
    equation: "2y + 5/3 = 26/3 - y",
    answer: "7/3",
    options: [2, "7/3", 3, "2/3"],
    steps: [
      {
        step: 1,
        highlightedEquation: `2y + 5/3 = 26/3 - y`,
        explanation: "The equation is 2y + 5/3 = 26/3 - y. Let's start by getting all the y terms on the left.",
        voice: "The equation is 2y plus 5 over 3 equals 26 over 3 minus y. Let's start by getting all the y terms on the left.",
        voice_hi: "समीकरण है 2y + 5/3 = 26/3 - y। हम सभी y पदों को बाईं ओर लाने के लिए शुरू करते हैं।"
      },
      {
        step: 2,
        highlightedEquation: `2y <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ y</span> + 5/3 = 26/3 - y <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ y</span>`,
        explanation: "Add y to both sides, which simplifies to 3y + 5/3 = 26/3.",
        voice: "Add y to both sides, which simplifies to 3y plus 5 over 3 equals 26 over 3.",
        voice_hi: "दोनों पक्षों में y जोड़ने पर, यह 3y + 5/3 = 26/3 हो जाता है।"
      },
      {
        step: 3,
        highlightedEquation: `3y = 26/3 <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5/3</span>`,
        explanation: "Subtract 5/3 from both sides. The fractions have a common denominator, so we can subtract the numerators.",
        voice: "Subtract 5 over 3 from both sides. The fractions have a common denominator, so we can subtract the numerators.",
        voice_hi: "दोनों पक्षों से 5/3 घटाएं। भिन्न का हर समान है, इसलिए हम अंशों को घटा सकते हैं।"
      },
      {
        step: 4,
        highlightedEquation: `<span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>y = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">21/3</span>`,
        explanation: "This simplifies to 3y = 7. Finally, divide both sides by 3.",
        voice: "This simplifies to 3y equals 7. Finally, divide both sides by 3.",
        voice_hi: "यह 3y = 7 हो जाता है। अंत में, दोनों पक्षों को 3 से भाग दें।"
      },
      {
        step: 5,
        highlightedEquation: `y = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7/3</span>`,
        explanation: "The solution is y = 7/3.",
        voice: "The solution is y equals 7 over 3.",
        voice_hi: "हल y = 7/3 है।"
      }
    ]
  },
  {
    questionNumber: 10,
    equation: "3m = 5m - 8/5",
    answer: "4/5",
    options: ["2/5", "4/5", "8/5", 1],
    steps: [
      {
        step: 1,
        highlightedEquation: `3m = 5m - 8/5`,
        explanation: "The equation is 3m = 5m - 8/5. To get all the m terms on the same side, we can subtract 5m from both sides.",
        voice: "The equation is 3m equals 5m minus 8 over 5. We can subtract 5m from both sides.",
        voice_hi: "समीकरण है 3m = 5m - 8/5। सभी m पदों को एक ही तरफ लाने के लिए, हम दोनों पक्षों से 5m घटा सकते हैं।"
      },
      {
        step: 2,
        highlightedEquation: `3m <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5m</span> = 5m <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5m</span> - 8/5`,
        explanation: "This simplifies to -2m = -8/5. Now, we can divide both sides by -2 to solve for m.",
        voice: "This simplifies to negative 2m equals negative 8 over 5. Now, we can divide both sides by negative 2 to solve for m.",
        voice_hi: "यह -2m = -8/5 हो जाता है। अब, m का मान निकालने के लिए हम दोनों पक्षों को -2 से भाग दे सकते हैं।"
      },
      {
        step: 3,
        highlightedEquation: `m = (-8/5) <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">/ (-2)</span>`,
        explanation: "Dividing by -2 is the same as multiplying by -1/2. The two negatives cancel out.",
        voice: "Dividing by negative 2 is the same as multiplying by negative 1 over 2. The two negatives cancel out.",
        voice_hi: "-2 से भाग देना -1/2 से गुणा करने के समान है। दोनों नकारात्मक चिह्न रद्द हो जाते हैं।"
      },
      {
        step: 4,
        highlightedEquation: `m = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">8/10</span>`,
        explanation: "This simplifies to m = 8/10, which can be further reduced.",
        voice: "This simplifies to m equals 8 over 10, which can be further reduced.",
        voice_hi: "यह m = 8/10 हो जाता है, जिसे और सरल किया जा सकता है।"
      },
      {
        step: 5,
        highlightedEquation: `m = <span class="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">4/5</span>`,
        explanation: "The final answer is m = 4/5.",
        voice: "The final answer is m equals 4 over 5.",
        voice_hi: "अंतिम उत्तर m = 4/5 है।"
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
    const currentQuestion = questions[nextIndex];
    const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
    const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
    speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
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
    const currentQuestion = questions[index];
    const introText = currentLanguage === 'hi' ? translations.hi.solveEquationIntro : translations.en.solveEquationIntro;
    const findXText = currentLanguage === 'hi' ? translations.hi.findX : translations.en.findX;
    speakMessage(`${introText} ${currentQuestion.equation}. ${findXText}`);
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
    const { highlightedEquation, explanation, explanation_hi } = stepData;
    const explanationText = currentLanguage === 'hi' ? explanation_hi : explanation;
    
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

    if (mode === 'initial') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-auto border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className={`text-lg sm:text-2xl font-semibold px-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Welcome to the interactive equation solver. Click on the button below to begin the practice session.</p>
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
          {equationStep > currentQuestion.steps.length && renderVerification()}
        </div>
        {equationStep < currentQuestion.steps.length + 1 && (
          <button
            onClick={() => handleEquationStep(equationStep + 1)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4"
          >
            {t('continue')}
          </button>
        )}
        {equationStep >= currentQuestion.steps.length + 1 && (
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
        <p className={`font-mono text-sm sm:text-base text-left whitespace-pre-wrap ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
          {t('originalEquation')} <span className="font-bold">{originalEquation}</span><br />
          {t('substitute')} <span className="font-bold">{answer}</span>:<br />
          <span className="font-bold">{verificationEquation}</span><br />
          <span className="font-bold">{t('perfect')}</span>
        </p>
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