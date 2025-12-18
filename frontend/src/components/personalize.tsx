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

  const Section = ({
    title,
    name,
    options,
  }: {
    title: string;
    name: keyof Props["value"];
    options: string[];
  }) => (
    <section style={{ marginTop: "1.5rem" }}>
      <h4
        style={{
          marginBottom: "0.75rem",
          color: "#00ff41",
          fontSize: "1.1rem",
        }}
      >
        {title}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {options.map((opt) => (
          <label
            key={opt}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#ccffda",
              fontSize: "0.9rem",
            }}
          >
            <input
              type="radio"
              name={name}
              checked={value[name] === opt}
              onChange={() => update(name, opt)}
              style={{
                marginRight: "0.5rem",
                accentColor: "#00ff41",
              }}
            />
            {opt}
          </label>
        ))}
      </div>
    </section>
  );

  return (
    <div>
      <Section
        title="Software Background"
        name="software"
        options={[
          "Beginner (basic Python/JS)",
          "Intermediate (ROS, ML, CV basics)",
          "Advanced (Robotics, RL, Isaac, ROS 2 production)",
        ]}
      />
      <Section
        title="Hardware Access"
        name="hardware"
        options={[
          "RTX-enabled PC (RTX 30/40 series)",
          "Jetson (Nano / Orin)",
          "Robot hardware (arm, quadruped, humanoid)",
          "Simulation only (no hardware)",
        ]}
      />
      <Section
        title="Learning Goal"
        name="goal"
        options={[
          "Learn fundamentals of Physical AI",
          "Build simulated humanoids",
          "Deploy AI on real robots",
          "Research / startup / teaching",
        ]}
      />
    </div>
  );
}
