"use client"

// Neo-Retro Workbench Icons - Inspired by 80s tech aesthetics with modern gradients

export const WorkbenchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="workbenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d2ff" />
        <stop offset="100%" stopColor="#3a7bd5" />
      </linearGradient>
    </defs>
    <rect x="2" y="6" width="20" height="14" rx="2" stroke="url(#workbenchGrad)" strokeWidth="1.5" fill="none"/>
    <rect x="4" y="8" width="16" height="1" fill="url(#workbenchGrad)" opacity="0.6"/>
    <rect x="4" y="10" width="12" height="1" fill="url(#workbenchGrad)" opacity="0.4"/>
    <rect x="4" y="12" width="8" height="1" fill="url(#workbenchGrad)" opacity="0.4"/>
    <circle cx="19" cy="4" r="2" stroke="url(#workbenchGrad)" strokeWidth="1.5" fill="none"/>
    <path d="M17 4h4M19 2v4" stroke="url(#workbenchGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const GeneratorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="50%" stopColor="#4ecdc4" />
        <stop offset="100%" stopColor="#45b7d1" />
      </linearGradient>
    </defs>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#genGrad)" strokeWidth="1.5" strokeLinejoin="round" fill="url(#genGrad)" opacity="0.2"/>
    <path d="M2 17L12 22L22 17" stroke="url(#genGrad)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="url(#genGrad)" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="url(#genGrad)"/>
    <circle cx="12" cy="7" r="1" fill="url(#genGrad)" opacity="0.8"/>
    <circle cx="12" cy="17" r="1" fill="url(#genGrad)" opacity="0.8"/>
  </svg>
)

export const ContentLibraryIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="libGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffecd2" />
        <stop offset="100%" stopColor="#fcb69f" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="url(#libGrad)" strokeWidth="1.5" fill="none"/>
    <rect x="7" y="2" width="10" height="2" rx="1" fill="url(#libGrad)"/>
    <rect x="6" y="8" width="4" height="3" rx="1" fill="url(#libGrad)" opacity="0.6"/>
    <rect x="11" y="8" width="7" height="1" fill="url(#libGrad)" opacity="0.8"/>
    <rect x="11" y="10" width="5" height="1" fill="url(#libGrad)" opacity="0.6"/>
    <rect x="6" y="13" width="4" height="3" rx="1" fill="url(#libGrad)" opacity="0.6"/>
    <rect x="11" y="13" width="7" height="1" fill="url(#libGrad)" opacity="0.8"/>
    <rect x="11" y="15" width="6" height="1" fill="url(#libGrad)" opacity="0.6"/>
  </svg>
)

export const DistributionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="distGrad">
        <stop offset="0%" stopColor="#ff9a9e" />
        <stop offset="100%" stopColor="#fecfef" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#distGrad)" strokeWidth="1.5" fill="none" opacity="0.3"/>
    <circle cx="12" cy="12" r="6" stroke="url(#distGrad)" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <circle cx="12" cy="12" r="2" fill="url(#distGrad)"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="url(#distGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <path d="M5.64 5.64l2.83 2.83M15.53 15.53l2.83 2.83M18.36 5.64l-2.83 2.83M8.47 15.53l-2.83 2.83" stroke="url(#distGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

export const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <rect x="3" y="16" width="4" height="6" rx="1" fill="url(#analyticsGrad)" opacity="0.7"/>
    <rect x="8" y="12" width="4" height="10" rx="1" fill="url(#analyticsGrad)" opacity="0.8"/>
    <rect x="13" y="8" width="4" height="14" rx="1" fill="url(#analyticsGrad)" opacity="0.9"/>
    <rect x="18" y="4" width="4" height="18" rx="1" fill="url(#analyticsGrad)"/>
    <path d="M2 2L6 6L10 4L14 8L18 5L22 9" stroke="url(#analyticsGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="6" cy="6" r="2" fill="url(#analyticsGrad)"/>
    <circle cx="10" cy="4" r="2" fill="url(#analyticsGrad)"/>
    <circle cx="14" cy="8" r="2" fill="url(#analyticsGrad)"/>
    <circle cx="18" cy="5" r="2" fill="url(#analyticsGrad)"/>
  </svg>
)

export const AIToolsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M12 2L16 8L12 14L8 8L12 2Z" stroke="url(#aiGrad)" strokeWidth="1.5" fill="url(#aiGrad)" opacity="0.3"/>
    <circle cx="12" cy="12" r="8" stroke="url(#aiGrad)" strokeWidth="1.5" fill="none" opacity="0.4"/>
    <circle cx="12" cy="12" r="4" stroke="url(#aiGrad)" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <circle cx="12" cy="12" r="2" fill="url(#aiGrad)"/>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="url(#aiGrad)" strokeWidth="1" opacity="0.5" strokeDasharray="2 2"/>
    <circle cx="18" cy="6" r="1" fill="url(#aiGrad)" opacity="0.8"/>
    <circle cx="6" cy="18" r="1" fill="url(#aiGrad)" opacity="0.8"/>
    <circle cx="6" cy="6" r="0.5" fill="url(#aiGrad)" opacity="0.6"/>
    <circle cx="18" cy="18" r="0.5" fill="url(#aiGrad)" opacity="0.6"/>
  </svg>
)

export const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <path d="M12 1L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 1Z" stroke="url(#settingsGrad)" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="3" stroke="url(#settingsGrad)" strokeWidth="1.5" fill="url(#settingsGrad)" opacity="0.3"/>
    <path d="M12 9v6M9 12h6" stroke="url(#settingsGrad)" strokeWidth="1" opacity="0.7"/>
  </svg>
)

