'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PasswordDisplay } from '@/components/password-generator/password-display';
import { PasswordControls } from '@/components/password-generator/password-controls';
import { PinControls } from '@/components/password-generator/pin-controls';
import { PassphraseControls } from '@/components/password-generator/passphrase-controls';
import { ThemeToggle } from '@/components/password-generator/theme-toggle';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { usePinGenerator } from '@/hooks/use-pin-generator';
import { usePassphraseGenerator } from '@/hooks/use-passphrase-generator';
import { useBreachCheck } from '@/hooks/use-breach-check';
import { useTheme } from '@/hooks/use-theme';
import type { CredentialType } from '@/types/generator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<CredentialType>('password');
  const { mode, toggle } = useTheme();
  const { performBreachCheck } = useBreachCheck();

  // Password generator
  const passwordGenerator = usePasswordGenerator();
  const handlePasswordBreachCheck = async () => {
    performBreachCheck(passwordGenerator.state.value);
  };

  // PIN generator
  const pinGenerator = usePinGenerator();
  const handlePinBreachCheck = async () => {
    performBreachCheck(pinGenerator.state.value);
  };

  // Passphrase generator
  const passphraseGenerator = usePassphraseGenerator();
  const handlePassphraseBreachCheck = async () => {
    performBreachCheck(passphraseGenerator.state.value);
  };

  const handleCopy = () => {
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <ThemeToggle mode={mode} onToggle={toggle} /> 

      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16" data-testid="main-content">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-50">
            Password Generator
          </h1> 

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as CredentialType)}
            className="w-full"
            data-testid="tabs"
          >
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="password" data-testid="tab-password">Password</TabsTrigger>
              <TabsTrigger value="pin" data-testid="tab-pin">PIN</TabsTrigger>
              <TabsTrigger value="passphrase" data-testid="tab-passphrase">Passphrase</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="mt-6">
              <div className="flex flex-col items-center gap-8">
                <PasswordDisplay
                  value={passwordGenerator.state.value}
                  type="password"
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

            <TabsContent value="pin" className="mt-6">
              <div className="flex flex-col items-center gap-8">
                <PasswordDisplay
                  value={pinGenerator.state.value}
                  type="pin"
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

            <TabsContent value="passphrase" className="mt-6">
              <div className="flex flex-col items-center gap-8">
                <PasswordDisplay
                  value={passphraseGenerator.state.value}
                  type="passphrase"
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
