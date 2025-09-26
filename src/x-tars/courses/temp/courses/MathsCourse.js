export const MathsCourse = {
    id: 1,
    title: "Learn Maths",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop&crop=faces",
    lessons: 6,
    students: 198,
    level: "Beginner",
    rating: 4.8,
    modules: [
      {
        id: 1,
        title: "Algebraic Expressions",
        description: "Learn the fundamentals of algebraic expressions",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=faces",
        lessons: 10,
        duration: "45 min",
        status: "success",
        navigationPath: "/courses/maths"
      },
      {
        id: 2,
        title: "Time and Work",
        description: "Master seating arrangment in circular format",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop&crop=faces",
        lessons: 4,
        duration: "60 min",
        status: "in-progress",
        navigationPath: "/courses/maths/timeAndWork"
      },
      {
        id: 3,
        title: "Blood relations",
        description: "Explore relations between individuals",
        image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=200&fit=crop&crop=faces",
        lessons: 3,
        duration: "70 min",
        status: "pending",
        navigationPath: "/courses/logical-reasoning/blood-relations"
      },
      {
        id: 4,
        title: "Syllogism",
        description: "if All A is B then ?",
        image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&h=200&fit=crop&crop=faces",
        lessons: 5,
        duration: "70 min",
        status: "pending",
        navigationPath: "/courses/logical-reasoning/syllogism"
      }
    ]
  };