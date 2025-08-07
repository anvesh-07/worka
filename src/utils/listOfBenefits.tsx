import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
  SmileIcon,
} from "lucide-react";

export interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  // Financial Benefits
  { id: "401k", label: "401(k) plan", icon: <Briefcase className="w-3 h-3" /> },
  {
    id: "stock_options",
    label: "Stock options",
    icon: <Coins className="w-3 h-3" />,
  },
  {
    id: "bonus_program",
    label: "Annual bonus program",
    icon: <PieChart className="w-3 h-3" />,
  },
  {
    id: "profit_sharing",
    label: "Profit sharing",
    icon: <PieChart className="w-3 h-3" />,
  },
  {
    id: "referral_bonus",
    label: "Referral bonus",
    icon: <UserPlus className="w-3 h-3" />,
  },
  {
    id: "crypto_pay",
    label: "Pay in cryptocurrency",
    icon: <Bitcoin className="w-3 h-3" />,
  },

  // Insurance & Healthcare
  {
    id: "medical",
    label: "Medical insurance",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "dental",
    label: "Dental insurance",
    icon: <Tooth className="w-3 h-3" />,
  },
  {
    id: "vision",
    label: "Vision insurance",
    icon: <Eye className="w-3 h-3" />,
  },
  {
    id: "mental_health",
    label: "Mental health support",
    icon: <Brain className="w-3 h-3" />,
  },
  {
    id: "family_health",
    label: "Family health coverage",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "life_insurance",
    label: "Life insurance",
    icon: <Shield className="w-3 h-3" />,
  },

  // Time Off & Leave
  { id: "pto", label: "Paid time off", icon: <Clock className="w-3 h-3" /> },
  {
    id: "unlimited_vacation",
    label: "Unlimited vacation",
    icon: <Umbrella className="w-3 h-3" />,
  },
  {
    id: "parental_leave",
    label: "Parental leave",
    icon: <UserPlus className="w-3 h-3" />,
  },
  {
    id: "sabbatical",
    label: "Sabbatical leave",
    icon: <Calendar className="w-3 h-3" />,
  },
  {
    id: "wellness_days",
    label: "Wellness days",
    icon: <Umbrella className="w-3 h-3" />,
  },
  {
    id: "no_meeting_fridays",
    label: "No meeting Fridays",
    icon: <MonitorOff className="w-3 h-3" />,
  },

  // Flexibility & Remote
  {
    id: "remote_friendly",
    label: "Remote friendly",
    icon: <Home className="w-3 h-3" />,
  },
  {
    id: "work_from_anywhere",
    label: "Work from anywhere",
    icon: <Home className="w-3 h-3" />,
  },
  {
    id: "flex_hours",
    label: "Flexible hours",
    icon: <Clock className="w-3 h-3" />,
  },
  {
    id: "four_day_week",
    label: "4-day workweek",
    icon: <Calendar className="w-3 h-3" />,
  },

  // Learning & Development
  {
    id: "learning_budget",
    label: "Learning budget",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "certification_support",
    label: "Certification support",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "mentorship",
    label: "Mentorship programs",
    icon: <UserCircle className="w-3 h-3" />,
  },
  {
    id: "conference_attendance",
    label: "Conference attendance",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  {
    id: "internal_workshops",
    label: "Internal workshops",
    icon: <Brain className="w-3 h-3" />,
  },

  // Office & Equipment
  {
    id: "home_office",
    label: "Home office stipend",
    icon: <Home className="w-3 h-3" />,
  },
  {
    id: "device_budget",
    label: "Device purchase budget",
    icon: <MonitorOff className="w-3 h-3" />,
  },
  {
    id: "productivity_tools",
    label: "Premium productivity tools",
    icon: <Zap className="w-3 h-3" />,
  },

  // Lifestyle & Wellness
  {
    id: "gym",
    label: "Gym membership",
    icon: <Dumbbell className="w-3 h-3" />,
  },
  {
    id: "nutrition_support",
    label: "Nutrition counseling",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "therapy_sessions",
    label: "Therapy sessions",
    icon: <Heart className="w-3 h-3" />,
  },
  {
    id: "free_meals",
    label: "Free meals",
    icon: <SmileIcon className="w-3 h-3" />,
  },
  {
    id: "snacks",
    label: "Free snacks",
    icon: <SmileIcon className="w-3 h-3" />,
  },
  {
    id: "massage",
    label: "Massage therapy",
    icon: <Heart className="w-3 h-3" />,
  },

  // Work Culture
  {
    id: "team_retreats",
    label: "Team retreats",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "inclusive_culture",
    label: "Inclusive culture",
    icon: <Users className="w-3 h-3" />,
  },
  {
    id: "diversity_programs",
    label: "Diversity programs",
    icon: <Users className="w-3 h-3" />,
  },
  {
    id: "employee_groups",
    label: "Employee resource groups",
    icon: <UserCircle className="w-3 h-3" />,
  },

  // Security & Legal
  {
    id: "identity_protection",
    label: "Identity protection",
    icon: <Shield className="w-3 h-3" />,
  },
  {
    id: "legal_assistance",
    label: "Legal assistance",
    icon: <Shield className="w-3 h-3" />,
  },
  {
    id: "no_monitoring",
    label: "No employee tracking",
    icon: <Shield className="w-3 h-3" />,
  },

  // Commuting
  {
    id: "commute_stipend",
    label: "Commute stipend",
    icon: <Building className="w-3 h-3" />,
  },
  {
    id: "parking_allowance",
    label: "Parking allowance",
    icon: <Briefcase className="w-3 h-3" />,
  },
  {
    id: "bike_to_work",
    label: "Bike to work support",
    icon: <Dumbbell className="w-3 h-3" />,
  },
];
