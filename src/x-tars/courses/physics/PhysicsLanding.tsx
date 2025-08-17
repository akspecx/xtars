
export default function PhysicsLanding() {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Physics Course</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mechanics Module */}
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Mechanics</h2>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>• Newton's Laws of Motion</li>
                        <li>• Force and Energy</li>
                        <li>• Momentum and Collisions</li>
                    </ul>
                </div>

                {/* Thermodynamics Module */}
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Thermodynamics</h2>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>• Heat and Temperature</li>
                        <li>• Laws of Thermodynamics</li>
                        <li>• Entropy and Energy Transfer</li>
                    </ul>
                </div>

                {/* Electromagnetism Module */}
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Electromagnetism</h2>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>• Electric Fields</li>
                        <li>• Magnetic Fields</li>
                        <li>• Electromagnetic Waves</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
