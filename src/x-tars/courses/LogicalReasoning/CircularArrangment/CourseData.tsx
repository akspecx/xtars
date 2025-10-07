import { BookOpen, PenTool, FileText } from 'lucide-react'; // Import icons for the tabs
import CircularArrangementIntro from './CircularArrangementIntro.tsx'
import ImmediateLeftCA from './ImmediateLeftCA.tsx'
import ImmediateRightCA from './ImmediateRightCA.tsx'
import LeftRightCA from './LeftRightCA'
// import BetweenArrangement from './BetweenArrangement'
// import SecondToTheLeft from './SecondToTheLeft'
// import SecondToTheRight from './SecondToTheRight'
// import NthToTheLeft from './NthToTheLeft'
// import NthToTheRight from './NthToTheRight'
// import PeopleInBetween from './PeopleInBetween'
// import ExplainLeftFromReference from './ExplainLeftFromReference'
// import LineararrangementPracticeModule1 from './LineararrangementPracticeModule1'
// import LeftLinearArrangement2Dimension from './LeftLinearArrangement2Dimension'
// import WorkingWithInstruction from './WorkingWithInstruction'
// import ImmediateLeftModule from './ImmediateLeftModule'
// import ImmediateRightModule from './ImmediateRightModule'
// import PracticeLeftandImmediateLeft from './PracticeLeftandImmediateLeft'
// import PracticeRightandImmediateRight from './PracticeRightandImmediateRight'
// import LeftRightCombinationPractice from './LeftRightCombinationPractice'
// import ParallelSittingArrangementRight from './ParallelSittingArrangementRight'
// import ParallelSittingArrangementLeft from './ParallelSittingArrangementLeft'
// import ParallelSittingPractice from './ParallelLinePractice.tsx'
// import ParallelLineExamMode from './ParallelLineExamMode'

export const sampleCourse = {
  title: "Linear arrangment",
  level: "Beginner",
  overallProgress: 25,
  modules: [
    {
      id: "1",
      title: "Module 1: Introduction to circular Arrangement",
      completedLessons: 1,
      totalLessons: 3,
      subModules: [
        {
          id: "1-1",
          title: "Lesson 1: What and Why?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'Why to read?', icon: BookOpen }
            //   { id: 'concept2', label: 'Introduction to basics?', icon: BookOpen },
            //   { id: 'concept3', label: 'Reference Matters?', icon: BookOpen },
            //   { id: 'practice', label: 'Practice', icon: PenTool },
            //   { id: 'test', label: 'More Practice', icon: PenTool },
            ],
            concept: <CircularArrangementIntro />
            // concept2: <ImmediateLeftCA />,
            // concept3: <ExplainLeftFromReference />,
            // practice: <LeftRightPractice />,
            // test:     <LeftRightAdditionalPractice />
          }
        },
        {
            id: "1-2",
            title: "Lesson 1: Let's learn the basics?",
            difficulty: "Easy",
            duration: "15 min",
            completed: true,
            content: {
              tabs: [
                { id: 'concept', label: 'Left?', icon: BookOpen },
                { id: 'concept1', label: 'Right?', icon: BookOpen },
                { id: 'concept2', label: 'Left and Right', icon: PenTool }
              //   { id: 'test', label: 'More Practice', icon: PenTool },
              ],
              concept2: <LeftRightCA />,
              concept: <ImmediateLeftCA />,
              concept1: <ImmediateRightCA />
              // practice: <LeftRightPractice />,
              // test:     <LeftRightAdditionalPractice />
            }
          }
      ],
    },
    
  ],
};
