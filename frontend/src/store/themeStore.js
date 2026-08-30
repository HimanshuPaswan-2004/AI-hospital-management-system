import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'Dark',
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem('theme', newMode ? 'Dark' : 'Light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newMode };
  }),
  initTheme: () => set((state) => {
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'Dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: isDark };
  })
}));

export default useThemeStore;
