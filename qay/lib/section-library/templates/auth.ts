import type { TemplateVariables } from './types';

export function getAuthTemplate(index: number, vars: TemplateVariables): string {
  // SVG Icons
  const googleIconSvg = `<svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>`;
  
  const githubIconSvg = `<svg class="size-4" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`;

  const templates = [
    // 0. Split Screen Auth Page (Inspired by Dribbble style)
    `<section class="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      <!-- Left side: Immersive Image with load shrink -->
      <div class="hidden lg:block relative overflow-hidden bg-zinc-900">
        <img 
          src="${vars.heroImage}" 
          alt="${vars.heroAlt}" 
          class="absolute inset-0 size-full object-cover opacity-80"
          data-qay-animate="zoom-out"
          data-qay-duration="1.6"
          data-qay-ease="power2.out"
        />
        <div class="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-12 left-12 right-12 z-10 text-white" data-qay-animate="slide-up">
          <p class="text-xs font-bold uppercase tracking-widest text-indigo-400">Secure Access</p>
          <h2 class="text-3xl font-black mt-2 leading-tight">Welcome back to QAY.</h2>
          <p class="mt-3 text-sm text-zinc-300">Create beautiful responsive layouts instantly, backed by smooth GSAP animations.</p>
        </div>
      </div>
      
      <!-- Right side: Sleek Glassmorphic Form -->
      <div class="flex items-center justify-center p-8 sm:p-12 md:p-16" data-qay-animate="slide-left" data-qay-duration="0.8">
        <div class="w-full max-w-md space-y-8">
          <div>
            <a href="/" class="text-2xl font-black tracking-tight" data-qm="brand-name">QAY</a>
            <h1 class="text-3xl font-extrabold mt-6">Log in to your account</h1>
            <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Welcome back! Please enter your details.</p>
          </div>
          
          <form class="space-y-4">
            <div>
              <label class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email Address</label>
              <input type="email" placeholder="name@company.com" class="mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
            </div>
            <div>
              <div class="flex justify-between items-center">
                <label class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Password</label>
                <a href="#" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</a>
              </div>
              <input type="password" placeholder="••••••••" class="mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
            </div>
            
            <button type="submit" class="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-sm font-bold text-white dark:text-zinc-950 transition shadow-md">
              Sign In
            </button>
          </form>
          
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span class="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">Or continue with</span>
            <div class="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-xs font-bold transition">
              ${googleIconSvg}
              Google
            </button>
            <button class="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-xs font-bold transition">
              ${githubIconSvg}
              GitHub
            </button>
          </div>
          
          <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account? 
            <a href="#" class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </section>`,

    // 1. Centered Glassmorphic Signup card
    `<section class="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white px-6 py-16 transition-colors duration-300 relative overflow-hidden">
      <!-- Background gradients -->
      <div class="absolute -top-40 -left-40 size-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 size-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      
      <div class="w-full max-w-md rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl" data-qay-animate="scale-in" data-qay-duration="0.7">
        <div class="text-center mb-8">
          <p class="text-2xl font-black tracking-tight" data-qm="brand-name">QAY</p>
          <h1 class="text-2xl font-extrabold mt-4">Create your account</h1>
          <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Join over 10,000 developers building with QAY.</p>
        </div>
        
        <form class="space-y-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input type="text" placeholder="John Doe" class="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</label>
            <input type="email" placeholder="name@company.com" class="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
            <input type="password" placeholder="Min. 8 characters" class="mt-1.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition" required />
          </div>
          
          <button type="submit" class="w-full h-11 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 text-xs font-bold text-white dark:text-zinc-950 transition uppercase tracking-wider">
            Get Started
          </button>
        </form>
        
        <p class="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          Already have an account? 
          <a href="#" class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Log in</a>
        </p>
      </div>
    </section>`,
  ];

  return templates[index % templates.length];
}
