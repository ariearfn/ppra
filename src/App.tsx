import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Panduan from './pages/Panduan'
import Persiapan from './pages/Persiapan'
import Evaluasi from './pages/Evaluasi'
import Gap from './pages/Gap'
import ProgramKerja from './pages/ProgramKerja'
import Timeline from './pages/Timeline'
import KpiPage from './pages/Kpi'
import Koordinasi from './pages/Koordinasi'
import Pelaporan from './pages/Pelaporan'
import Konfirmasi from './pages/Konfirmasi'
import Regulasi from './pages/Regulasi'
import Unduh from './pages/Unduh'
import Pengaturan from './pages/Pengaturan'

const PAGES: Record<string, () => React.JSX.Element> = {
  '': Dashboard,
  panduan: Panduan,
  persiapan: Persiapan,
  evaluasi: Evaluasi,
  gap: Gap,
  program: ProgramKerja,
  timeline: Timeline,
  kpi: KpiPage,
  koordinasi: Koordinasi,
  pelaporan: Pelaporan,
  konfirmasi: Konfirmasi,
  regulasi: Regulasi,
  unduh: Unduh,
  pengaturan: Pengaturan,
}

const readRoute = () => window.location.hash.replace(/^#\/?/, '').split(/[/?]/)[0]

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Page = PAGES[route] ?? Dashboard
  return (
    <Layout current={route in PAGES ? route : ''}>
      <Page />
    </Layout>
  )
}
