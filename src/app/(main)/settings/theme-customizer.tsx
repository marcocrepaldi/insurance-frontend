'use client'

import { useThemeSettings, themePresets } from './use-theme-settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Sun, Moon, Info } from 'lucide-react'
import clsx from 'clsx'

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Maps a color name to its corresponding HSL value.
 * If the color is not found in the map, returns 'transparent'.
 * @param {string} color - The color name
 * @returns {string} The HSL value of the color
 */
/******  ff02bd3f-9f2b-4933-81d6-7163dbf83739  *******/
function getHSL(color: string) {
  const map: Record<string, string> = {
    zinc: 'hsl(240, 5%, 20%)',
    red: 'hsl(0, 84.2%, 60.2%)',
    rose: 'hsl(340, 80%, 65%)',
    orange: 'hsl(24, 94%, 50%)',
    green: 'hsl(142.1, 76.2%, 36.3%)',
    blue: 'hsl(221, 83%, 53%)',
    yellow: 'hsl(47.9, 95.8%, 53.1%)',
    violet: 'hsl(262, 83%, 58%)',
  }
  return map[color] ?? 'transparent'
}

export function ThemeCustomizer() {
  const {
    theme,
    setTheme,
    color,
    setColor,
    radius,
    setRadius,
    applyPreset,
  } = useThemeSettings()

  const colors = ['zinc', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet']
  const radii = ['0', '0.3', '0.5', '0.75', '1.0']

  return (
    <TooltipProvider>
      <div className="rounded-2xl border p-4 w-full max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold">Theme Customizer</h2>
          <p className="text-sm text-muted-foreground">Customize your component styles.</p>
        </div>

        {/* Presets */}
        <div>
          <p className="text-sm font-medium mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(themePresets).map(([name]) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => applyPreset(name)}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <p className="text-sm font-medium mb-2">Color</p>
          <div className="grid grid-cols-4 gap-4">
            {colors.map((c) => {
              const isActive = color === c
              return (
                <div key={c} className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => setColor(c as any)}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      isActive ? 'border-ring scale-110' : 'border-muted',
                      'hover:scale-110',
                      'outline-none focus-visible:ring ring-offset-2 ring-ring ring-offset-background'
                    )}
                    style={{ backgroundColor: getHSL(c) }}
                  />
                  <span className="text-xs capitalize text-muted-foreground">{c}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Radius Picker */}
        <div>
          <p className="text-sm font-medium mb-2">Radius</p>
          <div className="flex flex-wrap gap-2">
            {radii.map((r) => (
              <Button
                key={r}
                variant={radius === r ? 'default' : 'outline'}
                onClick={() => setRadius(r as any)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* Mode Switch */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Mode</span>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-4 w-4 mr-1" /> Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-4 w-4 mr-1" /> Dark
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <p className="text-sm font-medium">Live Preview</p>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default">Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Badge>Badge</Badge>
                <Switch />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dica com Tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Input placeholder="Digite algo..." />

              <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                Este é um bloco com <code className="font-mono">bg-primary</code>
              </div>

              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">Conta</TabsTrigger>
                  <TabsTrigger value="senha">Senha</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Conteúdo da Conta</TabsContent>
                <TabsContent value="senha">Conteúdo da Senha</TabsContent>
              </Tabs>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Alerta</AlertTitle>
                <AlertDescription>
                  Isso é um exemplo de alerta com tema aplicado.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
