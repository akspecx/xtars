# Design Consistency Guide for Kids Learning Modules

## Overview
This guide ensures all educational modules maintain consistent design patterns, accessibility features, and user experience across the entire application.

## ✅ Required Features for All Modules

### 1. Global Settings Integration

**Import the hook:**
```typescript
import { useGameModule } from '../../../../../hooks/useGameModule';
```

**Use in component:**
```typescript
const YourModule: React.FC = () => {
  const { 
    speak,                    // Global speech synthesis
    playSuccessSound,         // Success sound effect
    playErrorSound,           // Error sound effect
    playClickSound,           // Click sound effect
    playCelebrationSound,     // Celebration sound effect
    announce,                 // Screen reader announcements
    isDarkMode,               // Dark mode state
    isHighContrastMode,       // High contrast mode state
    fontSize                  // Font size setting
  } = useGameModule();
  
  // Rest of your component logic
};
```

### 2. Speech Synthesis (Replace Local Implementation)

**❌ OLD WAY (Don't do this):**
```typescript
const [isSpeaking, setIsSpeaking] = useState(false);

const speak = useCallback((text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    utterance.volume = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }
}, [isSpeaking]);
```

**✅ NEW WAY (Do this):**
```typescript
const { speak } = useGameModule();

// Just use it directly - all settings are handled globally
speak('Your message here');
```

### 3. Sound Effects

Add sound effects to enhance user feedback:

```typescript
const { playClickSound, playSuccessSound, playErrorSound, playCelebrationSound } = useGameModule();

// On button click
const handleClick = () => {
  playClickSound();
  // ... your logic
};

// On correct answer
const handleCorrect = () => {
  playSuccessSound();
  speak('Correct!');
  // ... your logic
};

// On wrong answer
const handleError = () => {
  playErrorSound();
  speak('Try again!');
  // ... your logic
};

// On game completion
const handleComplete = () => {
  playCelebrationSound();
  speak('Amazing! You completed the game!');
  // ... your logic
};
```

### 4. Dark Mode Support

**Add dark mode classes to all major elements:**

```typescript
// Container
<div className="bg-white dark:bg-gray-800">

// Text
<h1 className="text-gray-900 dark:text-white">

// Borders
<div className="border-gray-200 dark:border-gray-700">

// Backgrounds
<div className="bg-gray-50 dark:bg-gray-700">

// Gradients (use opacity for dark mode)
<div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600">
```

### 5. Accessibility Features

#### A. ARIA Labels

**Add to all interactive elements:**
```typescript
<button
  onClick={handleClick}
  aria-label="Descriptive action name"
  role="button"
>
  Click me
</button>

// For images/emojis
<span role="img" aria-label="description">🎉</span>

// For status updates
<div role="status" aria-live="polite">
  Score: {score}
</div>

// For important alerts
<div role="alert" aria-live="assertive">
  Congratulations!
</div>
```

#### B. Keyboard Navigation

**Add focus styles and tabIndex:**
```typescript
<button
  className="... focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2"
  tabIndex={0}
>
  Interactive Element
</button>

// For groups of items
<div role="group" aria-label="Items to select">
  {items.map((item, index) => (
    <button
      key={index}
      tabIndex={0}
      aria-label={`Item ${index + 1} of ${items.length}`}
    >
      {item}
    </button>
  ))}
</div>
```

#### C. Screen Reader Announcements

**Use the announce function for important updates:**
```typescript
const { announce } = useGameModule();

// Polite announcement (doesn't interrupt)
announce('3 items remaining', 'polite');

// Assertive announcement (interrupts current speech)
announce('Congratulations! You won!', 'assertive');
```

### 6. Touch Support for Mobile

**All drag-and-drop must support touch:**

```typescript
const [draggedItem, setDraggedItem] = useState<any>(null);

// Drag handlers
const handleDragStart = (e: React.DragEvent, item: any) => {
  e.dataTransfer.effectAllowed = 'move';
  setDraggedItem(item);
};

const handleTouchStart = (e: React.TouchEvent, item: any) => {
  setDraggedItem(item);
  e.preventDefault();
};

// Drop handlers
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  if (draggedItem) {
    // Process drop
  }
  setDraggedItem(null);
};

const handleTouchEnd = (e: React.TouchEvent) => {
  if (draggedItem) {
    // Process drop
  }
  setDraggedItem(null);
  e.preventDefault();
};

// Apply to element
<div
  draggable
  onDragStart={(e) => handleDragStart(e, item)}
  onTouchStart={(e) => handleTouchStart(e, item)}
  onDragEnd={() => setDraggedItem(null)}
  onTouchEnd={(e) => handleTouchEnd(e)}
>
  Draggable Item
</div>
```

### 7. Responsive Design

**Use Tailwind responsive classes:**

```typescript
<div className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
  p-4 sm:p-6 md:p-8
  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
  gap-2 sm:gap-3 md:gap-4
">
  Content
</div>
```

### 8. Progress Tracking

**Always show progress and score:**

```typescript
<div className="flex justify-center gap-4 mb-6">
  {/* Score */}
  <div 
    className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg"
    role="status"
    aria-live="polite"
  >
    <span aria-label={`Score: ${score}`}>Score: {score}</span>
  </div>
  
  {/* Attempts */}
  <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
    Attempts: {attempts}
  </div>
</div>
```

### 9. Feedback and Animations

**Provide immediate visual feedback:**

```typescript
// Success state
{showSuccess && (
  <div 
    className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"
    role="alert"
    aria-live="assertive"
  >
    <div className="text-6xl mb-2" role="img" aria-label="celebration">🎉</div>
    <div className="text-3xl font-extrabold text-white">
      Perfect! Great job!
    </div>
  </div>
)}

// Error state
{showError && (
  <div className="text-center p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
    <div className="text-xl font-bold text-white">Try again!</div>
  </div>
)}
```

### 10. Consistent Button Styles

**Use these standard button patterns:**

```typescript
// Primary action button
<button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2">
  Start Game
</button>

// Secondary action button
<button className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
  Instructions
</button>

// Reset button
<button className="px-4 py-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-md active:scale-95 transition-transform">
  Reset
</button>
```

## 📋 Checklist for Module Updates

Use this checklist when updating or creating modules:

- [ ] Import and use `useGameModule` hook
- [ ] Replace local speech synthesis with global `speak` function
- [ ] Add sound effects (click, success, error, celebration)
- [ ] Add dark mode support to all elements
- [ ] Add ARIA labels to all interactive elements
- [ ] Add `role` attributes where appropriate
- [ ] Add `aria-live` regions for dynamic content
- [ ] Add keyboard navigation support (tabIndex, focus styles)
- [ ] Add touch support for drag-and-drop
- [ ] Use responsive Tailwind classes
- [ ] Show progress/score with proper ARIA labels
- [ ] Provide immediate feedback for all actions
- [ ] Use consistent button styles
- [ ] Test with keyboard navigation
- [ ] Test with screen reader
- [ ] Test on mobile devices

## 🎯 Example: Complete Module Template

```typescript
import React, { useState } from 'react';
import { useGameModule } from '../../../../../hooks/useGameModule';

const ExampleModule: React.FC = () => {
  const { 
    speak, 
    playSuccessSound, 
    playErrorSound, 
    playClickSound,
    playCelebrationSound,
    announce 
  } = useGameModule();
  
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    playClickSound();
    
    if (isCorrect) {
      playSuccessSound();
      speak('Correct! Great job!');
      announce('Correct answer', 'assertive');
      setScore(prev => prev + 1);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        // Move to next question
      }, 2000);
    } else {
      playErrorSound();
      speak('Try again!');
      announce('Incorrect, try again', 'polite');
    }
  };

  const handlePlayInstructions = () => {
    playClickSound();
    speak('Welcome to the game! Select the correct answer.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4" role="main">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-400">
            Example Module
          </h1>
          <button
            onClick={handlePlayInstructions}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Play instructions"
          >
            <span role="img" aria-label="speaker">🔊</span> Instructions
          </button>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg"
            role="status"
            aria-live="polite"
          >
            <span aria-label={`Score: ${score}`}>Score: {score}</span>
          </div>
        </div>

        {/* Game Content */}
        <div className="mb-6">
          {/* Your game content here */}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div 
            className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"
            role="alert"
            aria-live="assertive"
          >
            <div className="text-6xl mb-2" role="img" aria-label="celebration">🎉</div>
            <div className="text-3xl font-extrabold text-white">
              Perfect! Great job!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleModule;
```

## 🔧 Global Settings

Users can now access global settings via the gear icon in the top-right corner:

- **Dark Mode**: Toggle dark/light theme
- **High Contrast**: Enhanced visibility
- **Font Size**: Small, Medium, Large
- **Sound Effects**: Enable/disable game sounds
- **Background Music**: Enable/disable ambient music
- **Volume**: Master volume control
- **Voice Instructions**: Enable/disable speech synthesis
- **Speech Speed**: Adjust speech rate
- **Speech Pitch**: Adjust voice pitch

All modules automatically respect these settings when using the `useGameModule` hook.

## 📱 Testing Checklist

Before marking a module as complete:

1. **Desktop Testing**
   - [ ] Works in Chrome, Firefox, Safari
   - [ ] Keyboard navigation works
   - [ ] Focus indicators visible
   - [ ] Dark mode works correctly

2. **Mobile Testing**
   - [ ] Touch interactions work
   - [ ] Drag-and-drop works on touch screens
   - [ ] Responsive layout looks good
   - [ ] Text is readable

3. **Accessibility Testing**
   - [ ] Screen reader announces all important updates
   - [ ] All images have alt text or aria-labels
   - [ ] Color contrast meets WCAG AA standards
   - [ ] Can complete game using only keyboard

4. **Settings Integration**
   - [ ] Speech synthesis uses global settings
   - [ ] Sound effects respect volume settings
   - [ ] Dark mode works throughout module
   - [ ] Font size changes are applied

## 🚀 Next Steps

1. Update all existing modules to follow these patterns
2. Test each module with the checklist
3. Document any module-specific considerations
4. Create automated tests for consistency

---

**Remember**: Consistency creates a better learning experience for children. Every module should feel familiar while being unique in content!

