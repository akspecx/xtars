import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronDown, ArrowRight } from 'lucide-react'; // Using ArrowRight for Vinnie's left perspective

// Helper Components defined outside the main component for proper scope and readability

// Empty Box Component
const EmptyBox = ({ isHighlighted = false }) => (
  <div className={`w-14 h-20 md:w-32 md:h-40 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg relative border-2 ${isHighlighted ? 'border-yellow-400 dark:border-yellow-500 animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center transition-all duration-300`}>
    <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-semibold">Empty Space</span>
  </div>
);

// Simple Character Image components (for placeholders and inside boxes)
const AnnieImage = () => (
  <div className="w-10 h-10 bg-pink-400 dark:bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">A</div>
);

const VinnieImage = () => (
  <div className="w-10 h-10 bg-purple-400 dark:bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">V</div>
);

// Reusable Character Component (for characters in the boxes)
const CharacterComponent = ({ name, ImageComponent, colorTheme, isHighlighted = false, isReferenceCharacter = false, currentHighlightState }) => {
  // Determine if the persistent red border should be shown
  const showRedBorder = isReferenceCharacter && (currentHighlightState === 'vinnie-placed' || currentHighlightState === 'empty-box-highlight' || currentHighlightState === 'annie-highlight' || currentHighlightState === 'final-review' || currentHighlightState === 'annie-placeholder-and-box');

  // Determine if the yellow pulse highlight should be shown
  const showYellowPulse = isHighlighted;

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative">
        <ImageComponent />
        {/* Yellow pulse highlight (for current step) */}
        {showYellowPulse && (
          <div className="absolute -inset-2 border-3 border-yellow-400 dark:border-yellow-500 rounded-xl animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30"></div>
        )}
         {/* Persistent red border for reference character */}
         {showRedBorder && !showYellowPulse && (
           <div className="absolute -inset-2 border-3 border-red-500 dark:border-red-400 rounded-xl"></div>
         )}
      </div>
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')} ${showRedBorder ? 'text-red-700 dark:text-red-400' : (showYellowPulse ? 'text-yellow-600 dark:text-yellow-400' : '')}`}>
        {name}
      </h3>
    </div>
  );
};

// Character Placeholder Component (for top row before placement)
const CharacterPlaceholder = ({ name, ImageComponent, colorTheme, isHighlighted = false }) => (
  <div className="flex flex-col items-center relative">
    <div className="relative">
      <ImageComponent />
      {isHighlighted && (
        <div className="absolute -inset-2 border-3 border-yellow-400 dark:border-yellow-500 rounded-xl animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30"></div>
      )}
    </div>
    <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')} ${isHighlighted ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
      {name}
    </h3>
  </div>
);