export const BillingIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="billingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd89b" />
        <stop offset="100%" stopColor="#19547b" />
      </linearGradient>
    </defs>
    <rect x="2" y="6" width="20" height="12" rx="3" stroke="url(#billingGrad)" strokeWidth="1.5" fill="url(#billingGrad)" opacity="0.2"/>
    <rect x="2" y="6" width="20" height="4" rx="3" fill="url(#billingGrad)" opacity="0.6"/>
    <circle cx="6" cy="14" r="1" fill="url(#billingGrad)"/>
    <rect x="10" y="13" width="8" height="2" rx="1" fill="url(#billingGrad)" opacity="0.8"/>
  </svg>
)

export const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="helpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c471f5" />
        <stop offset="100%" stopColor="#fa71cd" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#helpGrad)" strokeWidth="1.5" fill="none"/>
    <path d="M9.09 9A3 3 0 0115 9C15 11 12 10.5 12 13.5" stroke="url(#helpGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="url(#helpGrad)"/>
    <path d="M8 8L16 16M16 8L8 16" stroke="url(#helpGrad)" strokeWidth="0.5" opacity="0.3"/>
  </svg>
)

export const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff758c" />
        <stop offset="100%" stopColor="#ff7eb3" />
      </linearGradient>
    </defs>
    <path d="M16 17L21 12L16 7" stroke="url(#logoutGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="url(#logoutGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="url(#logoutGrad)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Stats Icons for Dashboard
export const ModelsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="modelsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="6" height="6" rx="2" fill="url(#modelsGrad)" opacity="0.6"/>
    <rect x="15" y="3" width="6" height="6" rx="2" fill="url(#modelsGrad)" opacity="0.8"/>
    <rect x="3" y="15" width="6" height="6" rx="2" fill="url(#modelsGrad)" opacity="0.7"/>
    <rect x="15" y="15" width="6" height="6" rx="2" fill="url(#modelsGrad)"/>
    <path d="M9 6h6M6 9v6M18 9v6M9 18h6" stroke="url(#modelsGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export const PlatformsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="platformsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#platformsGrad)" strokeWidth="1.5" fill="none" opacity="0.3"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="url(#platformsGrad)" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="url(#platformsGrad)" opacity="0.8"/>
  </svg>
)

export const DataProcessedIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fa709a" />
        <stop offset="100%" stopColor="#fee140" />
      </linearGradient>
    </defs>
    <rect x="2" y="3" width="20" height="4" rx="2" fill="url(#dataGrad)" opacity="0.6"/>
    <rect x="2" y="10" width="20" height="4" rx="2" fill="url(#dataGrad)" opacity="0.7"/>
    <rect x="2" y="17" width="20" height="4" rx="2" fill="url(#dataGrad)" opacity="0.8"/>
    <circle cx="5" cy="5" r="1" fill="white"/>
    <circle cx="5" cy="12" r="1" fill="white"/>
    <circle cx="5" cy="19" r="1" fill="white"/>
    <rect x="8" y="4" width="12" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="8" y="11" width="8" height="2" rx="1" fill="white" opacity="0.8"/>
    <rect x="8" y="18" width="10" height="2" rx="1" fill="white" opacity="0.8"/>
  </svg>
)

export const APICallsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="apiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="url(#apiGrad)" strokeWidth="1.5" fill="url(#apiGrad)" opacity="0.3"/>
    <circle cx="7" cy="7" r="1" fill="url(#apiGrad)" opacity="0.8"/>
    <circle cx="17" cy="17" r="1" fill="url(#apiGrad)" opacity="0.8"/>
    <circle cx="5" cy="17" r="0.5" fill="url(#apiGrad)" opacity="0.6"/>
    <circle cx="19" cy="7" r="0.5" fill="url(#apiGrad)" opacity="0.6"/>
  </svg>
)