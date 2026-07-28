import {
  Check,
  X,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  User,
  Menu,
  Home,
  Settings,
  LogOut,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Trash2,
  Edit2,
  FileText,
  Star,
  Clock,
  Briefcase,
  type LucideIcon,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

export type IconName =
  | "check"
  | "x"
  | "alert-triangle"
  | "info"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevron-down"
  | "search"
  | "user"
  | "menu"
  | "home"
  | "settings"
  | "log-out"
  | "mail"
  | "lock"
  | "phone"
  | "calendar"
  | "map-pin"
  | "trash"
  | "edit"
  | "file-text"
  | "star"
  | "clock"
  | "briefcase"
  | "success-circle"
  | "error-circle"
  | "info-circle";

export const iconsMap: Record<IconName, LucideIcon> = {
  check: Check,
  x: X,
  "alert-triangle": AlertTriangle,
  info: Info,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  search: Search,
  user: User,
  menu: Menu,
  home: Home,
  settings: Settings,
  "log-out": LogOut,
  mail: Mail,
  lock: Lock,
  phone: Phone,
  calendar: Calendar,
  "map-pin": MapPin,
  trash: Trash2,
  edit: Edit2,
  "file-text": FileText,
  star: Star,
  clock: Clock,
  briefcase: Briefcase,
  "success-circle": CheckCircle2,
  "error-circle": XCircle,
  "info-circle": AlertCircle,
};
