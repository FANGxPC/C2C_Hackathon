import React, { useState } from "react";
import { AppShell } from "./components/app-shell";
import { FloatingAIWidget } from "./components/floating-ai-widget";
import { AuthProvider, useAuth } from "./components/auth-provider";
import { Auth } from "./components/pages/auth";
import { Dashboard } from "./components/pages/dashboard";
import { Materials } from "./components/pages/materials";
import { Goals } from "./components/pages/goals";
import { Chat } from "./components/pages/chat";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(user ? "dashboard" : "auth");

  const handleNavigate = (page: string, id?: string) => {
    if (id) {
      setCurrentPage(`${page}/${id}`);
    } else {
      setCurrentPage(page);
    }
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] mx-auto mb-4 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Student Connect
          </h2>
          <p className="text-[var(--text-muted)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    // If not authenticated, show auth page
    if (!user && currentPage !== "auth") {
      setCurrentPage("auth");
      return <Auth onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case "auth":
        return user ? (
          <Dashboard onNavigate={handleNavigate} />
        ) : (
          <Auth onNavigate={handleNavigate} />
        );
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "materials":
        return <Materials onNavigate={handleNavigate} />;
      case "goals":
        return <Goals onNavigate={handleNavigate} />;
      case "chat":
        return <Chat onNavigate={handleNavigate} />;
      case "groups":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Study Groups Coming Soon
              </h2>
              <p className="text-[var(--text-muted)]">
                Connect and collaborate with fellow students.
              </p>
            </div>
          </div>
        );
      case "network":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Network Coming Soon
              </h2>
              <p className="text-[var(--text-muted)]">
                Build your professional network.
              </p>
            </div>
          </div>
        );
      case "companies":
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Companies Coming Soon
              </h2>
              <p className="text-[var(--text-muted)]">
                Explore career opportunities and company insights.
              </p>
            </div>
          </div>
        );
      default:
        if (currentPage.startsWith("materials/")) {
          const materialId = currentPage.split("/")[1];
          return (
            <div className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                  Material Detail
                </h2>
                <p className="text-[var(--text-muted)]">
                  Viewing material: {materialId}
                </p>
              </div>
            </div>
          );
        }
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // Show auth page if not authenticated
  if (!user) {
    return <Auth onNavigate={handleNavigate} />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <AppShell currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </AppShell>

      <FloatingAIWidget context={currentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
