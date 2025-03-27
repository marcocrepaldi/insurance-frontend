import { ThemeDebugger } from '../../../components/theme-debugger'
import { ThemeCustomizer } from './theme-customizer'

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <ThemeCustomizer />
      <ThemeDebugger />
    </div>
  )
}
