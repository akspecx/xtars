import PageMeta from "../../components/common/PageMeta";
import { useParams } from 'react-router';
import { lazy, Suspense } from "react";

//import Roadmap from "../Roadmap";
// //import Game from "./Game";

// const LazyAccountancy = lazy(() => import('./accountancy/AccountancyLanding.tsx'));
// // point to an existing maths entry (AlgebraicExpression index)
// const LazyMath = lazy(() => import('./maths/AlgebraicExpression/mathsIndex.tsx'));
// const LinearArrangementIndex = lazy(() => import('./LogicalReasoning/LinearArrangement/LinearArrangmentIndex.tsx'));
// const CircularArrangementIndex = lazy(() => import('./LogicalReasoning/CircularArrangment/CircularArrangementIndex.tsx'))
// // optional: a focused maths sub-module (kept if present)
// const AlgebraicExpressionIndex = lazy(() => import('./maths/AlgebraicExpression/mathsIndex.tsx'));

// const LazyPhysics = lazy(() => import('./Learn/physics/WhyPhysics.tsx'));
// const WhyPhysics = lazy(() => import('./Learn/physics/WhyPhysics.tsx'));
// const Light = lazy(() => import('./Learn/physics/Light.tsx'));
// const LightGemini = lazy(() => import('./Learn/physics/LightGemini.tsx'));

const lazyCourseMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
    accountancy: LazyAccountancy,
    maths: LazyMath,
    lineararrangement: LinearArrangementIndex,
    circulararrangement: CircularArrangementIndex,
    // math sub section (if used by UI)
    algebraicexpression: AlgebraicExpressionIndex,
    // physics related entries
    physics: LazyPhysics,
    whyphysics: WhyPhysics,
    light: Light,
    lightgemini: LightGemini
};


export default function CoursesRouter() {
    // Extract the `id` param from the URL
    const { courseid } = useParams<{ courseid: string }>();
    console.log(courseid);
    
    if (!courseid) return <div>❌ No course ID provided.</div>;

    const CourseComponent = lazyCourseMap[courseid.toLowerCase()];

    return (
        <>
            <PageMeta
                title={`Course - ${courseid}`}
                description="XTARS - Interactive Learning Platform for Students"
            />

            {/* <Roadmap/> */}
            <Suspense fallback={<div>⏳ Loading course...</div>}>
                {CourseComponent ? (
                    <CourseComponent />
                ) : (
                    <div>❓ Course not found: {courseid}</div>
                )}
            </Suspense>
            {/* <Game/> */}
        </>
    );
}
