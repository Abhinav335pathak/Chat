import { useTheme } from "../context/themeContext.jsx";

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current: {theme} (Click to toggle)
    </button>
  );
};

export default Settings;
