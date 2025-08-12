export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">SpeakEasy</h1>
            <span className="text-sm text-muted-foreground">AI Podcast Generator</span>
          </div>
        </div>
      </div>
    </header>
  );
}