import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import TodayView from '@/views/TodayView';
import StatsView from '@/views/StatsView';
import ProfileView from '@/views/ProfileView';
import { useHabits } from '@/lib/useHabits';
import { ThemeProvider } from '@/lib/theme-context';
import type { TabKey } from '@/lib/types';

function AppInner() {
  const [tab, setTab] = useState<TabKey>('today');
  const data = useHabits();

  const goBack = () => {
    setTab('today');
  };

  return (
    <div
      className="relative mx-auto flex min-h-screen flex-col"
      style={{
        backgroundColor: 'var(--bg)',
        maxWidth: 480,
        boxShadow: '0 0 60px var(--shadow)',
      }}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'today' && <TodayView data={data} />}
        {tab === 'stats' && <StatsView data={data} onBack={goBack} />}
        {tab === 'profile' && <ProfileView data={data} onBack={goBack} />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
