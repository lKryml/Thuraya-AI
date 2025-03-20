import { useState, useEffect } from 'react';
import { Home } from './components/home';
import { Sidebar } from './components/sidebar/Sidebar';
import { Docs } from './components/docs/Docs';
import { Onboarding } from './components/Onboarding';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<'chats' | 'docs' | undefined>(undefined);

  useEffect(() => {
    const storedTab = localStorage.getItem('selectedTab');
    if (storedTab && (storedTab === 'chats' || storedTab === 'docs')) {
      setSelectedTab(storedTab);
    } else {
      setSelectedTab('chats');
    }
  }, []);

  useEffect(() => {
    if (selectedTab) {
      localStorage.setItem('selectedTab', selectedTab);
    }
  }, [selectedTab]);

  if (selectedTab === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex h-screen'>
      <Onboarding />
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === 'chats' ? <Home /> : <Docs />}
    </div>
  );
}