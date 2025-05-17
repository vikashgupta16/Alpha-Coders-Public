
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <Zap className="w-16 h-16 text-accent mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-primary">Alpha Coders:</span>
          <span className="text-foreground"> Engineering the Future</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Showcasing our team&apos;s innovative projects, collaborative spirit, and cutting-edge technological prowess. Explore our contributions and discover the power of AI in modern development.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-shadow" asChild>
            <Link href="#projects">
              Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {/* "Try AI Assistant" button removed */}
        </div>
      </div>
    </section>
  );
}

    