import { Download, CheckCircle, AlertTriangle, ExternalLink, Apple, HardDrive, Wifi, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function SetupPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-wider">Cognitext</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </a>
          </nav>
        </div>
      </header>

      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Installation Guide
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow these simple steps to install Cognitext on your macOS device
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl mt-16 space-y-8">
            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Prerequisites
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ensure your Mac meets these requirements before installation
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Apple className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">macOS Version</h4>
                      <p className="text-sm text-muted-foreground">macOS 10.14 (Mojave) or later</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Architecture</h4>
                      <p className="text-sm text-muted-foreground">Intel (x64) or Apple Silicon (M1/M2/M3)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Storage</h4>
                      <p className="text-sm text-muted-foreground">At least 500MB of free disk space</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wifi className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Internet</h4>
                      <p className="text-sm text-muted-foreground">Required for initial setup and API functionality</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Download */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  Step 1: Download the Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Visit the Download Link</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Go to our secure download folder to access the latest version
                      </p>
                      <Button asChild variant="outline" className="gap-2">
                        <a 
                          href="https://drive.google.com/drive/folders/1V30kiuDcuIcxBSXVsZiNAshs7xiXsum6?usp=sharing" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Download Folder
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Download the DMG File</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Look for <code className="bg-muted px-1 rounded text-xs">Cognitext-1.0.0.dmg</code> (210.3 MB)</li>
                        <li>• Click on the file to download it to your Mac</li>
                        <li>• The download will appear in your Downloads folder</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Install */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-green-500" />
                  Step 2: Install Cognitext
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Open the DMG File</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Navigate to your Downloads folder</li>
                        <li>• Double-click on <code className="bg-muted px-1 rounded text-xs">Cognitext-1.0.0.dmg</code></li>
                        <li>• A new window will open showing the Cognitext application</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Install the Application</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Drag the <code className="bg-muted px-1 rounded text-xs">Cognitext</code> icon to the <code className="bg-muted px-1 rounded text-xs">Applications</code> folder</li>
                        <li>• Wait for the copy process to complete</li>
                        <li>• Close the DMG window</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Eject the DMG</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• In Finder, click the eject button next to "Cognitext" in the sidebar</li>
                        <li>• Or right-click on the DMG and select "Eject"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: First Launch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Step 3: First Launch Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Launch Cognitext</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Open Finder and go to Applications</li>
                        <li>• Double-click on <code className="bg-muted px-1 rounded text-xs">Cognitext</code> to launch the application</li>
                        <li>• <strong>Note:</strong> On first launch, macOS may show a security warning</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Handle Security Warning (if prompted)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                        <li>• Click "Open" when macOS asks if you want to open the application</li>
                        <li>• If you see "Cognitext cannot be opened because it is from an unidentified developer":</li>
                        <li className="ml-4">- Go to <strong>System Preferences</strong> → <strong>Security & Privacy</strong></li>
                        <li className="ml-4">- Click the lock icon to make changes (enter your password)</li>
                        <li className="ml-4">- Click "Open Anyway" next to Cognitext</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Troubleshooting
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Common issues and their solutions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      !
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700">Security Warning</h4>
                      <p className="text-sm text-orange-600">
                        If macOS blocks the app, go to System Preferences → Security & Privacy → General tab and click "Open Anyway"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      !
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700">Download Issues</h4>
                      <p className="text-sm text-orange-600">
                        If the download fails, try refreshing the page or using a different browser
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      !
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700">Installation Problems</h4>
                      <p className="text-sm text-orange-600">
                        Ensure you have sufficient disk space and are dragging to the Applications folder, not a subfolder
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
              <p className="text-muted-foreground">
                Download Cognitext now and experience the future of AI-powered text processing
              </p>
              <Button size="lg" className="gap-2">
                <Download className="h-4 w-4" />
                Download Cognitext
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 