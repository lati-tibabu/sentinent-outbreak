
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, LogIn, UserPlus, Zap, BarChart3, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
      <header className="py-6 px-4 md:px-8 shadow-md bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Outbreak Sentinel</h1>
          </div>
          <nav className="space-x-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/register-users">Admin Setup</Link>
            </Button>
             <Button asChild variant="outline">
              <Link href="/report/anonymous">Anonymous Report</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center bg-gradient-to-b from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <ShieldCheck className="h-20 w-20 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
              Welcome to Outbreak Sentinel
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Proactive Disease Surveillance for a Healthier Ethiopia. Empowering health professionals with timely data for effective response.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/login">
                  <LogIn className="mr-2" /> Access System
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/admin/register-users">
                  <UserPlus className="mr-2" /> Register Users (Admin)
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-semibold text-primary mb-6">About Outbreak Sentinel</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                            Outbreak Sentinel is a comprehensive system designed to empower Health Extension Workers (HEWs) and Woreda Health Officers in Ethiopia. It facilitates rapid reporting of suspected disease outbreaks, enables efficient data collection, and provides tools for monitoring and analysis to support timely public health interventions.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Our goal is to strengthen Ethiopia's public health infrastructure by providing a reliable and user-friendly platform for disease surveillance.
                        </p>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                        <Image 
                            src="https://picsum.photos/seed/healthworkers/600/338" 
                            alt="Health workers collaborating"
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint="health workers Ethiopia"
                             className="rounded-lg"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-muted/40">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold text-primary mb-12 text-center">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                     <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Rapid Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">HEWs can quickly submit suspected case reports via mobile-friendly forms, even in low-connectivity areas.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-3">
                        <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Data Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">Officers can view aggregated data, trends, and generate reports for informed decision-making.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-3">
                        <MapPin className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle>Geospatial Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">Visualize outbreak locations and regional distribution on maps (simulated) for better resource allocation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 bg-primary text-primary-foreground">
        <p>&copy; {new Date().getFullYear()} Outbreak Sentinel. Supporting Public Health in Ethiopia.</p>
      </footer>
    </div>
  );
}
