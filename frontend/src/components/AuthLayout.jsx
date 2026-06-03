import { Outlet } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader showBackLink={true} />
      <main className="flex-grow flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  );
}