// Position Indicator Component - uses ArrowRight for 'to the left' (Vinnie's perspective)
const PositionIndicator = ({ position, isActive = false }) => (
  <div className={`flex flex-col items-center mx-0.5 md:mx-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
    <div className="flex items-center gap-0.5 md:gap-2">
      <div className="w-3 h-0.5 md:w-8 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
      <ArrowRight size={8} className="md:w-4 md:h-4 text-purple-500 dark:text-purple-400" />
    </div>
    <div className="text-xs md:text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">{position}</div>
  </div>
);


const SeatingArrangementSecondToLeft = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  // currentHighlight can be:
  // 'initial-setup': before any action
  // 'vinnie-placeholder': Vinnie in top placeholder
  // 'vinnie-placed': Vinnie in box, as reference (red border)
  // 'empty-box-highlight': Middle empty box highlighted (yellow pulse)
  // 'annie-placeholder': Annie in top placeholder
  // 'annie-placeholder-and-box': Annie in top placeholder AND target box highlighted
  // 'annie-highlight': Annie in box, highlighted (yellow pulse)
  // 'final-review': All elements in final state (Annie yellow, Vinnie red, indicators active)
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null); // To store setTimeout IDs for clearing
  const currentSegmentIndex = useRef(0); // Tracks which segment of speech is currently active

  // State to manage character positions in the boxes
  // null: empty, 'vinnie': Vinnie is here, 'annie': Annie is here
  const [boxContent, setBoxContent] = useState([null, null, null]); // [Vinnie, Empty, Annie] -> [index 0, index 1, index 2]
  // State to track if characters are in their top placeholders
  const [annieInPlaceholder, setAnnieInPlaceholder] = useState(true);
  const [vinnieInPlaceholder, setVinnieInPlaceholder] = useState(true);

  // Define the speech sequence with text, associated highlight, and an action to perform after speaking
  const speechSequence = [
    {
      text: {
        'en-US': "Welcome! Today we're learning about 'second to the left'. Annie is second to the left of Vinnie.",
        'en-GB': "Welcome! Today we're learning about 'second to the left'. Annie is second to the left of Vinnie.",
        'es-ES': "¡Bienvenidos! Hoy aprenderemos sobre la \"segunda posición a la izquierda\". Annie está segunda a la izquierda de Vinnie.",
        'fr-FR': "Bienvenue ! Aujourd'hui, nous allons apprendre la \"deuxième position à gauche\". Annie est deuxième à gauche de Vinnie.",
        'de-DE': "Willkommen! Heute lernen wir die \"zweite Position links\". Annie ist die zweite links von Vinnie.",
        'it-IT': "Benvenuti! Oggi impareremo la \"seconda posizione a sinistra\". Annie è seconda a sinistra di Vinnie.",
        'pt-BR': "Bem-vindos! Hoje vamos aprender sobre a \"segunda posição à esquerda\". Annie está em segundo à esquerda de Vinnie.",
        'ru-RU': "Добро пожаловать! Сегодня мы изучаем \"второе место слева\". Энни находится на втором месте слева от Винни.",
        'ja-JP': "ようこそ！今日は「左から2番目」について学びます。アニーはビニーの左から2番目です。",
        'ko-KR': "환영합니다! 오늘은 '왼쪽에서 두 번째'에 대해 배웁니다. 애니는 비니의 왼쪽에서 두 번째입니다.",
        'zh-CN': "欢迎！今天我们学习“左边第二个”。安妮在维尼的左边第二个。",
        'hi-IN': "स्वागत है! आज हम 'बाईं ओर दूसरा' सीखेंगे। एनी विन्नी के बाईं ओर दूसरी है।",
        'ar-SA': "أهلاً بك! اليوم سنتعلم عن \"الموضع الثاني إلى اليسار\". آني هي الثانية إلى يسار فيني.",
      },
      action: 'initial-setup', // Sets up the initial state
      highlight: null // No specific highlight on characters/boxes initially
    },
    {
      text: {
        'en-US': "First, let's place Vinnie, our reference point, on this chair.",
        'en-GB': "First, let's place Vinnie, our reference point, on this chair.",
        'es-ES': "Primero, coloquemos a Vinnie, nuestro punto de referencia, en esta silla.",
        'fr-FR': "Tout d'abord, plaçons Vinnie, notre point de référence, sur cette chaise.",
        'de-DE': "Zuerst platzieren wir Vinnie, unseren Bezugspunkt, auf diesen Stuhl.",
        'it-IT': "Per prima cosa, posizioniamo Vinnie, il nostro punto di riferimento, su questa sedia.",
        'pt-BR': "Primeiro, vamos colocar Vinnie, nosso ponto de referência, nesta cadeira.",
        'ru-RU': "Сначала поместим Винни, нашу точку отсчета, на этот стул.",
        'ja-JP': "まず、基準点であるビニーをこの椅子に配置しましょう。",
        'ko-KR': "먼저 기준점인 비니를 이 의자에 놓겠습니다.",
        'zh-CN': "首先，让我们把维尼，我们的参考点，放到这个椅子上。",
        'hi-IN': "सबसे पहले, विन्नी, हमारा संदर्भ बिंदु, को इस कुर्सी पर रखें।",
        'ar-SA': "أولاً، دعنا نضع فيني، نقطة مرجعنا، على هذا الكرسي.",
      },
      action: 'place-vinnie', // Moves Vinnie from placeholder to box
      highlight: 'vinnie-placeholder', // Highlight Vinnie in top row before moving
      delayAfter: 1000 // Short delay before Vinnie moves
    },
    {
      text: {
        'en-US': "Now, let's identify the positions to Vinnie's left. Counting from Vinnie -",
        'en-GB': "Now, let's identify the positions to Vinnie's left. Counting from Vinnie -",
        'es-ES': "Ahora, identifiquemos las posiciones a la izquierda de Vinnie. Contando desde Vinnie -",
        'fr-FR': "Maintenant, identifions les positions à la gauche de Vinnie. En comptant à partir de Vinnie -",
        'de-DE': "Nun identifizieren wir die Positionen links von Vinnie. Von Vinnie aus gezählt -",
        'it-IT': "Ora, identifichiamo le posizioni a sinistra di Vinnie. Contando da Vinnie -",
        'pt-BR': "Agora, vamos identificar as posições à esquerda de Vinnie. Contando a partir de Vinnie -",
        'ru-RU': "Теперь определим позиции слева от Винни. Считая от Винни -",
        'ja-JP': "次に、ビニーの左側の位置を確認します。ビニーから数えて -",
        'ko-KR': "이제 비니의 왼쪽 위치를 확인해 봅시다. 비니부터 세어서 -",
        'zh-CN': "现在，让我们确定维尼左边的位置。从维尼开始数 -",
        'hi-IN': "अब, विन्नी के बाईं ओर की स्थिति पहचानें। विन्नी से गिनकर -",
        'ar-SA': "الآن، دعنا نحدد المواقع إلى يسار فيني. بدءاً من فيني -",
      },
      action: 'start-left-steps', // Vinnie is placed, now prepare for steps
      highlight: 'vinnie-placed', // Vinnie in box, red border active
      delayAfter: 1000 // Pause before next step narration
    },
    {
      text: {
        'en-US': 'First to the left is this empty space.',
        'en-GB': 'First to the left is this empty space.',
        'es-ES': 'Primera a la izquierda es este espacio vacío.',
        'fr-FR': 'La première à gauche est cet espace vide.',
        'de-DE': 'Die erste links ist dieser leere Platz.',
        'it-IT': 'La prima a sinistra è questo spazio vuoto.',
        'pt-BR': 'A primeira à esquerda é este espaço vazio.',
        'ru-RU': 'Первое место слева — это пустое пространство.',
        'ja-JP': '左から1番目は空のスペースです。',
        'ko-KR': '왼쪽 첫 번째는 이 빈 공간입니다.',
        'zh-CN': '左边第一个是这个空位。',
        'hi-IN': 'बाईं ओर पहली यह खाली जगह है।',
        'ar-SA': 'الموضع الأول إلى اليسار هو هذا الفراغ.',
      },
      action: 'highlight-empty-step', // Highlight empty box and 1st indicator
      highlight: 'empty-box-highlight',
      delayAfter: 2000, // Pause after this step
    },
    {
      text: {
        'en-US': 'And second to the left is where Annie belongs.',
        'en-GB': 'And second to the left is where Annie belongs.',
        'es-ES': 'Y segunda a la izquierda es donde pertenece Annie.',
        'fr-FR': 'Et la deuxième à gauche est l\'endroit où Annie doit être.',
        'de-DE': 'Und die zweite links ist, wo Annie hingehört.',
        'it-IT': 'E la seconda a sinistra è dove Annie si trova.',
        'pt-BR': 'E a segunda à esquerda é onde Annie pertence.',
        'ru-RU': 'И второе место слева — это то место, где находится Энни.',
        'ja-JP': 'そして左から2番目はアニーがいる場所です。',
        'ko-KR': '그리고 왼쪽 두 번째는 애니가 있는 곳입니다.',
        'zh-CN': '左边第二个是安妮所在的位置。',
        'hi-IN': 'और बाईं ओर दूसरी वह जगह है जहाँ एनी है।',
        'ar-SA': 'والموضع الثاني إلى اليسار هو حيث تنتمي آني.',
      },
      action: 'highlight-annie-step', // Highlight Annie placeholder AND target box
      highlight: 'annie-placeholder-and-box',
      delayAfter: 2000, // Pause after this step before placing Annie
    },
    {
      text: {
        'en-US': 'Here is Annie, sitting second to the left of Vinnie.',
        'en-GB': 'Here is Annie, sitting second to the left of Vinnie.',
        'es-ES': 'Aquí está Annie, sentada segunda a la izquierda de Vinnie.',
        'fr-FR': 'Voici Annie, assise deuxième à gauche de Vinnie.',
        'de-DE': 'Hier ist Annie, die zweite links von Vinnie sitzend.',
        'it-IT': 'Ecco Annie, seduta seconda a sinistra di Vinnie.',
        'pt-BR': 'Aqui está Annie, sentada em segundo à esquerda de Vinnie.',
        'ru-RU': 'Вот Энни, сидящая на втором месте слева от Винни.',
        'ja-JP': 'これで、アニーは確かにビニーの左から2番目になります。',
        'ko-KR': '따라서 애니는 비니의 왼쪽에서 두 번째가 맞습니다.',
        'zh-CN': '所以，安妮确实在维尼的左边第二个。',
        'hi-IN': 'तो, एनी वास्तव में विन्नी के बाईं ओर दूसरी है।',
        'ar-SA': 'إذن، آني هي بالفعل الثانية إلى يسار فيني.',
      },
      action: 'place-annie', // Moves Annie
      highlight: 'annie-highlight', // Highlight Annie's box after placement
      delayAfter: 1000, // Short delay after Annie moves
    },
    {
      text: {
        'en-US': 'So, Annie is second to the left of Vinnie.',
        'en-GB': 'So, Annie is second to the left of Vinnie.',
        'es-ES': 'Así que, Annie está de hecho segunda a la izquierda de Vinnie.',
        'fr-FR': 'Donc, Annie est bien deuxième à gauche de Vinnie.',
        'de-DE': 'Also ist Annie tatsächlich die zweite links von Vinnie.',
        'it-IT': 'Quindi, Annie è effettivamente seconda a sinistra di Vinnie.',
        'pt-BR': 'Então, Annie está de fato em segundo à esquerda de Vinnie.',
        'ru-RU': 'Итак, Энни действительно находится на втором месте слева от Винни.',
        'ja-JP': 'これで、アニーは確かにビニーの左から2番目になります。',
        'ko-KR': '따라서 애니는 비니의 왼쪽에서 두 번째가 맞습니다.',
        'zh-CN': '所以，安妮确实在维尼的左边第二个。',
        'hi-IN': 'तो, एनी वास्तव में विन्नी के बाईं ओर दूसरी है।',
        'ar-SA': 'إذن، آني هي بالفعل الثانية إلى يسار فيني.',
      },
      action: 'final-review', // Final highlight of Annie and Vinnie, and both indicators
      highlight: 'final-review', // Special highlight state for final review
    },
  ];

  const languages = [
    {
      code: 'en-US',
      name: 'English (US)',
      message: 'Welcome! Today we\'re learning about \'second to the left\'. Annie is second to the left of Vinnie. First, let\'s place Vinnie, our reference point, on this chair. Now, let\'s identify the positions to Vinnie\'s left. Counting from Vinnie - First to the left is this empty space. And second to the left is where Annie belongs. Here is Annie, sitting second to the left of Vinnie. So, Annie is second to the left of Vinnie.'
    },
    {
    code: 'en-GB',
    name: 'English (UK)',
    message: 'Welcome! Today we\'re learning about \'second to the left\'. Annie is second to the left of Vinnie. First, let\'s place Vinnie, our reference point, on this chair. Now, let\'s identify the positions to Vinnie\'s left. Counting from Vinnie - First to the left is this empty space. And second to the left is where Annie belongs. Here is Annie, sitting second to the left of Vinnie. So, Annie is indeed second to the left of Vinnie.'
    },
    {
      code: 'es-ES',
      name: 'Spanish',
      message: '¡Bienvenidos! Hoy aprenderemos sobre la "segunda posición a la izquierda". Annie está segunda a la izquierda de Vinnie. Primero, coloquemos a Vinnie, nuestro punto de referencia, en esta silla. Ahora, identifiquemos las posiciones a la izquierda de Vinnie. Contando desde Vinnie - Primera a la izquierda es este espacio vacío. Y segunda a la izquierda es donde pertenece Annie. Aquí está Annie, sentada segunda a la izquierda de Vinnie. Así que, Annie está de hecho segunda a la izquierda de Vinnie.'
    },
    {
      code: 'fr-FR',
      name: 'French',
      message: 'Bienvenue ! Aujourd\'hui, nous allons apprendre la "deuxième position à gauche". Annie est deuxième à gauche de Vinnie. Tout d\'abord, plaçons Vinnie, notre point de référence, sur cette chaise. Maintenant, identifions les positions à la gauche de Vinnie. En comptant à partir de Vinnie - La première à gauche est cet espace vide. Et la deuxième à gauche est l\'endroit où Annie doit être. Voici Annie, assise deuxième à gauche de Vinnie. Donc, Annie est bien deuxième à gauche de Vinnie.'
    },
    {
      code: 'de-DE',
      message: 'Willkommen! Heute lernen wir die "zweite Position links". Annie ist die zweite links von Vinnie. Zuerst platzieren wir Vinnie, unseren Bezugspunkt, auf diesen Stuhl. Nun identifizieren wir die Positionen links von Vinnie. Von Vinnie aus gezählt - Die erste links ist dieser leere Platz. Und die zweite links ist, wo Annie hingehört. Hier ist Annie, die zweite links von Vinnie sitzend. Also ist Annie tatsächlich die zweite links von Vinnie.'
    },
    {
      code: 'it-IT',
      message: 'Benvenuti! Oggi impareremo la "seconda posizione a sinistra". Annie è seconda a sinistra di Vinnie. Per prima cosa, posizioniamo Vinnie, il nostro punto di riferimento, su questa sedia. Ora, identifichiamo le posizioni a sinistra di Vinnie. Contando da Vinnie - La prima a sinistra è questo spazio vuoto. E la seconda a sinistra è dove Annie si trova. Ecco Annie, seduta seconda a sinistra di Vinnie. Quindi, Annie è effettivamente seconda a sinistra di Vinnie.'
    },
    {
      code: 'pt-BR',
      message: 'Bem-vindos! Hoje vamos aprender sobre a "segunda posição à esquerda". Annie está em segundo à esquerda de Vinnie. Primeiro, vamos colocar Vinnie, nosso ponto de referência, nesta cadeira. Agora, vamos identificar as posições à esquerda de Vinnie. Contando a partir de Vinnie - A primeira à esquerda é este espaço vazio. E a segunda à esquerda é onde Annie pertence. Aqui está Annie, sentada em segundo à esquerda de Vinnie. Então, Annie está de fato em segundo à esquerda de Vinnie.'
    },
    {
      code: 'ru-RU',
      message: 'Добро пожаловать! Сегодня мы изучаем "второе место слева". Энни находится на втором месте слева от Винни. Сначала поместим Винни, нашу точку отсчета, на этот стул. Теперь определим позиции слева от Винни. Считая от Винни - Первое место слева — это пустое пространство. И второе место слева — это то место, где находится Энни. Вот Энни, сидящая на втором месте слева от Винни. Итак, Энни действительно находится на втором месте слева от Винни.'
    },
    {
      code: 'ja-JP',
      message: 'ようこそ！今日は「左から2番目」について学びます。アニーはビニーの左から2番目です。まず、基準点であるビニーをこの椅子に配置しましょう。次に、ビニーの左側の位置を確認します。ビニーから数えて - 左から1番目は空のスペースです。そして左から2番目はアニーがいる場所です。アニーをその位置に配置しましょう。これで、アニーは確かにビニーの左から2番目になります。',
    },
    {
      code: 'ko-KR',
      message: '환영합니다! 오늘은 \'왼쪽에서 두 번째\'에 대해 배웁니다. 애니는 비니의 왼쪽에서 두 번째입니다. 먼저 기준점인 비니를 이 의자에 놓겠습니다. 이제 비니의 왼쪽 위치를 확인해 봅시다. 비니부터 세어서 - 왼쪽 첫 번째는 이 빈 공간입니다. 그리고 왼쪽 두 번째는 애니가 있는 곳입니다. 애니를 제자리에 놓아봅시다. 따라서 애니는 비니의 왼쪽에서 두 번째가 맞습니다.',
    },
    {
      code: 'zh-CN',
      message: '欢迎！今天我们学习“左边第二个”。安妮在维尼的左边第二个。首先，让我们把维尼，我们的参考点，放到这个椅子上。现在，让我们确定维尼左边的位置。从维尼开始数 - 左边第一个是这个空位。左边第二个是安妮所在的位置。让我们把安妮放到她的位置。所以，安妮确实在维尼的左边第二个。',
    },
    {
      code: 'hi-IN',
      message: 'स्वागत है! आज हम \'बाईं ओर दूसरा\' सीखेंगे। एनी विन्नी के बाईं ओर दूसरी है। सबसे पहले, विन्नी, हमारा संदर्भ बिंदु, को इस कुर्सी पर रखें। अब, विन्नी के बाईं ओर की स्थिति पहचानें। विन्नी से गिनकर - बाईं ओर पहली यह खाली जगह है। और बाईं ओर दूसरी वह जगह है जहाँ एनी है। एनी को उसकी जगह पर रखें। तो, एनी वास्तव में विन्नी के बाईं ओर दूसरी है।',
    },
    {
      code: 'ar-SA',
      message: 'أهلاً بك! اليوم سنتعلم عن "الموضع الثاني إلى اليسار". آني هي الثانية إلى يسار فيني. أولاً، دعنا نضع فيني، نقطة مرجعنا، على هذا الكرسي. الآن، دعنا نحدد المواقع إلى يسار فيني. بدءاً من فيني - الموضع الأول إلى اليسار هو هذا الفراغ. والموضع الثاني إلى اليسار هو حيث تنتمي آني. دعنا نضع آني في موضعها. إذن، آني هي بالفعل الثانية إلى يسار فيني.',
    },
  ];

  // Asset Image Components (Simplified paths for example)
  const AnnieAssetImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img
        src="https://placehold.co/128x160/FBCFE8/831843?text=Annie" // Placeholder image
        alt="Annie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-pink-600 dark:text-pink-300 font-bold text-xs md:text-sm">
          Annie
        </div>
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img
        src="https://placehold.co/128x160/DBEAFE/1E40AF?text=Vinnie" // Placeholder image
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-blue-600 dark:text-blue-300 font-bold text-xs md:text-sm">
          Vinnie
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components (Stylized abstract representations)
  const AnnieImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );


  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Function to reset all speech and highlighting states and character positions
  const resetSpeechAndHighlighting = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any pending timeouts
      timeoutRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentHighlight(null);
    currentSegmentIndex.current = 0; // Reset segment index to start from beginning
    setBoxContent([null, null, null]); // Reset boxes to empty
    setAnnieInPlaceholder(true); // Annie back to top
    setVinnieInPlaceholder(true); // Vinnie back to top
  }, []);

  // Function to speak a specific segment of the message and perform actions
  const speakSegment = useCallback((index) => {
    // Stop if all segments are done
    if (index >= speechSequence.length) {
      setCurrentHighlight('final-review'); // Ensure final state highlight persists
      setIsPlaying(false); // Stop playing state
      return;
    }

    const segment = speechSequence[index];
    // FIX: Access the string directly from the currentLanguage key
    const utterance = new SpeechSynthesisUtterance(segment.text[currentLanguage]);
    utterance.lang = languages.find(l => l.code === currentLanguage)?.code || 'en-US'; // Dynamically set lang

    // Set the highlight for the current segment BEFORE speaking
    setCurrentHighlight(segment.highlight);

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      // Actions that happen immediately when speech starts (e.g., initial character visibility)
      if (segment.action === 'show-characters') {
        setAnnieInPlaceholder(true);
        setVinnieInPlaceholder(true);
      }
    };

    utterance.onend = () => {
      // Perform actions that happen immediately after speech ends
      if (segment.action === 'place-vinnie') {
        setVinnieInPlaceholder(false);
        // Vinnie goes to the leftmost box (index 0)
        setBoxContent(prev => {
          const newContent = [...prev];
          newContent[0] = 'vinnie';
          return newContent;
        });
      } else if (segment.action === 'place-annie') {
        setAnnieInPlaceholder(false);
        // Annie goes to the rightmost box (index 2)
        setBoxContent(prev => {
          const newContent = [...prev];
          newContent[2] = 'annie';
          return newContent;
        });
      } else if (segment.action === 'final-review') {
        // Ensure final state is set
        setBoxContent(['vinnie', null, 'annie']); // Correct final arrangement
      }

      // Set timeout for the next segment, including any specified delayAfter
      timeoutRef.current = setTimeout(() => {
        currentSegmentIndex.current++; // Move to the next segment
        speakSegment(currentSegmentIndex.current); // Recursively call for next segment
      }, segment.delayAfter || 100); // Default short delay if no specific delayAfter

      // FIX: Set utteranceRef.current to null to ensure a new Utterance object is created for the next speak call
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      resetSpeechAndHighlighting();
      // FIX: Set utteranceRef.current to null on error as well
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance; // Store the current utterance
    window.speechSynthesis.speak(utterance);
  }, [currentLanguage, resetSpeechAndHighlighting, speechSequence, isPlaying, isPaused, languages]); // Added languages to deps

  // Main function to play the voice message
  const playVoiceMessage = useCallback(() => {
    if (isPaused && utteranceRef.current) {
      // If paused, resume the current utterance
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // If not playing, start from the beginning
      resetSpeechAndHighlighting(); // Ensure a clean start
      currentSegmentIndex.current = 0; // Reset segment index
      setIsPlaying(true); // Set playing state BEFORE calling speakSegment
      speakSegment(currentSegmentIndex.current); // Start speaking from first segment
    }
  }, [isPaused, resetSpeechAndHighlighting, speakSegment]);

  // Function to pause the voice message
  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause(); // Pause the current utterance
      setIsPlaying(false);
      setIsPaused(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear any pending delays if paused mid-delay
        timeoutRef.current = null;
      }
    }
  };

  // Handler for language change
  const handleLanguageChange = (langCode) => {
    resetSpeechAndHighlighting(); // Reset everything before changing language
    setCurrentLanguage(langCode);
    setIsDropdownOpen(false);
    // Add a small delay to allow state to update before playing the new message
    setTimeout(() => playVoiceMessage(), 100);
  };

  // useEffect to play the message on initial component mount
  useEffect(() => {
    // Cleanup function: stop speech and clear timers when component unmounts
    return () => {
      resetSpeechAndHighlighting();
    };
  }, [resetSpeechAndHighlighting]);

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-800 dark:text-gray-100">
          Learning nth Position to the Left (Activity)
        </h1>

        {/* Image Type Toggle */}
        <div className="flex justify-center mb-3 md:mb-6">
          <div className="flex items-center gap-2 md:gap-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setUseAssetImages(false)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                !useAssetImages
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              DIV Images
            </button>
            <button
              onClick={() => setUseAssetImages(true)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                useAssetImages
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Asset Images
            </button>
          </div>
        </div>

        {/* Language Selection Dropdown */}
        <div className="flex justify-center mb-3 md:mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-28 md:min-w-40 text-xs md:text-base"
            >
              <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
              <ChevronDown size={14} className={`md:w-4 md:h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 md:w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 md:max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs md:text-base ${
                      currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voice Control */}
        <div className="flex justify-center mb-4 md:mb-8">
          <button
            onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
            className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-base"
          >
            {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" />}
            {isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}
          </button>
        </div>

        {/* Character Placeholders (Top Row) */}
        <div className="flex justify-center gap-4 md:gap-8 mb-6">
          {annieInPlaceholder && (
            <CharacterPlaceholder
              name="Annie"
              ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage}
              colorTheme="text-pink-600"
              isHighlighted={currentHighlight === 'annie-placeholder' || currentHighlight === 'annie-placeholder-and-box'}
            />
          )}
          {vinnieInPlaceholder && (
            <CharacterPlaceholder
              name="Vinnie"
              ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage}
              colorTheme="text-blue-600"
              isHighlighted={currentHighlight === 'vinnie-placeholder'}
            />
          )}
        </div>

        {/* Seating Arrangement Visualization (Bottom Row - Boxes) */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 md:p-8">
          <div className="flex justify-center items-center overflow-x-auto">
            {/* Order: Vinnie (Box 0) -> Empty Box (Box 1) -> Annie (Box 2) */}
            <div className="flex flex-row justify-center items-center gap-1 md:gap-6">

              {/* Box 0 (Leftmost) - Vinnie's spot */}
              {boxContent[0] === 'vinnie' ? (
                <CharacterComponent
                  name="Vinnie"
                  ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage}
                  colorTheme="text-blue-600"
                  isHighlighted={currentHighlight === 'vinnie-placed'} // Yellow pulse only when placed initially
                  isReferenceCharacter={true} // Vinnie is always the reference
                  currentHighlightState={currentHighlight} // Pass currentHighlight for persistent red border logic
                />
              ) : (
                <EmptyBox isHighlighted={false} />
              )}

              {/* Position Indicator: 1st to the left */}
              <PositionIndicator
                position="1st to the left"
                isActive={currentHighlight === 'empty-box-highlight' || currentHighlight === 'annie-placeholder-and-box' || currentHighlight === 'annie-highlight' || currentHighlight === 'final-review'}
              />

              {/* Box 1 (Middle) - Empty space */}
              {boxContent[1] === null ? (
                <EmptyBox isHighlighted={currentHighlight === 'empty-box-highlight'} />
              ) : (
                <CharacterComponent
                  name={boxContent[1]}
                  ImageComponent={boxContent[1] === 'annie' ? (useAssetImages ? AnnieAssetImage : AnnieImage) : (useAssetImages ? VinnieAssetImage : VinnieImage)}
                  colorTheme={boxContent[1] === 'annie' ? 'text-pink-600' : 'text-blue-600'}
                  isHighlighted={false}
                  currentHighlightState={currentHighlight}
                />
              )}

              {/* Position Indicator: 2nd to the left */}
              <PositionIndicator
                position="2nd to the left"
                isActive={currentHighlight === 'annie-placeholder-and-box' || currentHighlight === 'annie-highlight' || currentHighlight === 'final-review'}
              />

              {/* Box 2 (Rightmost) - Annie's spot */}
              {boxContent[2] === 'annie' ? (
                <CharacterComponent
                  name="Annie"
                  ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage}
                  colorTheme="text-pink-600"
                  isHighlighted={currentHighlight === 'annie-highlight'}
                  currentHighlightState={currentHighlight} // Pass currentHighlight for persistent red border logic
                />
              ) : (
                <EmptyBox isHighlighted={currentHighlight === 'annie-placeholder-and-box'} />
              )}
            </div>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="mt-4 md:mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4 border border-blue-200 dark:border-blue-700">
          <h3 className="text-sm md:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Key Points:</h3>
          <ul className="text-xs md:text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Reference Point:</strong> <span className={currentHighlight && (currentHighlight === 'vinnie-placed' || currentHighlight === 'empty-box-highlight' || currentHighlight === 'annie-highlight' || currentHighlight === 'final-review' || currentHighlight === 'annie-placeholder-and-box') ? 'font-bold text-red-700 dark:text-red-400' : ''}>Vinnie</span> (starting position, leftmost box)</li>
            <li>• <strong>1st to the left of Vinnie:</strong> <span className={currentHighlight === 'empty-box-highlight' ? 'font-bold text-yellow-700 dark:text-yellow-400' : ''}>Empty Space</span> (first position when moving right from Vinnie)</li>
            <li>• <strong>2nd to the left of Vinnie:</strong> <span className={currentHighlight === 'annie-highlight' || currentHighlight === 'annie-placeholder-and-box' ? 'font-bold text-yellow-700 dark:text-yellow-400' : ''}>Annie</span> (second person when moving right from Vinnie)</li>
            <li>• <strong>Arrangement (from left to right):</strong> Vinnie → Empty Space → Annie</li>
          </ul>
        </div>

        {/* Current Message Display */}
        <div className="mt-4 md:mt-8 text-center px-2 md:px-4">
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
            {languages.find(l => l.code === currentLanguage)?.message || languages[0].message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementSecondToLeft;
