"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  });

  // School Settings
  const [schoolData, setSchoolData] = useState({
    school_name: "Sample Elementary School",
    school_id: "123456",
    division: "Division of Sample City",
    region: "Region III - Central Luzon",
    address: "",
    contact_number: "",
    email: "",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    purchase_request_alerts: true,
    budget_alerts: true,
    disbursement_alerts: true,
    low_stock_alerts: true,
    personnel_updates: false,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    fiscal_year: new Date().getFullYear().toString(),
    currency: "PHP",
    date_format: "MM/DD/YYYY",
    timezone: "Asia/Manila",
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    two_factor_enabled: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        position: "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: Implement API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSchool = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: Implement API call to update school settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save school settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: Implement API call to update notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSystem = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: Implement API call to update system settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save system settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (securityData.new_password !== securityData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: Implement API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setSecurityData({
        current_password: "",
        new_password: "",
        confirm_password: "",
        two_factor_enabled: securityData.two_factor_enabled,
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, school information, and application preferences
        </p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="school" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            School
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    placeholder="+63 912 345 6789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) =>
                      setProfileData({ ...profileData, position: e.target.value })
                    }
                    placeholder="Administrative Officer II"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* School Settings */}
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Configure your school&apos;s details for reports and documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school_name">School Name</Label>
                  <Input
                    id="school_name"
                    value={schoolData.school_name}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, school_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_id">School ID</Label>
                  <Input
                    id="school_id"
                    value={schoolData.school_id}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, school_id: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={schoolData.division}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, division: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={schoolData.region}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, region: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  value={schoolData.address}
                  onChange={(e) =>
                    setSchoolData({ ...schoolData, address: e.target.value })
                  }
                  placeholder="Street, Barangay, City/Municipality, Province"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input
                    id="contact_number"
                    value={schoolData.contact_number}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, contact_number: e.target.value })
                    }
                    placeholder="(02) 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_email">School Email</Label>
                  <Input
                    id="school_email"
                    type="email"
                    value={schoolData.email}
                    onChange={(e) =>
                      setSchoolData({ ...schoolData, email: e.target.value })
                    }
                    placeholder="school@deped.gov.ph"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveSchool} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        email_notifications: checked,
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Purchase Request Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when purchase requests need approval
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.purchase_request_alerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        purchase_request_alerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when budget utilization exceeds 80%
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.budget_alerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        budget_alerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Disbursement Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for disbursement approvals and payments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.disbursement_alerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        disbursement_alerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when inventory items are running low
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.low_stock_alerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        low_stock_alerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Personnel Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for leave requests and personnel changes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.personnel_updates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        personnel_updates: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiscal_year">Fiscal Year</Label>
                  <Select
                    value={systemSettings.fiscal_year}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, fiscal_year: value })
                    }
                  >
                    <SelectTrigger id="fiscal_year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                        (year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, currency: value })
                    }
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">PHP - Philippine Peso</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select
                    value={systemSettings.date_format}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, date_format: value })
                    }
                  >
                    <SelectTrigger id="date_format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) =>
                      setSystemSettings({ ...systemSettings, timezone: value })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Manila">Asia/Manila (GMT+8)</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      System Settings Impact
                    </p>
                    <p className="text-sm text-blue-700">
                      Changes to fiscal year and currency will affect how reports are generated
                      and financial data is displayed across the system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSystem} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={securityData.current_password}
                    onChange={(e) =>
                      setSecurityData({ ...securityData, current_password: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={securityData.new_password}
                      onChange={(e) =>
                        setSecurityData({ ...securityData, new_password: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={securityData.confirm_password}
                      onChange={(e) =>
                        setSecurityData({ ...securityData, confirm_password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a verification code when signing in
                    </p>
                  </div>
                  <Switch
                    checked={securityData.two_factor_enabled}
                    onCheckedChange={(checked) =>
                      setSecurityData({ ...securityData, two_factor_enabled: checked })
                    }
                  />
                </div>

                {securityData.two_factor_enabled && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      Two-factor authentication setup will be completed in the next update.
                      You will receive a QR code to scan with your authenticator app.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">Chrome on Windows - Last active now</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" size="sm">
                    Revoke All Other Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
