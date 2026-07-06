// Lead Scoring System - Automatic lead qualification and scoring

export interface LeadData {
  // Mortgage data
  annualIncome?: number;
  partnerIncome?: number;
  depositAmount?: number;
  propertyValue?: number;
  employmentStatus?: string;
  creditHistory?: string;
  mortgageType?: string;
  timeline?: string;
  
  // Insurance data
  insuranceProducts?: string[];
  dependants?: number;
  mortgageExposure?: number;
  
  // Contact data
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface LeadScore {
  totalScore: number;
  category: 'hot' | 'warm' | 'cold';
  mortgageScore: number;
  insuranceScore: number;
  breakdown: {
    income: number;
    deposit: number;
    property: number;
    employment: number;
    credit: number;
    insurance: number;
    timeline: number;
  };
  recommendations: string[];
}

// Scoring thresholds
const SCORE_THRESHOLDS = {
  hot: 70,    // 70+ = hot lead (immediate follow-up)
  warm: 50,   // 50-69 = warm lead (nurture sequence)
  cold: 0,    // 0-49 = cold lead (educational emails)
};

export function calculateLeadScore(leadData: LeadData): LeadScore {
  const breakdown = {
    income: 0,
    deposit: 0,
    property: 0,
    employment: 0,
    credit: 0,
    insurance: 0,
    timeline: 0,
  };

  // Income scoring (max 20 points)
  if (leadData.annualIncome) {
    const totalIncome = (leadData.annualIncome || 0) + (leadData.partnerIncome || 0);
    if (totalIncome >= 150000) breakdown.income = 20;
    else if (totalIncome >= 100000) breakdown.income = 15;
    else if (totalIncome >= 75000) breakdown.income = 12;
    else if (totalIncome >= 50000) breakdown.income = 8;
    else if (totalIncome >= 30000) breakdown.income = 4;
  }

  // Deposit scoring (max 15 points)
  if (leadData.depositAmount) {
    if (leadData.depositAmount >= 100000) breakdown.deposit = 15;
    else if (leadData.depositAmount >= 60000) breakdown.deposit = 12;
    else if (leadData.depositAmount >= 40000) breakdown.deposit = 9;
    else if (leadData.depositAmount >= 20000) breakdown.deposit = 6;
    else if (leadData.depositAmount >= 5000) breakdown.deposit = 3;
  }

  // Property value scoring (max 15 points)
  if (leadData.propertyValue) {
    if (leadData.propertyValue >= 800000) breakdown.property = 15;
    else if (leadData.propertyValue >= 500000) breakdown.property = 12;
    else if (leadData.propertyValue >= 300000) breakdown.property = 9;
    else if (leadData.propertyValue >= 150000) breakdown.property = 6;
    else if (leadData.propertyValue >= 50000) breakdown.property = 3;
  }

  // Employment status scoring (max 15 points)
  if (leadData.employmentStatus) {
    const status = leadData.employmentStatus.toLowerCase();
    if (status.includes('employed') || status.includes('director')) breakdown.employment = 15;
    else if (status.includes('self-employed') || status.includes('contractor')) breakdown.employment = 10;
    else if (status.includes('unemployed')) breakdown.employment = 0;
    else breakdown.employment = 8;
  }

  // Credit history scoring (max 15 points)
  if (leadData.creditHistory) {
    const credit = leadData.creditHistory.toLowerCase();
    if (credit.includes('excellent') || credit.includes('perfect')) breakdown.credit = 15;
    else if (credit.includes('good') || credit.includes('fair')) breakdown.credit = 10;
    else if (credit.includes('poor') || credit.includes('bad')) breakdown.credit = 0;
    else if (credit.includes('no defaults') || credit.includes('clean')) breakdown.credit = 12;
    else breakdown.credit = 8;
  }

  // Insurance products scoring (max 10 points)
  if (leadData.insuranceProducts && leadData.insuranceProducts.length > 0) {
    const numProducts = leadData.insuranceProducts.length;
    if (numProducts >= 5) breakdown.insurance = 10;
    else if (numProducts >= 3) breakdown.insurance = 7;
    else if (numProducts >= 1) breakdown.insurance = 4;
  }

  // Timeline scoring (max 10 points)
  if (leadData.timeline) {
    const timeline = leadData.timeline.toLowerCase();
    if (timeline.includes('immediately') || timeline.includes('urgent') || timeline.includes('now')) breakdown.timeline = 10;
    else if (timeline.includes('next month') || timeline.includes('1 month')) breakdown.timeline = 8;
    else if (timeline.includes('2-3 months')) breakdown.timeline = 5;
    else if (timeline.includes('3-6 months')) breakdown.timeline = 3;
    else breakdown.timeline = 1;
  }

  // Calculate total scores
  const mortgageScore = breakdown.income + breakdown.deposit + breakdown.property + breakdown.employment + breakdown.credit;
  const insuranceScore = breakdown.insurance + breakdown.timeline;
  const totalScore = mortgageScore + insuranceScore;

  // Determine category
  let category: 'hot' | 'warm' | 'cold' = 'cold';
  if (totalScore >= SCORE_THRESHOLDS.hot) category = 'hot';
  else if (totalScore >= SCORE_THRESHOLDS.warm) category = 'warm';

  // Generate recommendations
  const recommendations = generateRecommendations(leadData, breakdown, category);

  return {
    totalScore,
    category,
    mortgageScore,
    insuranceScore,
    breakdown,
    recommendations,
  };
}

function generateRecommendations(
  leadData: LeadData,
  breakdown: LeadScore['breakdown'],
  category: string
): string[] {
  const recommendations: string[] = [];

  if (category === 'hot') {
    recommendations.push('🔥 Hot lead - Schedule immediate callback');
    recommendations.push('Send personalized mortgage offer within 24 hours');
  } else if (category === 'warm') {
    recommendations.push('⚡ Warm lead - Add to nurture sequence');
    recommendations.push('Send educational content about mortgage types');
  } else {
    recommendations.push('📚 Cold lead - Add to content nurture track');
    recommendations.push('Send beginner guides and eligibility resources');
  }

  // Specific recommendations based on scoring
  if (breakdown.deposit < 6) {
    recommendations.push('Low deposit - Highlight 95% LTV products and government schemes');
  }

  if (breakdown.income < 8) {
    recommendations.push('Consider self-employed or complex income advisors');
  }

  if (breakdown.credit < 10) {
    recommendations.push('Mention credit repair resources and specialist lenders');
  }

  if (breakdown.insurance < 4 && leadData.mortgageType) {
    recommendations.push('Cross-sell life insurance and income protection');
  }

  if (breakdown.employment < 10) {
    recommendations.push('Highlight specialist products for self-employed');
  }

  if (breakdown.property < 9 && leadData.propertyValue && leadData.propertyValue < 150000) {
    recommendations.push('Consider first-time buyer assistance programs');
  }

  return recommendations;
}

export function formatLeadScore(score: LeadScore): {
  label: string;
  color: string;
  icon: string;
  description: string;
} {
  const leadFormats = {
    hot: {
      label: 'Hot Lead',
      color: '#dc2626', // red
      icon: '🔥',
      description: 'High-quality lead - immediate action recommended',
    },
    warm: {
      label: 'Warm Lead',
      color: '#f59e0b', // amber
      icon: '⚡',
      description: 'Quality lead - nurture and follow up',
    },
    cold: {
      label: 'Cold Lead',
      color: '#6b7280', // gray
      icon: '❄️',
      description: 'Educational lead - nurture with content',
    },
  };

  return leadFormats[score.category];
}

export function saveLead(leadData: LeadData, score: LeadScore): void {
  const leads = JSON.parse(localStorage.getItem('ftm_leads') || '[]');
  
  const newLead = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    data: leadData,
    score: score,
  };

  leads.push(newLead);
  localStorage.setItem('ftm_leads', JSON.stringify(leads));
  
  // Trigger analytics event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'lead_generated', {
      lead_score: score.totalScore,
      lead_category: score.category,
    });
  }
}

export function getLeads(): any[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('ftm_leads') || '[]');
}

export function clearLeads(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ftm_leads');
  }
}
