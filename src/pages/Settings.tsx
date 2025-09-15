import { useState } from 'react';
import { Volume2, Palette, Download, Bell, Lock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
  const [volume, setVolume] = useState([70]);
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [theme, setTheme] = useState('dark');

  const settingsGroups = [
    {
      title: 'Playback',
      icon: Volume2,
      settings: [
        {
          type: 'slider',
          label: 'Volume',
          value: volume,
          onChange: setVolume,
          description: 'Adjust the default playback volume'
        },
        {
          type: 'switch',
          label: 'High Quality Audio',
          checked: highQuality,
          onChange: setHighQuality,
          description: 'Stream audio at higher quality (uses more data)'
        },
        {
          type: 'switch',
          label: 'Crossfade',
          checked: false,
          onChange: () => {},
          description: 'Seamlessly blend tracks together'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          type: 'select',
          label: 'Theme',
          value: theme,
          onChange: setTheme,
          options: [
            { value: 'dark', label: 'Dark (Purple)' },
            { value: 'light', label: 'Light' },
            { value: 'auto', label: 'Auto' }
          ],
          description: 'Choose your preferred theme'
        }
      ]
    },
    {
      title: 'Downloads',
      icon: Download,
      settings: [
        {
          type: 'switch',
          label: 'Auto Download',
          checked: autoDownload,
          onChange: setAutoDownload,
          description: 'Automatically download liked songs for offline listening'
        },
        {
          type: 'select',
          label: 'Download Quality',
          value: 'high',
          options: [
            { value: 'normal', label: 'Normal (96kbps)' },
            { value: 'high', label: 'High (160kbps)' },
            { value: 'very-high', label: 'Very High (320kbps)' }
          ],
          description: 'Audio quality for downloaded tracks'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          type: 'switch',
          label: 'Push Notifications',
          checked: notifications,
          onChange: setNotifications,
          description: 'Receive notifications about new releases and recommendations'
        },
        {
          type: 'switch',
          label: 'Email Updates',
          checked: false,
          onChange: () => {},
          description: 'Get email updates about your music activity'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      settings: [
        {
          type: 'switch',
          label: 'Private Session',
          checked: false,
          onChange: () => {},
          description: 'Hide your activity from friends and followers'
        },
        {
          type: 'switch',
          label: 'Data Sharing',
          checked: true,
          onChange: () => {},
          description: 'Help improve recommendations by sharing listening data'
        }
      ]
    }
  ];

  const renderSetting = (setting: any) => {
    switch (setting.type) {
      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>{setting.label}</Label>
              <span className="text-sm text-muted-foreground">{setting.value[0]}%</span>
            </div>
            <Slider
              value={setting.value}
              onValueChange={setting.onChange}
              max={100}
              step={1}
              className="w-full"
            />
            {setting.description && (
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            )}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{setting.label}</Label>
              {setting.description && (
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              )}
            </div>
            <Switch
              checked={setting.checked}
              onCheckedChange={setting.onChange}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label>{setting.label}</Label>
            <Select value={setting.value} onValueChange={setting.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {setting.description && (
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your music experience</p>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <group.icon className="h-5 w-5 text-primary" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {group.settings.map((setting, index) => (
                <div key={index}>{renderSetting(setting)}</div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Version</Label>
                <p className="text-xs text-muted-foreground">Music Streaming App v1.0.0</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                Privacy Policy
              </Button>
              <Button variant="outline" size="sm">
                Terms of Service
              </Button>
              <Button variant="outline" size="sm">
                Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}