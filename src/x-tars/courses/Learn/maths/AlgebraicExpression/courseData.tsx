

import { BookOpen, PenTool, FileText } from 'lucide-react'; // Import icons for the tabs
import AlgebraicFundamentals from './AlgebraicFundamentals.tsx'
import RightScaleWeight from './RightScaleWeight.tsx'
import InteractiveAlgebraicIntroduction from './InteractiveAlgebraicIntroduction.tsx'
import FindingtheUnknownIntroduction from './FindingtheUnknownIntroduction.tsx'
import CreatingAlgebraicExpreesionIntro from './CreatingAlgebraicExpressionIntro.tsx'
import CreatingAlgebraicExpressionUnlikeTerms from './CreatingAlgebraicExpressionUnlikeTerms.tsx'
import CreatingAlgebraicExpressionAdvanced from './CreatingAlgebraicExpressionAdvanced.tsx'
import PracticeCreatingAlgebraicExpression from './PracticeCreatingAlgebraicExpression'
import AlgebraicExpressionSolutionIntro from './AlgebraicExpressionSolutionIntro.tsx'
import AlgebraicExpressionSolutionBasic from './AlgebraicExpressionSolutionBasic'
import AlgebraicExpressionSolutionNegativeCase from './AlgebraicExpressionSolutionNegativeCase'
import AlgebraicExpressionSolutionPracticeBasic from './AlgebraicExpressionSolutionPracticeBasic'
import AlgebraicExpressionPracticeNegative from './AlgebraicExpressionPracticeNegative'
import AlgebraicExpressionVariableBothSide from './AlgebraicExpressionVariableBothSide'
import AlgebraciExpressionGyaan from './AlgebraciExpressionGyaan'
import AlgebraicExpressionWhenToSubtractOrDivide from './AlgebraicExpressionWhenToSubtractOrDivide'
import AlgebraicExpressionLikeUnlikeTerms from './AELikeUnlikeTerms.tsx'
import AlgebraicExpressionPractice1 from './AlgebraicExpressionPractice1'
import AlgebraicExpressionPractice2 from './AlgebraicExpressionPractice2'
import AlgebraicExpressionPractice3 from './AlgebraicExpressionPractice3'
import WarModeAlgebraicExpression1 from './WarModeAlgebraicExpression1'
import WarModeAlgebraicExpression2 from './WarModeAlgebraicExpression2'
import PracticeCreatingAlgebraicExpression2 from './PracticeCreatingAlgebraicExpression2'
import PolynomialLearningAlgebraicExpression from './MonoBinoPolyIdentification.tsx'
import PracticeCreatingAlgebraicExpression3 from './PracticeCreatingAlgebraicExpression3'

