import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

// Helper Components defined outside the main component for proper scope and readability

// Empty Box Component - for individual empty chairs
const EmptyBox = ({ isHighlighted = false }) => (
  <div className={`w-14 h-18 md:w-28 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg relative border-2 ${isHighlighted ? 'border-yellow-400 dark:border-yellow-500 animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30' : 'border-gray-300 dark:border-gray-600'} flex flex-col items-center justify-center transition-all duration-300 p-1`}>
    <span className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-semibold">Empty Space</span>
  </div>
);

// Character Image components (for placeholders and inside boxes)
const AnnieImage = () => (
  <div className="w-10 h-10 bg-pink-400 dark:bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">A</div>
);

const NinnieImage = () => (
  <div className="w-10 h-10 bg-green-400 dark:bg-green-500 rounded-full flex items-center justify-center text-white text-xs">N</div>
);

// Reusable Character Component (for characters in the boxes)
const CharacterComponent = ({ name, ImageComponent, colorTheme, isHighlighted = false, currentHighlightState }) => {
  // No specific reference character highlight in this scenario, just general highlighting
  const showYellowPulse = isHighlighted;

  return (
    <div className="flex flex-col items-center relative w-14 h-18 md:w-28 md:h-32">
      <div className="relative flex flex-col items-center justify-center h-full">
        <ImageComponent />
        {/* Yellow pulse highlight (for current step) */}
        {showYellowPulse && (
          <div className="absolute -inset-2 border-3 border-yellow-400 dark:border-yellow-500 rounded-xl animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30"></div>
        )}
      </div>
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')} ${showYellowPulse ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
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

// NEW: Combined Empty Space Indicator Component
const CombinedEmptySpaceIndicator = ({ isActive = false, direction = 'right' }) => (
  <div className={`flex flex-col items-center mx-0.5 md:mx-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
    <div className="flex items-center gap-0.5 md:gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm">
      {direction === 'left' && <ArrowLeft size={8} className="md:w-4 md:h-4" />}
      <span>1 Empty Space</span>
      {direction === 'right' && <ArrowRight size={8} className="md:w-4 md:h-4" />}
    </div>
  </div>
);

// NEW: Combined Empty Space Indicator Component
const CombinedSecondEmptySpaceIndicator = ({ isActive = false, direction = 'right' }) => (
    <div className={`flex flex-col items-center mx-0.5 md:mx-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-0.5 md:gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm">
        {direction === 'left' && <ArrowLeft size={8} className="md:w-4 md:h-4" />}
        <span>2 Empty Space</span>
        {direction === 'right' && <ArrowRight size={8} className="md:w-4 md:h-4" />}
      </div>
    </div>
  );

  // NEW: Combined Empty Space Indicator Component
const PersonSpaceIndicator = ({ isActive = false, direction = 'right' }) => (
    <div className={`flex flex-col items-center mx-0.5 md:mx-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-0.5 md:gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm">
        {direction === 'left' && <ArrowLeft size={8} className="md:w-4 md:h-4" />}
        <span>User Space</span>
        {direction === 'right' && <ArrowRight size={8} className="md:w-4 md:h-4" />}
      </div>
    </div>
  );


const SeatingArrangementBetweenTwo = () => { // Component name
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  // currentHighlight can be:
  // 'initial-setup', 'annie-placeholder', 'ninnie-placeholder',
  // 'scenario1-full-highlight', 'scenario1-empty-highlight',
  // 'scenario2-full-highlight', 'scenario2-empty-highlight',
  // 'final-review'
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null); // To store setTimeout IDs for clearing
  const currentSegmentIndex = useRef(0); // Tracks which segment of speech is currently active

  // State to manage character positions in the boxes for Scenario 1
  const [scenario1BoxContent, setScenario1BoxContent] = useState([null, null, null, null]); // 4 boxes
  // State to manage character positions in the boxes for Scenario 2
  const [scenario2BoxContent, setScenario2BoxContent] = useState([null, null, null, null]); // 4 boxes

  // State to track if characters are in their top placeholders
  // These will now always be true to keep them visible
  const [annieInPlaceholder, setAnnieInPlaceholder] = useState(true);
  const [ninnieInPlaceholder, setNinnieInPlaceholder] = useState(true);

  // Define the speech sequence with text, associated highlight, and an action to perform after speaking
  const speechSequence = [
    {
      text: {
        'en-US': "Welcome! Today we're learning about 'people between two individuals'. Specifically, '2 people between Annie and Ninnie'.",
        'en-GB': "Welcome! Today we're learning about 'people between two individuals'. Specifically, '2 people between Annie and Ninnie'.",
        'es-ES': "¡Bienvenidos! Hoy aprenderemos sobre 'personas entre dos individuos'. Específicamente, '2 personas entre Annie y Ninnie'.",
        'fr-FR': "Bienvenue ! Aujourd'hui, nous allons apprendre sur les 'personnes entre deux individus'. Plus précisément, '2 personnes entre Annie et Ninnie'.",
        'de-DE': "Willkommen! Heute lernen wir über 'Personen zwischen zwei Individuen'. Insbesondere '2 Personen zwischen Annie und Ninnie'.",
        'it-IT': "Benvenuti! Oggi impareremo sulle 'persone tra due individui'. In particolare, '2 persone tra Annie e Ninnie'.",
        'pt-BR': "Bem-vindos! Hoje vamos aprender sobre 'pessoas entre dois indivíduos'. Especificamente, '2 pessoas entre Annie e Ninnie'.",
        'ru-RU': "Добро пожаловать! Сегодня мы изучаем 'людей между двумя индивидуумами'. В частности, '2 человека между Энни и Нинни'.",
        'ja-JP': "ようこそ！今日は「2人の間にいる人」について学びます。具体的には「アニーとニニーの間に2人」です。",
        'ko-KR': "환영합니다! 오늘은 '두 사람 사이의 사람'에 대해 배웁니다. 특히 '애니와 니니 사이에 2명'입니다.",
        'zh-CN': "欢迎！今天我们学习“两个人之间的人”。具体来说，是“安妮和尼尼之间有2个人”。",
        'hi-IN': "स्वागत है! आज हम 'दो व्यक्तियों के बीच लोग' के बारेारे में सीख रहे हैं। विशेष रूप से, 'एनी और निन्नी के बीच 2 लोग'।",
        'ar-SA': "أهلاً بك! اليوم سنتعلم عن 'الأشخاص بين فردين'. تحديداً، 'شخصان بين آني ونيني'.",
      },
      action: 'initial-setup', // Resets state to initial setup
      highlight: null,
    },
    {
      text: {
        'en-US': "There are two main possibilities for this arrangement. Let's explore the first scenario:",
        'en-GB': "There are two main possibilities for this arrangement. Let's explore the first scenario:",
        'es-ES': "Hay dos posibilidades principales para esta disposición. Exploremos el primer escenario:",
        'fr-FR': "Il existe deux possibilités principales pour cet arrangement. Explorons le premier scénario :",
        'de-DE': "Es gibt zwei Hauptmöglichkeiten für diese Anordnung. Lassen Sie uns das erste Szenario erkunden:",
        'it-IT': "Ci sono due possibilità principali per questa disposizione. Esploriamo il primo scenario:",
        'pt-BR': "Existem duas possibilità principali para este arranjo. Vamos explorar o primeiro cenário:",
        'ru-RU': "Есть две основные возможности для такого расположения. Давайте рассмотрим первый сценарий:",
        'ja-JP': "この配置には主に2つの可能性があります。最初のシナリオを見てみましょう：",
        'ko-KR': "이 배열에는 두 가지 주요 가능성이 있습니다. 첫 번째 시나리오를 살펴보겠습니다:",
        'zh-CN': "这种排列方式有两种主要可能性。让我们探讨第一个场景：",
        'hi-IN': "इस व्यवस्था के लिए दो मुख्य संभावनाएं हैं। आइए पहले परिदृश्य का पता लगाएं:",
        'ar-SA': "هناك احتمالان رئيسيان لهذا الترتيب. دعنا نستكشف السيناريو الأول:",
      },
      action: 'scenario1-intro',
      highlight: null,
      delayAfter: 1000,
    },
    {
      text: {
        'en-US': "Scenario one: Annie, then two empty spaces, then Ninnie. Here, Ninnie is to the left of Annie.",
        'en-GB': "Scenario one: Annie, then two empty spaces, then Ninnie. Here, Ninnie is to the left of Annie.",
        'es-ES': "Escenario uno: Annie, luego dos espacios vacíos, luego Ninnie. Aquí, Ninnie está a la izquierda de Annie.",
        'fr-FR': "Scénario un : Annie, puis deux espaces vides, puis Ninnie. Ici, Ninnie est à gauche d'Annie.",
        'de-DE': "Szenario eins: Annie, dann zwei leere Plätze, dann Ninnie. Hier ist Ninnie links von Annie.",
        'it-IT': "Scenario uno: Annie, poi due spazi vuoti, poi Ninnie. Qui, Ninnie è a sinistra di Annie.",
        'pt-BR': "Cenário um: Annie, depois dois espaços vazios, depois Ninnie. Aqui, Ninnie está à esquerda de Annie.",
        'ru-RU': "Сценарий первый: Энни, затем два пустых места, затем Нинни. Здесь Нинни находится слева от Энни.",
        'ja-JP': "シナリオ1：アニー、そして2つの空のスペース、そしてニニー。ここでは、ニニーはアニーの左にいます。",
        'ko-KR': "시나리오 1: 애니, 그리고 두 개의 빈 공간, 그리고 니니. 여기서 니니는 애니의 왼쪽에 있습니다。",
        'zh-CN': "场景一：安妮，然后两个空位，然后尼尼。在这里，尼尼在安妮的左边。",
        'hi-IN': "पहला परिदृश्य: एनी, फिर दो खाली जगहें, फिर निन्नी। यहां, निन्नी एनी के बाईं ओर है।",
        'ar-SA': "السيناريو الأول: آني، ثم فراغان، ثم نيني. هنا، نيني إلى يسار آني.",
      },
      action: 'scenario1-place-characters', // Places Annie and Ninnie for scenario 1
      highlight: 'scenario1-full-highlight', // Highlight all boxes for scenario 1
      delayAfter: 3000,
    },
    {
      text: {
        'en-US': "In this arrangement, Annie is at the first position, and Ninnie is at the fourth position.",
        'en-GB': "In this arrangement, Annie is at the first position, and Ninnie is at the fourth position.",
        'es-ES': "En esta disposición, Annie está en la primera posición y Ninnie en la cuarta posición.",
        'fr-FR': "Dans cet arrangement, Annie est à la première position, et Ninnie est à la quatrième position.",
        'de-DE': "In dieser Anordnung ist Annie an der ersten Position und Ninnie an der vierten Position.",
        'it-IT': "In questa disposizione, Annie è nella prima posizione e Ninnie è nella quarta posizione.",
        'pt-BR': "Neste arranjo, Annie está na primeira posição e Ninnie está na quarta posição.",
        'ru-RU': "В этом расположении Энни находится на первой позиции, а Нинни — на четвертой.",
        'ja-JP': "この配置では、アニーが最初の位置に、ニニーが4番目の位置にいます。",
        'ko-KR': "이 배열에서 애니는 첫 번째 위치에 있고 니니는 네 번째 위치에 있습니다。",
        'zh-CN': "在这种排列中，安妮在第一个位置，尼尼在第四个位置。",
        'hi-IN': "इस व्यवस्था में, एनी पहले स्थान पर है, और निन्नी चौथे स्थान पर है।",
        'ar-SA': "في هذا الترتيب، آني في الموضع الأول، ونيني في الموضع الرابع.",
      },
      highlight: 'scenario1-full-highlight', // Keep highlighted
      delayAfter: 2000,
    },
    {
      text: {
        'en-US': "The two empty spaces clearly show two people between them.",
        'en-GB': "The two empty spaces clearly show two people between them.",
        'es-ES': "Los dos espacios vacíos muestran claramente dos personas entre ellos.",
        'fr-FR': "Les deux espaces vides montrent clairement deux personnes entre elles.",
        'de-DE': "Die zwei leeren Plätze zeigen deutlich zwei Personen dazwischen.",
        'it-IT': "I due spazi vacíos muestran claramente dos personas entre ellos.",
        'pt-BR': "Os dos espacios vazios mostran claramente dos personas entre ellos.",
        'ru-RU': "Два пустых места ясно показывают двух человек между ними.",
        'ja-JP': "2つの空のスペースは、それらの間に2人がいることを明確に示しています。",
        'ko-KR': "두 개의 빈 공간은 그들 사이에 두 사람이 있음을 명확히 보여줍니다。",
        'zh-CN': "两个空位清楚地表明它们之间有两个人。",
        'hi-IN': "दो खाली जगहें स्पष्ट रूप से उनके बीच दो लोगों को दर्शाती हैं।",
        'ar-SA': "الفراغان يوضحان بوضوح وجود شخصين بينهما.",
      },
      highlight: 'scenario1-empty-highlight', // Highlight only empty spaces
      delayAfter: 3000,
    },
    {
      text: {
        'en-US': "It is important that Annie and Ninnie occupy the first and last chairs respectively. If they were to sit in the second or third chair, there wouldn't be enough space for exactly two people between them.",
        'en-GB': "It is important that Annie and Ninnie occupy the first and last chairs respectively. If they were to sit in the second or third chair, there wouldn't be enough space for exactly two people between them.",
        'es-ES': "Es importante que Annie y Ninnie ocupen la primera y la última silla respectivamente. Si se sentaran en la segunda o tercera silla, no habría espacio suficiente para exactamente dos personas entre ellos.",
        'fr-FR': "Il est important qu'Annie et Ninnie occupent respectivement la première et la dernière chaise. S'ils s'asseyaient sur la deuxième ou la troisième chaise, il n'y aurait pas assez d'espace pour exactement deux personnes entre eux.",
        'de-DE': "Es ist wichtig, dass Annie und Ninnie jeweils den ersten und letzten Stuhl besetzen. Würden sie auf dem zweiten oder dritten Stuhl sitzen, gäbe es nicht genug Platz für genau zwei Personen zwischen ihnen.",
        'it-IT': "È importante que Annie e Ninnie occupino rispettivamente la prima e l'ultima sedia. Se si sedessero sulla seconda o terza sedia, non ci sarebbe spazio sufficiente per esattamente due persone tra di loro.",
        'pt-BR': "É importante que Annie e Ninnie ocupem a primeira e a última cadeira, respectivamente. Se eles se sentassem na segunda ou terceira cadeira, não haveria espaço suficiente para exatamente duas pessoas entre eles.",
        'ru-RU': "Важно, чтобы Энни и Нинни занимали соответственно первое и последнее места. Если бы они сидели на втором или третьем стуле, не хватило бы места ровно для двух человек между ними.",
        'ja-JP': "アニーとニニーがそれぞれ最初と最後の椅子を占めることが重要です。もし彼らが2番目または3番目の椅子に座ると、彼らの間に正確に2人分のスペースがなくなってしまいます。",
        'ko-KR': "애니와 니니가 각각 첫 번째와 마지막 의자를 차지하는 것이 중요합니다. 만약 그들이 두 번째나 세 번째 의자에 앉는다면, 그들 사이에 정확히 두 사람을 위한 공간이 충분하지 않을 것입니다。",
        'zh-CN': "安妮和尼尼分别占据第一和最后一把椅子很重要。如果他们坐在第二或第三把椅子上，那么他们之间就没有足够的空间容纳两个人了。",
        'hi-IN': "यह महत्वपूर्ण है कि एनी और निन्नी क्रमशः पहली और आखिरी कुर्सियों पर बैठें। यदि वे दूसरी या तीसरी कुर्सी पर बैठते, तो उनके बीच ठीक दो लोगों के लिए पर्याप्त जगह नहीं होती।",
        'ar-SA': "من المهم أن تشغل آني ونيني الكرسيين الأول والأخير على التوالي. إذا جلسوا في الكرسي الثاني أو الثالث، فلن يكون هناك مساحة كافية لشخصين بالضبط بينهما.",
      },
      highlight: 'scenario1-full-highlight', // Keep scenario 1 highlighted
      delayAfter: 4000,
    },
    {
      text: {
        'en-US': "Now, let's explore the second scenario.",
        'en-GB': "Now, let's explore the second scenario.",
        'es-ES': "Ahora, exploremos el segundo escenario.",
        'fr-FR': "Maintenant, explorons le second scénario.",
        'de-DE': "Nun, lassen Sie uns das zweite Szenario erkunden.",
        'it-IT': "Ora, esploriamo il secondo escenario.",
        'pt-BR': "Agora, vamos explorar o segundo cenário.",
        'ru-RU': "Теперь давайте рассмотрим второй сценарий.",
        'ja-JP': "次に、2番目のシナリオを見てみましょう。",
        'ko-KR': "이제 두 번째 시나리오를 살펴보겠습니다。",
        'zh-CN': "现在，让我们探讨第二个场景。",
        'hi-IN': "अब, दूसरे परिदृश्य का पता लगाएं।",
        'ar-SA': "الآن، دعنا نستكشف السيناريو الثاني.",
      },
      action: 'scenario2-intro', // Resets scenario 2 display
      highlight: null,
      delayAfter: 1000,
    },
    {
      text: {
        'en-US': "Scenario two: Ninnie, then two empty spaces, then Annie. Here, Ninnie is to the right of Annie.",
        'en-GB': "Scenario two: Ninnie, then two empty spaces, then Annie. Here, Ninnie is to the right of Annie.",
        'es-ES': "Escenario dos: Ninnie, luego dos espacios vacíos, luego Annie. Aquí, Ninnie está a la derecha de Annie.",
        'fr-FR': "Scénario deux : Ninnie, puis deux espaces vides, puis Annie. Ici, Ninnie est à droite d'Annie.",
        'de-DE': "Szenario zwei: Ninnie, dann zwei leere Plätze, dann Annie. Hier ist Ninnie rechts von Annie.",
        'it-IT': "Scenario due: Ninnie, poi dos espacios vacíos, poi Annie. Qui, Ninnie è a destra di Annie.",
        'pt-BR': "Cenário dois: Ninnie, depois dos espacios vacíos, depois Annie. Aquí, Ninnie está à direita de Annie.",
        'ru-RU': "Сценарий второй: Нинни, затем два пустых места, затем Энни.",
        'ja-JP': "シナリオ2：ニニー、そして2つの空のスペース、そしてアニー。",
        'ko-KR': "시나리오 2: 니니, 그리고 두 개의 빈 공간, 그리고 애니.",
        'zh-CN': "场景二：尼尼，然后两个空位，然后安妮。",
        'hi-IN': "दूसरा परिदृश्य: निन्नी, फिर दो खाली जगहें, फिर एनी।",
        'ar-SA': "السيناريو الثاني: نيني، ثم فراغان، ثم آني.",
      },
      action: 'scenario2-place-characters', // Places Ninnie and Annie for scenario 2
      highlight: 'scenario2-full-highlight', // Highlight all boxes for scenario 2
      delayAfter: 3000,
    },
    {
      text: {
        'en-US': "Here, Ninnie is at the first position, and Annie is at the fourth position.",
        'en-GB': "Here, Ninnie is at the first position, and Annie is at the fourth position.",
        'es-ES': "Aquí, Ninnie está en la primera posición y Annie en la cuarta posición.",
        'fr-FR': "Ici, Ninnie est à la première position, et Annie est à la quatrième position.",
        'de-DE': "Hier ist Ninnie an der ersten Position und Annie an der vierten Position.",
        'it-IT': "Qui, Ninnie è nella prima posizione e Annie è nella quarta posizione.",
        'pt-BR': "Aquí, Ninnie está na primera posición y Annie está en la cuarta posición.",
        'ru-RU': "Здесь Нинни находится на первой позиции, а Энни — на четвертой.",
        'ja-JP': "ここでは、ニニーが最初の位置に、アニーが4番目の位置にいます。",
        'ko-KR': "여기서 니니는 첫 번째 위치에 있고 애니는 네 번째 위치에 있습니다。",
        'zh-CN': "在这里，尼尼在第一个位置，安妮在第四个位置。",
        'hi-IN': "यहां, निन्नी पहले स्थान पर है, और एनी चौथे स्थान पर है।",
        'ar-SA': "هنا، نيني في الموضع الأول، وآني في الموضع الرابع.",
      },
      highlight: 'scenario2-full-highlight', // Keep highlighted
      delayAfter: 2000,
    },
    {
      text: {
        'en-US': "Again, we have two empty spaces between Ninnie and Annie.",
        'en-GB': "Again, we have two empty spaces between Ninnie and Annie.",
        'es-ES': "De nuevo, tenemos dos espacios vacíos entre Ninnie y Annie.",
        'fr-FR': "De nouveau, nous avons dos espacios vacíos entre Ninnie y Annie.",
        'de-DE': "Wieder haben wir zwei leere Plätze zwischen Ninnie y Annie.",
        'it-IT': "Di nuovo, abbiamo dos espacios vacíos entre Ninnie y Annie.",
        'pt-BR': "Novamente, tenemos dos espacios vacíos entre Ninnie y Annie.",
        'ru-RU': "Снова у нас есть два пустых места между Нинни и Энни.",
        'ja-JP': "ここでも、ニニーとアニーの間に2つの空のスペースがあります。",
        'ko-KR': "다시 말하지만, 니니와 애니 사이에 두 개의 빈 공간이 있습니다。",
        'zh-CN': "同样，尼尼和安妮之间也有两个空位。",
        'hi-IN': "फिर से, निन्नी और एनी के बीच दो खाली जगहें हैं।",
        'ar-SA': "مرة أخرى، لدينا فراغان بين نيني وآني.",
      },
      highlight: 'scenario2-empty-highlight', // Highlight only empty spaces
      delayAfter: 3000,
    },
    {
      text: {
        'en-US': "These are the two ways to arrange them with 2 people in between.",
        'en-GB': "These are the two ways to arrange them with 2 people in between.",
        'es-ES': "Estas son las dos formas de organizarlos con 2 personas en el medio.",
        'fr-FR': "Ce sont les dos façons de les arranger con 2 personas entre ellas.",
        'de-DE': "Dies sind die beiden Möglichkeiten, sie mit 2 Personen dazwischen anzuordnen.",
        'it-IT': "Questi sono i dos modi per disporli con 2 persone in mezzo.",
        'pt-BR': "Estas son las dos maneras de organizarlos con 2 personas en el medio.",
        'ru-RU': "Это два способа расположить их так, чтобы между ними было 2 человека.",
        'ja-JP': "これらが、間に2人がいるように配置する2つの方法です。",
        'ko-KR': "이것이 두 사람 사이에 2명을 배치하는 두 가지 방법입니다。",
        'zh-CN': "这是将它们排列成中间有2个人的两种方式。",
        'hi-IN': "ये दो तरीके हैं जिनसे उन्हें 2 लोगों के बीच व्यवस्थित किया जा सकता है।",
        'ar-SA': "هاتان هما الطريقتان لترتيبهما مع وجود شخصين بينهما.",
      },
      action: 'final-review',
      highlight: 'final-review',
    },
  ];

  const languages = [
    {
      code: 'en-US',
      name: 'English (US)',
      message: 'Welcome! Today we\'re learning about \'people between two individuals\'. Specifically, \'2 people between Annie and Ninnie\'. There are two main possibilities for this arrangement. Let\'s explore the first scenario: Scenario one: Annie, then two empty spaces, then Ninnie. In this arrangement, Annie is at the first position, and Ninnie is at the fourth position. The two empty spaces clearly show two people between them. It is important that Annie and Ninnie occupy the first and last chairs respectively. If they were to sit in the second or third chair, there wouldn\'t be enough space for exactly two people between them. Now, let\'s explore the second scenario. Scenario two: Ninnie, then two empty spaces, then Annie. Here, Ninnie is at the first position, and Annie is at the fourth position. Again, we have two empty spaces between Ninnie and Annie. These are the two ways to arrange them with 2 people in between.'
    },
    {
      code: 'es-ES',
      name: 'Spanish',
      message: '¡Bienvenidos! Hoy aprenderemos sobre \'personas entre dos individuos\'. Específicamente, \'2 personas entre Annie y Ninnie\'. Hay dos posibilidades principales para esta disposición. Exploremos el primer escenario: Escenario uno: Annie, luego dos espacios vacíos, luego Ninnie. En esta disposición, Annie está en la primera posición y Ninnie en la cuarta posición. Los dos espacios vacíos muestran claramente dos personas entre ellos. Es importante que Annie y Ninnie ocupen la primera y la última silla respectivamente. Si se sentaran en la segunda o tercera silla, no habría espacio suficiente para exactamente dos personas entre ellos. Ahora, exploremos el segundo escenario. Escenario dos: Ninnie, luego dos espacios vacíos, luego Annie. Aquí, Ninnie está en la primera posición y Annie en la cuarta posición. De nuevo, tenemos dos espacios vacíos entre Ninnie y Annie. Estas son las dos formas de organizarlos con 2 personas en el medio.'
    },
    // Add other languages as needed, ensuring message matches speechSequence texts
  ];

  // Asset Image Components (Simplified paths for example)
  const AnnieAssetImage = () => (
    <div className="w-14 h-20 md:w-28 md:h-36 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200">
      <img
        src="https://placehold.co/128x160/FBCFE8/831843?text=Annie" // Placeholder image
        alt="Annie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-pink-600 font-bold text-xs md:text-sm">
          Annie
        </div>
      </div>
    </div>
  );

  const NinnieAssetImage = () => (
    <div className="w-14 h-20 md:w-28 md:h-36 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200">
      <img
        src="https://placehold.co/128x160/D1FAE5/065F46?text=Ninnie" // Placeholder image
        alt="Ninnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-green-600 font-bold text-xs md:text-sm">
          Ninnie
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components (Stylized abstract representations)
  const AnnieDivImage = () => (
    <div className="w-14 h-20 md:w-28 md:h-36 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-amber-400 to-amber-500 rounded-t-full"></div>
      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-pink-200 to-pink-300 rounded-full border border-pink-300">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-pink-400 rounded-full"></div>
        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 rounded-full"></div>
      </div>
      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg"></div>
      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 rounded-full"></div>
      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 rounded-full"></div>
    </div>
  );

  const NinnieDivImage = () => (
    <div className="w-14 h-20 md:w-28 md:h-36 bg-gradient-to-br from-green-100 to-green-200 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-orange-600 to-orange-700 rounded-t-full"></div>
      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-green-200 to-green-300 rounded-full border border-green-300">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 rounded-full"></div>
        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-green-400 rounded-full"></div>
        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 rounded-full"></div>
      </div>
      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-lg"></div>
      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-green-300 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-green-300 rounded-full"></div>
      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-orange-400 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-orange-400 rounded-full"></div>
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
    setScenario1BoxContent([null, null, null, null]); // Reset to 4 empty boxes
    setScenario2BoxContent([null, null, null, null]); // Reset to 4 empty boxes
    setAnnieInPlaceholder(true); // Annie back to top
    setNinnieInPlaceholder(true); // Ninnie back to top
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
    // Access the string directly from the currentLanguage key
    const utterance = new SpeechSynthesisUtterance(segment.text[currentLanguage]);
    // Dynamically set utterance.lang based on currentLanguage code
    utterance.lang = languages.find(l => l.code === currentLanguage)?.code || 'en-US';

    // Set the highlight for the current segment BEFORE speaking
    setCurrentHighlight(segment.highlight);

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Perform actions that happen immediately after speech ends
      if (segment.action === 'initial-setup') {
        setScenario1BoxContent([null, null, null, null]);
        setScenario2BoxContent([null, null, null, null]);
        setAnnieInPlaceholder(true);
        setNinnieInPlaceholder(true);
      } else if (segment.action === 'scenario1-place-characters') {
        setAnnieInPlaceholder(false);
        setNinnieInPlaceholder(false);
        setScenario1BoxContent(['annie', null, null, 'ninnie']); // Annie - E - E - Ninnie
        // Keep scenario 2 empty for now
        setScenario2BoxContent([null, null, null, null]);
      } else if (segment.action === 'scenario2-intro') {
        // Only clear scenario 2, scenario 1 remains
        setScenario2BoxContent([null, null, null, null]);
        setAnnieInPlaceholder(true); // Characters back to placeholders for scenario 2 setup
        setNinnieInPlaceholder(true);
      } else if (segment.action === 'scenario2-place-characters') {
        setNinnieInPlaceholder(false);
        setAnnieInPlaceholder(false);
        setScenario2BoxContent(['ninnie', null, null, 'annie']); // Ninnie - E - E - Annie
        // Keep scenario 1 as it was
        setScenario1BoxContent(['annie', null, null, 'ninnie']);
      } else if (segment.action === 'final-review') {
        // Show both scenarios in final state
        setScenario1BoxContent(['annie', null, null, 'ninnie']);
        setScenario2BoxContent(['ninnie', null, null, 'annie']);
      }

      // Set timeout for the next segment, including any specified delayAfter
      timeoutRef.current = setTimeout(() => {
        currentSegmentIndex.current++; // Move to the next segment
        speakSegment(currentSegmentIndex.current); // Recursively call for next segment
      }, segment.delayAfter || 100); // Default short delay if no specific delayAfter

      // Set utteranceRef.current to null to ensure a new Utterance object is created for the next speak call
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      resetSpeechAndHighlighting();
      // Set utteranceRef.current to null on error as well
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance; // Store the current utterance
    window.speechSynthesis.speak(utterance);
  }, [currentLanguage, resetSpeechAndHighlighting, speechSequence, isPlaying, isPaused, languages]);

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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 md:p-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-800 dark:text-white">
        Learning: 2 People Between Annie and Ninnie (Activity)
      </h1>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(currentSegmentIndex.current / speechSequence.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Image Type Toggle */}
      <div className="flex justify-center mb-3 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setUseAssetImages(false)}
            className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
              !useAssetImages
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            DIV Images
          </button>
          <button
            onClick={() => setUseAssetImages(true)}
            className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
              useAssetImages
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
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
            <ChevronDown
              size={14}
              className={`md:w-4 md:h-4 text-gray-500 dark:text-gray-300 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-36 md:w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 md:max-h-60 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs md:text-base ${
                    currentLanguage === lang.code
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200'
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
          className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-base"
        >
          {isPlaying ? (
            <Pause size={16} className="md:w-5 md:h-5" />
          ) : (
            <Play size={16} className="md:w-5 md:h-5" />
          )}
          {isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}
        </button>
      </div>

      {/* Character Placeholders (Top Row) */}
      <div className="flex justify-center gap-4 md:gap-8 mb-6">
        <CharacterPlaceholder
          name="Annie"
          ImageComponent={useAssetImages ? AnnieAssetImage : AnnieDivImage}
          colorTheme="text-pink-600"
          isHighlighted={currentHighlight === 'annie-placeholder'}
        />
        <CharacterPlaceholder
          name="Ninnie"
          ImageComponent={useAssetImages ? NinnieAssetImage : NinnieDivImage}
          colorTheme="text-green-600"
          isHighlighted={currentHighlight === 'ninnie-placeholder'}
        />
      </div>

      {/* Scenario 1 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 md:p-8 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-700 dark:text-gray-100">
          Scenario 1: Annie → E → E → Ninnie
        </h2>
        {/* ...scenario 1 visualization remains the same */}
      </div>

      {/* Scenario 2 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 md:p-8">
        <h2 className="text-lg md:text-xl font-bold text-center mb-4 text-gray-700 dark:text-gray-100">
          Scenario 2: Ninnie → E → E → Annie
        </h2>
        {/* ...scenario 2 visualization remains the same */}
      </div>

      {/* Explanation Box */}
      <div className="mt-4 md:mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-3 md:p-4 border border-blue-200 dark:border-blue-700">
        <h3 className="text-sm md:text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Points:</h3>
        <ul className="text-xs md:text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Scenario 1:</strong> Annie → Empty Space → Empty Space → Ninnie</li>
          <li>• <strong>Scenario 2:</strong> Ninnie → Empty Space → Empty Space → Annie</li>
          <li>• In both scenarios, there are exactly 2 empty spaces (representing 2 people) between Annie and Ninnie.</li>
          <li>• For exactly 2 people to be between them, Annie and Ninnie must occupy the first and last chairs of the 4-chair arrangement.</li>
        </ul>
      </div>

      {/* Current Message Display */}
      <div className="mt-4 md:mt-8 text-center px-2 md:px-4">
        <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
          {languages.find((l) => l.code === currentLanguage)?.message || languages[0].message}
        </p>
      </div>
    </div>
  </div>
);

};

export default SeatingArrangementBetweenTwo;
