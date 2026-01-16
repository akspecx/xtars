import { BookOpen, PenTool, FileText } from 'lucide-react'; // Import icons for the tabs
import LeftRightAdditionalPractice from './LeftRightAdditionalPractice.tsx'
import LeftLinearArrangement from './LeftLinearArrangement.tsx'
import RightLinearArrangement from './RightLinearArrangement.tsx'
import LeftRightPractice from './LeftRightPractice'
import BetweenArrangement from './BetweenArrangement'
import SecondToTheLeft from './SecondToTheLeft'
import SecondToTheRight from './SecondToTheRight'
import NthToTheLeft from './NthToTheLeft'
import NthToTheRight from './NthToTheRight'
import PeopleInBetween from './PeopleInBetween'
import ExplainLeftFromReference from './ExplainLeftFromReference'
import LineararrangementPracticeModule1 from './LineararrangementPracticeModule1'
import LeftLinearArrangement2Dimension from './LeftLinearArrangement2Dimension'
import WorkingWithInstruction from './WorkingWithInstruction'
import ImmediateLeftModule from './ImmediateLeftModule'
import ImmediateRightModule from './ImmediateRightModule'
import PracticeLeftandImmediateLeft from './PracticeLeftandImmediateLeft'
import PracticeRightandImmediateRight from './PracticeRightandImmediateRight'
import LeftRightCombinationPractice from './LeftRightCombinationPractice'
import ParallelSittingArrangementRight from './ParallelSittingArrangementRight'
import ParallelSittingArrangementLeft from './ParallelSittingArrangementLeft'
import ParallelSittingPractice from './ParallelLinePractice.tsx'
import ParallelLineExamMode from './ParallelLineExamMode'

export const sampleCourse = {
  title: "Linear arrangment",
  level: "Beginner",
  overallProgress: 25,
  modules: [
    {
      id: "1",
      title: "Module 1: Who is to my left and right",
      completedLessons: 1,
      totalLessons: 3,
      subModules: [
        {
          id: "1-1",
          title: "Lesson 1: Let's learn left and right?",
          difficulty: "Easy",
          duration: "15 min",
          completed: true,
          content: {
            tabs: [
              { id: 'concept', label: 'To the left', icon: BookOpen },
              { id: 'concept2', label: 'and what about the right?', icon: BookOpen },
              { id: 'concept3', label: 'Reference Matters?', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: PenTool },
              { id: 'test', label: 'More Practice', icon: PenTool },
            ],
            concept: <LeftLinearArrangement />,
            concept2: <RightLinearArrangement />,
            concept3: <ExplainLeftFromReference />,
            practice: <LeftRightPractice />,
            test:     <LeftRightAdditionalPractice />
          }
        },
        {
          id: "1-2",
          title: "Lesson 2: And who is between?",
          difficulty: "Medium",
          duration: "20 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Concept', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: PenTool },
            ],
            concept: <BetweenArrangement />,
            practice: "Practice exercises for Lesson 2: List and briefly describe two common types of industrial robots. Provide an example of a service robot you are familiar with."
          }
        },
        {
          id: "1-3",
          title: "Lesson 3: Nth to the left and right",
          difficulty: "Easy",
          duration: "10 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: '2nd to the left', icon: BookOpen },
              { id: 'concept2', label: '2nd to the right', icon: BookOpen },
            ],
            concept: <SecondToTheLeft />,
            concept2: <SecondToTheRight />
          }
        },
        {
          id: "1-4",
          title: "Lesson 4: Number of people in between, left and right",
          difficulty: "Medium",
          duration: "10 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Second to the left', icon: BookOpen },
              { id: 'concept2', label: 'Second to the right', icon: BookOpen },
              { id: 'concept3', label: '2 people in between', icon: BookOpen },
              // { id: 'concept3', label: '2 person between Annie and Ninnie', icon: BookOpen}
            ],
            concept: <NthToTheLeft />,
            concept2: <NthToTheRight />,
            concept3: <PeopleInBetween />
          }
        },
        {
          id: "1-5",
          title: "Lesson 5: Module practice",
          difficulty: "Medium",
          duration: "10 min",
          completed: false,
          content: {
            tabs: [
              { id: 'practice', label: 'Left', icon: PenTool },
              // { id: 'concept3', label: '2 person between Annie and Ninnie', icon: BookOpen}
            ],
            practice: <LineararrangementPracticeModule1 />,
          }
        }
      ],
    },
    {
      id: "2",
      title: "Module 2: Working with instructions",
      completedLessons: 0,
      totalLessons: 2,
      subModules: [
        {
          id: "2-1",
          title: "Lesson 1: Let's complete the instructions",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Concept', icon: BookOpen },
              { id: 'test', label: 'Test', icon: FileText }
            ],
            concept: <WorkingWithInstruction />,
            test: "Test questions for Lesson 1: What is the primary function of an end-effector in a robotic system?"
          }
        },
        {
          id: "2-2",
          title: "Lesson 2: Immediate Left and Immediate Right",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Left and Immediate Left', icon: BookOpen },
              { id: 'concept1', label: 'Right and Immediate Right', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: PenTool },
              { id: 'practice1', label: 'Practice..', icon: PenTool },
              { id: 'practice2', label: 'Practice More..', icon: PenTool }

            ],
            concept: <ImmediateLeftModule />,
            concept1: <ImmediateRightModule />,
            practice: <PracticeLeftandImmediateLeft/>,
            practice1: <PracticeRightandImmediateRight />,
            practice2: <LeftRightCombinationPractice />
          }
        }
      ],
    },
    {
      id: "3",
      title: "Module 3: Sitting in Parallel",
      completedLessons: 0,
      totalLessons: 2,
      subModules: [
        {
          id: "3-1",
          title: "Lesson 1: Let's understand right when people are sitting in parallel",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Concept', icon: BookOpen }
            ],
            concept: <ParallelSittingArrangementRight />
          }
        },
        {
          id: "3-2",
          title: "Lesson 1: Let's understand left when people are sitting in parallel",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Concept', icon: BookOpen }
            ],
            concept: <ParallelSittingArrangementLeft />
          }
        },
        {
          id: "3-3",
          title: "Lesson 1: Let's practice sitting arrangment in parallel",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'practice', label: 'Practice', icon: PenTool }
            ],
            practice: <ParallelSittingPractice />
          }
        },
        {
          id: "3-4",
          title: "Lesson 1: Let's learn the way to attempt the parallel sitting",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'practice', label: 'Practice', icon: PenTool }
            ],
            practice: <ParallelLineExamMode />
          }
        }
      ],
    },
    {
      id: "4",
      title: "Module 4: 2 Dimensions",
      completedLessons: 0,
      totalLessons: 2,
      subModules: [
        {
          id: "4-1",
          title: "Lesson 1: Let's work on 2 dimensions",
          difficulty: "Medium",
          duration: "25 min",
          completed: false,
          content: {
            tabs: [
              { id: 'concept', label: 'Concept', icon: BookOpen },
              { id: 'test', label: 'Test', icon: FileText }
            ],
            concept: <LeftLinearArrangement2Dimension />,
            test: "Test questions for Lesson 1: What is the primary function of an end-effector in a robotic system?"
          }
        }
      ],
    },
  ],
};
