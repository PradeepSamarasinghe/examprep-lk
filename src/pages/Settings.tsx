import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage, type Lang } from "@/hooks/use-language";
import { motion } from "framer-motion";
import {
  User, Bell, Palette, Globe, Shield, Save, Camera,
  Moon, Sun, Volume2, VolumeX, Mail, Smartphone
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: "en" as Lang, label: "English", flag: "🇬🇧" },
  { code: "si" as Lang, label: "සිංහල", flag: "🇱🇰" },
  { code: "ta" as Lang, label: "தமிழ்", flag: "🇱🇰" },
];

const Settings = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { theme: selectedTheme, setTheme: setSelectedTheme } = useTheme();
  const { lang: selectedLang, setLang: setSelectedLang } = useLanguage();

  const themes = [
    { id: "dark" as const, label: t("settings.dark"), icon: Moon, desc: t("settings.darkDesc") },
    { id: "light" as const, label: t("settings.light"), icon: Sun, desc: t("settings.lightDesc") },
    { id: "system" as const, label: t("settings.system"), icon: Palette, desc: t("settings.systemDesc") },
  ];

  const [profile, setProfile] = useState({
    name: "Sanduni Herath",
    email: "sanduni@example.com",
    school: "Musaeus College",
    stream: "Science",
    year: "Year 2",
    phone: "+94 77 123 4567",
  });

  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    challengeInvites: true,
    leaderboardUpdates: false,
    emailNotifs: true,
    pushNotifs: true,
    soundEffects: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved ✅",
      description: "Your preferences have been updated.",
    });
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">{t("settings.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("settings.desc")}</p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-muted/50 rounded-lg p-1">
            <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <User className="w-4 h-4" /> {t("settings.profile")}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Bell className="w-4 h-4" /> {t("settings.alerts")}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Palette className="w-4 h-4" /> {t("settings.theme")}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Shield className="w-4 h-4" /> {t("settings.privacy")}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    SH
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.stream} · {profile.year}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: t("settings.fullName"), field: "name", type: "text" },
                  { label: t("settings.email"), field: "email", type: "email" },
                  { label: t("settings.school"), field: "school", type: "text" },
                  { label: t("settings.phone"), field: "phone", type: "tel" },
                ].map((item) => (
                  <div key={item.field} className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{item.label}</Label>
                    <Input
                      type={item.type}
                      value={profile[item.field as keyof typeof profile]}
                      onChange={(e) => handleProfileChange(item.field, e.target.value)}
                      className="bg-muted/50 border-border/50"
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">{t("settings.stream")}</Label>
                  <div className="flex gap-2">
                    {["Science", "Maths", "Commerce", "Arts"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleProfileChange("stream", s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          profile.stream === s
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">{t("settings.year")}</Label>
                  <div className="flex gap-2">
                    {["Year 1", "Year 2", "Repeat"].map((y) => (
                      <button
                        key={y}
                        onClick={() => handleProfileChange("year", y)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          profile.year === y
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-blue"
              >
                <Save className="w-4 h-4" /> {t("settings.saveChanges")}
              </button>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> {t("settings.studyReminders")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{t("settings.studyRemindersDesc")}</p>
                <div className="space-y-4">
                  {[
                    { key: "dailyReminder", label: t("settings.dailyReminder"), desc: t("settings.dailyReminderDesc") },
                    { key: "weeklyReport", label: t("settings.weeklyReport"), desc: t("settings.weeklyReportDesc") },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={() => handleNotifToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-accent" /> {t("settings.socialCompetitive")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{t("settings.socialCompetitiveDesc")}</p>
                <div className="space-y-4">
                  {[
                    { key: "challengeInvites", label: t("settings.challengeInvites"), desc: t("settings.challengeInvitesDesc") },
                    { key: "leaderboardUpdates", label: t("settings.leaderboardUpdates"), desc: t("settings.leaderboardUpdatesDesc") },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={() => handleNotifToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-warning" /> {t("settings.deliveryChannels")}
                </h3>
                <div className="space-y-4 mt-4">
                  {[
                    { key: "emailNotifs", label: t("settings.emailNotifs"), icon: Mail },
                    { key: "pushNotifs", label: t("settings.pushNotifs"), icon: Smartphone },
                    { key: "soundEffects", label: t("settings.soundEffects"), icon: notifications.soundEffects ? Volume2 : VolumeX },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={() => handleNotifToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-blue"
              >
                <Save className="w-4 h-4" /> {t("settings.savePreferences")}
              </button>
            </motion.div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-secondary" /> {t("settings.themeLabel")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{t("settings.themeDesc")}</p>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        selectedTheme === theme.id
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-muted/30 hover:border-border"
                      }`}
                    >
                      <theme.icon className={`w-6 h-6 mx-auto mb-2 ${selectedTheme === theme.id ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="text-sm font-semibold text-foreground">{theme.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" /> {t("settings.language")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{t("settings.languageDesc")}</p>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        selectedLang === lang.code
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-muted/30 hover:border-border"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{lang.flag}</span>
                      <p className="text-sm font-semibold text-foreground">{lang.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-blue"
              >
                <Save className="w-4 h-4" /> {t("settings.applyChanges")}
              </button>
            </motion.div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 space-y-6">
              <div>
                <h3 className="font-display font-bold text-foreground mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" /> {t("settings.privacyVisibility")}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">{t("settings.privacyDesc")}</p>
                <div className="space-y-4">
                  {[
                    { key: "showProfile", label: t("settings.showProfile"), desc: t("settings.showProfileDesc"), default: true },
                    { key: "showStreak", label: t("settings.showStreak"), desc: t("settings.showStreakDesc"), default: true },
                    { key: "allowChallenges", label: t("settings.allowChallenges"), desc: t("settings.allowChallengesDesc"), default: true },
                    { key: "shareAnalytics", label: t("settings.shareAnalytics"), desc: t("settings.shareAnalyticsDesc"), default: false },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.default} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                <h4 className="text-sm font-semibold text-destructive mb-1">{t("settings.dangerZone")}</h4>
                <p className="text-xs text-muted-foreground mb-3">{t("settings.dangerDesc")}</p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors">
                    {t("settings.resetProgress")}
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors">
                    {t("settings.deleteAccount")}
                  </button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