export const sampleCourse = {
  title: "Algebraic Expressions",
  level: "Beginner",
  overallProgress: 25,
  modules: [
    {
      id: "1",
      title: "Module 1: What is algebraic expression",
      completedLessons: 1,
      totalLessons: 3,
      subModules: [
        {
          id: "1-1",
          title: "Lesson 1: Let's learn the basics?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Can you balance the scale?', icon: BookOpen },
              { id: 'concept1', label: 'Let us find the weight of unknown?', icon: BookOpen },
              { id: 'concept2', label: 'What is the weight on right scale?', icon: BookOpen },
              { id: 'concept3', label: 'Establishing Fundamentals', icon: BookOpen }

            ],
            concept: <InteractiveAlgebraicIntroduction />,
            concept1: <FindingtheUnknownIntroduction />,
            concept2: <RightScaleWeight />,
            concept3: <AlgebraicFundamentals />
          }
        },
        {
          id: "1-2",
          title: "Let's create the Algebraic Expression?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Create Algebraic Expression', icon: BookOpen },
              { id: 'concept2', label: 'Create advanced algebraic expressions', icon: BookOpen },
              { id: 'concept3', label: 'Create algebraic expressions for multiple variables', icon: BookOpen },
              { id: 'practice', label: 'Practice Algebraic Expression', icon: PenTool },
              { id: 'practice1', label: 'Practice Algebraic Expression', icon: PenTool },
              { id: 'practice2', label: 'Practice Algebraic Expression', icon: PenTool },

            ],
            concept: <CreatingAlgebraicExpreesionIntro />,
            concept2: <CreatingAlgebraicExpressionUnlikeTerms />,
            concept3: <CreatingAlgebraicExpressionAdvanced />,
            practice: <PracticeCreatingAlgebraicExpression />,
            practice1: <PracticeCreatingAlgebraicExpression2 />,
            practice2: <PracticeCreatingAlgebraicExpression3 />
          }
        },
        {
          id: "1-8",
          title: "Let's understand the Expression a bit more?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Monomial, Binomial and Polynomial', icon: BookOpen }
              // { id: 'concept2', label: 'Create advanced algebraic expressions', icon: BookOpen },
              // { id: 'concept3', label: 'Create algebraic expressions for multiple variables', icon: BookOpen },
              // { id: 'practice', label: 'Practice Algebraic Expression', icon: PenTool },
              // { id: 'practice1', label: 'Practice Algebraic Expression', icon: PenTool }
            ],
            concept: <PolynomialLearningAlgebraicExpression />
            // concept2: <CreatingAlgebraicExpressionUnlikeTerms />,
            // concept3: <CreatingAlgebraicExpressionAdvanced />,
            // practice: <PracticeCreatingAlgebraicExpression />,
            // practice1: <PracticeCreatingAlgebraicExpression2 />
          }
        },
        {
          id: "1-3",
          title: "Solving Algebraic Expression?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Interactive Algebraic Expression', icon: BookOpen },
              { id: 'concept1', label: 'Performing actions on expression', icon: BookOpen },
              { id: 'concept2', label: 'Solving algebraic expression', icon: BookOpen },
              { id: 'concept3', label: 'Solving expression with negative case', icon: BookOpen },
              { id: 'practice1', label: 'Solve Expression', icon: PenTool },
              { id: 'practice2', label: 'Solve Expression', icon: PenTool }

            ],
            concept: <InteractiveAlgebraicIntroduction />,
            concept1: <AlgebraicExpressionSolutionIntro />,
            concept2: <AlgebraicExpressionSolutionBasic />,
            concept3: <AlgebraicExpressionSolutionNegativeCase />,
            practice1: <AlgebraicExpressionSolutionPracticeBasic />,
            practice2: <AlgebraicExpressionPracticeNegative />
          }
        },
        {
          id: "1-4",
          title: "Few fundamental things for Algebraic Expression?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Interactive Algebraic Expression', icon: BookOpen },
              { id: 'concept1', label: 'To handle X or number first?', icon: BookOpen },
              { id: 'concept2', label: 'When to Subtract vs divide', icon: BookOpen },
              { id: 'concept3', label: 'Like and Unlike terms', icon: BookOpen }
            ],
            concept: <AlgebraicExpressionVariableBothSide />,
            concept1: <AlgebraciExpressionGyaan />,
            concept2: <AlgebraicExpressionWhenToSubtractOrDivide />,
            concept3: <AlgebraicExpressionLikeUnlikeTerms />
          }
        },
        {
          id: "1-5",
          title: "Let's practice",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'practice', label: 'Initial', icon: PenTool },
              { id: 'practice1', label: 'Intermediate?', icon: PenTool },
              { id: 'practice2', label: 'One final practice', icon: PenTool }
              // { id: 'concept3', label: 'Like and Unlike terms', icon: BookOpen }
            ],
            practice: <AlgebraicExpressionPractice1 />,
            practice1: <AlgebraicExpressionPractice2 />,
            practice2: <AlgebraicExpressionPractice3 />,
            // concept3: <AlgebraicExpressionLikeUnlikeTerms />
          }
        },
        {
          id: "1-6",
          title: "Let's solve Level 1",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'test', label: 'Test Level 1', icon: FileText }
            ],
            test: <WarModeAlgebraicExpression1 />
          }
        },
        {
          id: "1-7",
          title: "Let's solve Level 2",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'test', label: 'Test Level 2', icon: FileText }
            ],
            test: <WarModeAlgebraicExpression2 />
          }
        }
      ],
    },
  ],
};
