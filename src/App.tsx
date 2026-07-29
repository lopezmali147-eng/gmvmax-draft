import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Demo from './pages/Demo';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Campaigns from './pages/dashboard/Campaigns';
import Rules from './pages/dashboard/Rules';
import Automation from './pages/dashboard/Automation';
import Logs from './pages/dashboard/Logs';
import Metrics from './pages/dashboard/Metrics';
import Accounts from './pages/dashboard/Accounts';
import OAuthTikTokDemo from './pages/OAuthTikTokDemo';
import OAuthCallback from './pages/OAuthCallback';

/**
 * 应用根组件：定义路由表与全局布局（导航 + 内容 + 页脚）。
 * 路由：
 *  - "/"         -> 产品介绍 Landing 页
 *  - "/privacy"  -> 隐私政策页
 *  - "/terms"    -> 服务条款页
 *  - "/demo"     -> 产品演示 Demo 页
 *  - "/dashboard"-> 数据看板（嵌套布局 + 7 个子路由，index 指向 Overview）
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fb]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/oauth/tiktok-demo" element={<OAuthTikTokDemo />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="rules" element={<Rules />} />
            <Route path="automation" element={<Automation />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="logs" element={<Logs />} />
            <Route path="accounts" element={<Accounts />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
