import { X, Bluetooth, Watch, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, Droplets, Pill } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SettingsMenuProps {
  open: boolean;
  onClose: () => void;
}

const settingsItems = [
  { icon: Bluetooth, label: "Bluetooth", subtitle: "Connected", hasToggle: true, on: true },
  { icon: Watch, label: "Watch Pairing", subtitle: "Alex's Rihla Watch", hasToggle: false },
  { icon: Droplets, label: "Water Resistance", subtitle: "IP68 — Up to 50m", hasToggle: false },
  { icon: Bell, label: "Notifications", subtitle: "All enabled", hasToggle: true, on: true },
  { icon: Pill, label: "Medicine Reminders", subtitle: "3 active", hasToggle: true, on: true },
  { icon: Moon, label: "Sleep Mode", subtitle: "10 PM - 6 AM", hasToggle: true, on: false },
  { icon: Shield, label: "Privacy", subtitle: "Manage data", hasToggle: false },
  { icon: HelpCircle, label: "Help & Support", subtitle: "", hasToggle: false },
];

const SettingsMenu = ({ open, onClose }: SettingsMenuProps) => {
  const { user, signOut } = useAuth();
  return (
    <>
      <div
        className={`absolute inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-card z-50 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Settings</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-card rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">👤</div>
            <div>
              <p className="font-medium">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Not signed in"}</p>
            </div>
          </div>

          <div className="space-y-1">
            {settingsItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.subtitle && <p className="text-xs text-muted-foreground">{item.subtitle}</p>}
                </div>
                {item.hasToggle ? (
                  <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${item.on ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${item.on ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-5">
            <button onClick={signOut} className="flex items-center gap-2 text-destructive text-sm font-medium p-3">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
