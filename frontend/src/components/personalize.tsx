    type Props = {
    value: {
        software: string;
        hardware: string;
        goal: string;
    };
    onChange: (v: Props["value"]) => void;
    };

    export default function UserBackgroundForm({ value, onChange }: Props) {
    const update = (key: keyof Props["value"], v: string) =>
        onChange({ ...value, [key]: v });

    return (
        <div className="space-y-6">
        {/* Software */}
        <section>
            <h3>Software Background</h3>
            {[
            "Beginner (basic Python/JS)",
            "Intermediate (ROS, ML, CV basics)",
            "Advanced (Robotics, RL, Isaac, ROS 2 production)",
            ].map((o) => (
            <label key={o} className="block">
                <input
                type="radio"
                name="software"
                checked={value.software === o}
                onChange={() => update("software", o)}
                />
                {o}
            </label>
            ))}
        </section>

        {/* Hardware */}
        <section>
            <h3>Hardware Access</h3>
            {[
            "RTX-enabled PC (RTX 30/40 series)",
            "Jetson (Nano / Orin)",
            "Robot hardware (arm, quadruped, humanoid)",
            "Simulation only (no hardware)",
            ].map((o) => (
            <label key={o} className="block">
                <input
                type="radio"
                name="hardware"
                checked={value.hardware === o}
                onChange={() => update("hardware", o)}
                />
                {o}
            </label>
            ))}
        </section>

        {/* Goal */}
        <section>
            <h3>Learning Goal</h3>
            {[
            "Learn fundamentals of Physical AI",
            "Build simulated humanoids",
            "Deploy AI on real robots",
            "Research / startup / teaching",
            ].map((o) => (
            <label key={o} className="block">
                <input
                type="radio"
                name="goal"
                checked={value.goal === o}
                onChange={() => update("goal", o)}
                />
                {o}
            </label>
            ))}
        </section>
        </div>
    );
    }
