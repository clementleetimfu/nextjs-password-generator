'use client';

import { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PasswordDisplay } from '@/components/password-generator/password-display';
import { PasswordControls } from '@/components/password-generator/password-controls';
import { PinControls } from '@/components/password-generator/pin-controls';
import { PassphraseControls } from '@/components/password-generator/passphrase-controls';
import { HistorySlider } from '@/components/password-generator/history-slider';
import { ThemeToggle } from '@/components/password-generator/theme-toggle';
import { Icons } from '@/components/ui/icons';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { usePinGenerator } from '@/hooks/use-pin-generator';
import { usePassphraseGenerator } from '@/hooks/use-passphrase-generator';
import { useBreachCheckHandler } from '@/hooks/use-breach-check-handler';
import { useCredentialHistory } from '@/hooks/use-credential-history';
import { useTheme } from '@/hooks/use-theme';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useDesktop } from '@/hooks/use-desktop';
import type { CredentialType } from '@/types/generator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<CredentialType>('password');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { mode, toggle } = useTheme();
  const { handleBreachCheck } = useBreachCheckHandler();
  const { history, addToHistory, clearHistory } = useCredentialHistory();

  const passwordGenerator = usePasswordGenerator();
  const pinGenerator = usePinGenerator();
  const passphraseGenerator = usePassphraseGenerator();

  const handleCopy = useCallback(() => {
    toast.success('Copied to clipboard!', {
      description: 'Press C to copy again',
      duration: 2000,
    });
  }, []);

  const handlePasswordBreachCheck = useCallback(async () => {
    await handleBreachCheck(passwordGenerator.state.value, passwordGenerator.setBreachCheck);
  }, [handleBreachCheck, passwordGenerator]);

  const handlePinBreachCheck = useCallback(async () => {
    await handleBreachCheck(pinGenerator.state.value, pinGenerator.setBreachCheck);
  }, [handleBreachCheck, pinGenerator]);

  const handlePassphraseBreachCheck = useCallback(async () => {
    await handleBreachCheck(passphraseGenerator.state.value, passphraseGenerator.setBreachCheck);
  }, [handleBreachCheck, passphraseGenerator]);

  const getCurrentGenerate = useCallback(() => {
    switch (activeTab) {
      case 'password': return passwordGenerator.generate;
      case 'pin': return pinGenerator.generate;
      case 'passphrase': return passphraseGenerator.generate;
    }
  }, [activeTab, passwordGenerator.generate, pinGenerator.generate, passphraseGenerator.generate]);

  const getCurrentBreachCheck = useCallback(() => {
    switch (activeTab) {
      case 'password': return handlePasswordBreachCheck;
      case 'pin': return handlePinBreachCheck;
      case 'passphrase': return handlePassphraseBreachCheck;
    }
  }, [activeTab, handlePasswordBreachCheck, handlePinBreachCheck, handlePassphraseBreachCheck]);

  const handleRefreshWithHistory = useCallback(() => {
    const generator = getCurrentGenerate();
    generator();

    const currentGenerator = activeTab === 'password' ? passwordGenerator :
                          activeTab === 'pin' ? pinGenerator :
                          passphraseGenerator;

    addToHistory(currentGenerator.state.value, activeTab);
  }, [activeTab, getCurrentGenerate, passwordGenerator, pinGenerator, passphraseGenerator, addToHistory]);

  const handleRestoreHistory = useCallback((value: string) => {
    switch (activeTab) {
      case 'password':
        passwordGenerator.setValue(value);
        break;
      case 'pin':
        pinGenerator.setValue(value);
        break;
      case 'passphrase':
        passphraseGenerator.setValue(value);
        break;
    }
  }, [activeTab, passwordGenerator.setValue, pinGenerator.setValue, passphraseGenerator.setValue]);

  const getCurrentHistory = useCallback(() => {
    switch (activeTab) {
      case 'password': return history.password;
      case 'pin': return history.pin;
      case 'passphrase': return history.passphrase;
    }
  }, [activeTab, history.password, history.pin, history.passphrase]);

  const handleClearHistory = useCallback(() => {
    clearHistory(activeTab);
  }, [activeTab, clearHistory]);

  const isDesktop = useDesktop();

  useKeyboardShortcuts({
    onGenerate: handleRefreshWithHistory,
    onCopy: handleCopy,
    onBreachCheck: getCurrentBreachCheck(),
    onTabChange: setActiveTab,
    isEnabled: isDesktop,
  });

  const currentHistory = useMemo(() => getCurrentHistory(), [getCurrentHistory]);

  return (
    <div className="min-h-screen bg-background font-sans noise-overlay">
      <HistorySlider
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        type={activeTab}
        items={currentHistory}
        onRestore={handleRestoreHistory}
        onClear={handleClearHistory}
      />
      <ThemeToggle mode={mode} onToggle={toggle} />

      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16" data-testid="main-content">
        <div className="w-full max-w-3xl bg-card p-8 md:p-12 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              data-testid="history-toggle-button"
              title="View History"
            >
              <Icons.History />
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-center flex-1 text-zinc-900 dark:text-zinc-50 tracking-tight">
              Password Generator
            </h1>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as CredentialType)}
            className="w-full"
            data-testid="tabs"
          >
            <TabsList className="w-full">
              <TabsTrigger value="password" shortcut="TAB_PASSWORD" data-testid="tab-password" className="flex-1">
                Password
              </TabsTrigger>
              <TabsTrigger value="pin" shortcut="TAB_PIN" data-testid="tab-pin" className="flex-1" title="PINs are numeric-only codes (0-9) commonly used for device access.">
                PIN
              </TabsTrigger>
              <TabsTrigger value="passphrase" shortcut="TAB_PASSPHRASE" data-testid="tab-passphrase" className="flex-1" title="Passphrases use the EFF Long Wordlist (7776 common words) for memorable security.">
                Passphrase
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-12">
              <div className="flex flex-col items-center gap-10">
                <PasswordDisplay
                  value={passwordGenerator.state.value}
                  strength={passwordGenerator.state.strength}
                  breachCheck={passwordGenerator.state.breachCheck}
                  breachCount={passwordGenerator.state.breachCount}
                  onRefresh={passwordGenerator.generate}
                  onCopy={handleCopy}
                  onBreachCheck={handlePasswordBreachCheck}
                />
                <PasswordControls
                  length={passwordGenerator.state.length}
                  includeDigits={passwordGenerator.state.includeDigits}
                  includeSymbols={passwordGenerator.state.includeSymbols}
                  includeUppercase={passwordGenerator.state.includeUppercase}
                  onLengthChange={passwordGenerator.setLength}
                  onToggleDigits={passwordGenerator.toggleDigits}
                  onToggleSymbols={passwordGenerator.toggleSymbols}
                  onToggleUppercase={passwordGenerator.toggleUppercase}
                />
              </div>
            </TabsContent>

            <TabsContent value="pin" className="mt-12">
              <div className="flex flex-col items-center gap-10">
                <PasswordDisplay
                  value={pinGenerator.state.value}
                  strength={pinGenerator.state.strength}
                  breachCheck={pinGenerator.state.breachCheck}
                  breachCount={pinGenerator.state.breachCount}
                  onRefresh={pinGenerator.generate}
                  onCopy={handleCopy}
                  onBreachCheck={handlePinBreachCheck}
                />
                <PinControls
                  length={pinGenerator.state.length}
                  onLengthChange={pinGenerator.setLength}
                />
              </div>
            </TabsContent>

            <TabsContent value="passphrase" className="mt-12">
              <div className="flex flex-col items-center gap-10">
                <PasswordDisplay
                  value={passphraseGenerator.state.value}
                  strength={passphraseGenerator.state.strength}
                  breachCheck={passphraseGenerator.state.breachCheck}
                  breachCount={passphraseGenerator.state.breachCount}
                  onRefresh={passphraseGenerator.generate}
                  onCopy={handleCopy}
                  onBreachCheck={handlePassphraseBreachCheck}
                />
                <PassphraseControls
                  wordCount={passphraseGenerator.state.wordCount}
                  separator={passphraseGenerator.state.separator}
                  onWordCountChange={passphraseGenerator.setWordCount}
                  onSeparatorChange={passphraseGenerator.setSeparator}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
